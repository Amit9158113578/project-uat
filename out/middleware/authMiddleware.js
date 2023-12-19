"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../config/baseIdentifiers");
const commonUtils_1 = require("../util/commonUtils");
const JWT = require("jsonwebtoken");
const commonConstants_1 = require("../constants/commonConstants");
const errorCodes_1 = require("../constants/errorCodes");
const URLAuthorizationMapping = require('../private/authorization/URLAuthorizationMapping');
/**

 * @description Authentication middleware

 */
let AuthMiddleware = class AuthMiddleware {
    constructor(iLoggerService) {
        this.invoke = (request, res, next) => __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('AuthMiddleware :: middleware', request);
            this.iLoggerService.debug('Host : ', request.host);
            this.iLoggerService.debug('URL : ', request.url);
            this.iLoggerService.debug('Origin : ', request.headers.origin);
            this.iLoggerService.debug('Request Path : ', request.path);
            if (!commonUtils_1.CommonUtils.isEmpty(this.publicRoutes) && commonUtils_1.CommonUtils.isPublicRoute(request, this.publicRoutes)) {
                this.iLoggerService.debug('AuthMiddleware :: Public route: ', this.publicRoutes);
                next();
            }
            else {
                const authorizationToken = request.headers.authorization;
                if (authorizationToken) {
                    let tokenParts = authorizationToken.split(' ');
                    if (tokenParts.length === 2 && tokenParts[0] && tokenParts[0] === 'Bearer' && tokenParts[1]) {
                        const token = tokenParts[1];
                        JWT.verify(token, commonConstants_1.CommonConstants.JWTPRIVATEKEY, {
                            audience: commonConstants_1.CommonConstants.AUDIENCE,
                            issuer: commonConstants_1.CommonConstants.ISSUER,
                        }, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                this.iLoggerService.error('Error - AuthMiddleware::invoke - JWT Error', err);
                                res.status(401).send({ errorCode: 'INVALID_AUTHORIZATION' });
                            }
                            else {
                                this.iLoggerService.debug('AuthMiddleware::invoke - JWT verified', decoded);
                                const sessionInfo = {
                                    host: decoded.aud,
                                    organizationId: decoded.organizationId,
                                    scopes: decoded.scopes,
                                    status: decoded.status,
                                    timezone: decoded.timezone,
                                    userId: decoded.id,
                                };
                                // Verify Authorization
                                const baseRoutePath = commonUtils_1.CommonUtils.getBaseRoutePath(request.url);
                                if (URLAuthorizationMapping[baseRoutePath.basePath]) {
                                    let isAuthorized = false;
                                    const RoutesAuthorizations = require(`../private/authorization/${URLAuthorizationMapping[baseRoutePath.basePath]}`);
                                    for (let index = 0; index < RoutesAuthorizations.length; index++) {
                                        const routeAuthorization = RoutesAuthorizations[index];
                                        if (commonUtils_1.CommonUtils.matchPathPattern(baseRoutePath.routePath, routeAuthorization.url) &&
                                            request.method.toLocaleLowerCase() === routeAuthorization.method.toLocaleLowerCase()) {
                                            for (let index = 0; index < sessionInfo.scopes.length; index++) {
                                                const element = sessionInfo.scopes[index];
                                                isAuthorized = routeAuthorization.allowedScopes.includes(element);
                                                if (isAuthorized) {
                                                    break;
                                                }
                                            }
                                            if (!isAuthorized) {
                                                res.status(401).send({ errorCode: errorCodes_1.ErrorCodes.ERR_API_PERMISSION_DENIED });
                                                return;
                                            }
                                            else {
                                                if (routeAuthorization.output) {
                                                    routeAuthorization.output.forEach((outputElement) => {
                                                        sessionInfo.scopes.forEach(element => {
                                                            if (outputElement.scopes.includes(element)) {
                                                                request[commonConstants_1.CommonConstants.OUTPUT_NAME] = outputElement;
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                request[commonConstants_1.CommonConstants.SESSION_INFO_NAME] = sessionInfo;
                                next();
                            }
                        }));
                    }
                    else {
                        res.status(401).send({ error: 'unauthorized' });
                    }
                }
                else {
                    res.status(401).send({ error: 'unauthorized' });
                }
            }
        });
        this.iLoggerService = iLoggerService;
    }
    /**
     * setPublicRoutes
     */
    setPublicRoutes(publicRoutes) {
        this.publicRoutes = publicRoutes;
    }
};
AuthMiddleware = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService)),
    __metadata("design:paramtypes", [Object])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
