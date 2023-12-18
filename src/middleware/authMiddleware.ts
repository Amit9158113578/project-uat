import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILoggerService } from '../service/util/iLoggerService';
import { BaseIdentifiers } from '../config/baseIdentifiers';
import { CommonUtils } from '../util/commonUtils';
import * as JWT from 'jsonwebtoken';
import { CommonConstants } from '../constants/commonConstants';
import { SessionInfo } from '../types/sessionInfo';
import { ErrorCodes } from '../constants/errorCodes';
const URLAuthorizationMapping = require('../private/authorization/URLAuthorizationMapping');
/**

 * @description Authentication middleware

 */
@injectable()
export class AuthMiddleware {


    private iLoggerService: ILoggerService;

    private publicRoutes: string[];



    public constructor(@inject(BaseIdentifiers.LoggerService) iLoggerService: ILoggerService) {
        this.iLoggerService = iLoggerService;
    }

    /**
     * setPublicRoutes
     */
    public setPublicRoutes(publicRoutes: string[]) {
        this.publicRoutes = publicRoutes;
    }

    public invoke = async (request: Request, res: Response, next: NextFunction) => {
        this.iLoggerService.debug('AuthMiddleware :: middleware', request);
        this.iLoggerService.debug('Host : ', request.host);
        this.iLoggerService.debug('URL : ', request.url);
        this.iLoggerService.debug('Origin : ', request.headers.origin);
        this.iLoggerService.debug('Request Path : ', request.path);
        if (!CommonUtils.isEmpty(this.publicRoutes) && CommonUtils.isPublicRoute(request, this.publicRoutes)) {
            this.iLoggerService.debug('AuthMiddleware :: Public route: ', this.publicRoutes);
            next();
        } else {
            const authorizationToken = request.headers.authorization;
            if (authorizationToken) {
                let tokenParts = authorizationToken.split(' ');
                if (tokenParts.length === 2 && tokenParts[0] && tokenParts[0] === 'Bearer' && tokenParts[1]) {
                    const token = tokenParts[1];
                    JWT.verify(token,  CommonConstants.JWTPRIVATEKEY, {
                        audience: CommonConstants.AUDIENCE,
                        issuer: CommonConstants.ISSUER,
                    },
                        async (err, decoded: any) => {
                            if (err) {
                                this.iLoggerService.error('Error - AuthMiddleware::invoke - JWT Error', err);
                                res.status(401).send({ errorCode: 'INVALID_AUTHORIZATION' });
                            } else {
                                this.iLoggerService.debug('AuthMiddleware::invoke - JWT verified', decoded);
                                const sessionInfo: SessionInfo = {
                                    host: decoded.aud,
                                    organizationId: decoded.organizationId,
                                    scopes: decoded.scopes,
                                    status: decoded.status,
                                    timezone: decoded.timezone,
                                    userId: decoded.id,
                                };
                                // Verify Authorization
                                const baseRoutePath = CommonUtils.getBaseRoutePath(request.url);
                                if (URLAuthorizationMapping[baseRoutePath.basePath]) {
                                    let isAuthorized = false;
                                    const RoutesAuthorizations = require(`../private/authorization/${URLAuthorizationMapping[baseRoutePath.basePath]}`);
                                    for (let index = 0; index < RoutesAuthorizations.length; index++) {
                                        const routeAuthorization = RoutesAuthorizations[index];
                                        if (CommonUtils.matchPathPattern(baseRoutePath.routePath, routeAuthorization.url) &&
                                            request.method.toLocaleLowerCase() === routeAuthorization.method.toLocaleLowerCase()) {
                                            for (let index = 0; index < sessionInfo.scopes.length; index++) {
                                                const element = sessionInfo.scopes[index];
                                                isAuthorized = routeAuthorization.allowedScopes.includes(element);
                                                if (isAuthorized) {
                                                    break;
                                                }
                                            }
                                            if (!isAuthorized) {
                                                res.status(401).send({ errorCode: ErrorCodes.ERR_API_PERMISSION_DENIED });
                                                return;
                                            } else {
                                                if (routeAuthorization.output) {
                                                    routeAuthorization.output.forEach((outputElement: any) => {
                                                        sessionInfo.scopes.forEach(element => {
                                                            if (outputElement.scopes.includes(element)) {
                                                                request[CommonConstants.OUTPUT_NAME] = outputElement;
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                request[CommonConstants.SESSION_INFO_NAME] = sessionInfo;
                                next();
                            }
                        });
                } else {
                    res.status(401).send({ error: 'unauthorized' });
                }
            } else {
                res.status(401).send({ error: 'unauthorized' });
            }
        }
    }
}
