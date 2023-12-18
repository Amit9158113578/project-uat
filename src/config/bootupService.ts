import { injectable, inject, Container } from 'inversify';
import { IBootupConfig } from './iBootupConfig';
import * as compression from 'compression';
import { ILoggerService } from '../service/util/iLoggerService';
import { Application } from 'express';
import * as express from 'express';
import * as helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as httpContext from 'express-http-context';
import { BaseDIConfig } from './baseDIConfig';
import { BaseController } from '../controller/baseController';
import { CommonUtils } from '../util/commonUtils';
import * as passport from 'passport';
import { BaseIdentifiers } from './baseIdentifiers';
import { CommonConstants } from '../constants/commonConstants';
import { AuthMiddleware } from '../middleware/authMiddleware';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';

/**

 * @description Bootup service

 */
@injectable()
export class BootupService {


    public constructor(@inject(BaseIdentifiers.LoggerService) private iLoggerService: ILoggerService,
        @inject(BaseIdentifiers.AuthMiddleware) private authMiddleware: AuthMiddleware) {
    }

    public async start(bootupConfig: IBootupConfig): Promise<Application> {
        this.iLoggerService.debug('BootupService::start - bootupConfig', bootupConfig);
        const app: Application = express();
        this.authMiddleware.setPublicRoutes(bootupConfig.publicRoutes);
        if (!CommonUtils.isEmpty(bootupConfig.staticPaths)) {
            bootupConfig.staticPaths.forEach((path: string) => {
                this.iLoggerService.debug('Express static path: ', path);
                app.use(express.static(path));
            });
        }

        await this.initDefaultMiddleware(app, bootupConfig);
        await this.configureRoutes(app, bootupConfig);
        return app;
    }

    private readonly initDefaultMiddleware = async (app: Application, bootupConfig: IBootupConfig) => {
        this.iLoggerService.debug('BootupService::initDefaultMiddleware - Initialize default middleware');
        app.use(compression());
        app.use(urlencoded({ extended: false, limit: '10mb' }));
        app.use(json({ limit: '10mb' }));
        app.use(cookieParser());
        app.use(httpContext.middleware);
        app.set(CommonConstants.TRUST_PROXY, 1);
        app.use(helmet());
        app.use(passport.initialize());
        app.use(passport.session());
        // Max upload size 50MB
        app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        // CORS Configuration
        app.use(cors({
            methods: bootupConfig.allowedMethods,
            origin: bootupConfig.allowedOrigins
        }));

        if (!CommonUtils.isEmpty(bootupConfig.middlewares)) {
            bootupConfig.middlewares.forEach(middleware => {
                app.use(middleware);
            });
        }
        app.set('view engine', 'ejs');
    }

    private readonly configureRoutes = async (app: Application, bootupConfig: IBootupConfig) => {
        const container: Container = BaseDIConfig.getContainer();
        if (container) {
            if (!CommonUtils.isEmpty(bootupConfig.controllers)) {
                bootupConfig.controllers.forEach(controllerIdentifier => {
                    let controller = container.get<BaseController>(controllerIdentifier);
                    if (controller) {
                        app.use(controller.getRoutes());
                    } else {
                        this.iLoggerService.debug('BootupService::configureRoutes - Invalid controller identifier %s',
                            controllerIdentifier);
                    }
                });
            } else {
                this.iLoggerService.debug('BootupService::configureRoutes - No REST routes found');
            }
        } else {
            throw new Error('Context is not initialized');
        }
    }

}
