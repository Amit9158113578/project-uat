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
exports.BootupService = void 0;
const inversify_1 = require("inversify");
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const body_parser_1 = require("body-parser");
const cookieParser = require("cookie-parser");
const httpContext = require("express-http-context");
const baseDIConfig_1 = require("./baseDIConfig");
const commonUtils_1 = require("../util/commonUtils");
const passport = require("passport");
const baseIdentifiers_1 = require("./baseIdentifiers");
const commonConstants_1 = require("../constants/commonConstants");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cors = require("cors");
const fileUpload = require("express-fileupload");
/**

 * @description Bootup service

 */
let BootupService = class BootupService {
    constructor(iLoggerService, authMiddleware) {
        this.iLoggerService = iLoggerService;
        this.authMiddleware = authMiddleware;
        this.initDefaultMiddleware = (app, bootupConfig) => __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('BootupService::initDefaultMiddleware - Initialize default middleware');
            app.use(compression());
            app.use((0, body_parser_1.urlencoded)({ extended: false, limit: '10mb' }));
            app.use((0, body_parser_1.json)({ limit: '10mb' }));
            app.use(cookieParser());
            app.use(httpContext.middleware);
            app.set(commonConstants_1.CommonConstants.TRUST_PROXY, 1);
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
            if (!commonUtils_1.CommonUtils.isEmpty(bootupConfig.middlewares)) {
                bootupConfig.middlewares.forEach(middleware => {
                    app.use(middleware);
                });
            }
            app.set('view engine', 'ejs');
        });
        this.configureRoutes = (app, bootupConfig) => __awaiter(this, void 0, void 0, function* () {
            const container = baseDIConfig_1.BaseDIConfig.getContainer();
            if (container) {
                if (!commonUtils_1.CommonUtils.isEmpty(bootupConfig.controllers)) {
                    bootupConfig.controllers.forEach(controllerIdentifier => {
                        let controller = container.get(controllerIdentifier);
                        if (controller) {
                            app.use(controller.getRoutes());
                        }
                        else {
                            this.iLoggerService.debug('BootupService::configureRoutes - Invalid controller identifier %s', controllerIdentifier);
                        }
                    });
                }
                else {
                    this.iLoggerService.debug('BootupService::configureRoutes - No REST routes found');
                }
            }
            else {
                throw new Error('Context is not initialized');
            }
        });
    }
    start(bootupConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('BootupService::start - bootupConfig', bootupConfig);
            const app = express();
            this.authMiddleware.setPublicRoutes(bootupConfig.publicRoutes);
            if (!commonUtils_1.CommonUtils.isEmpty(bootupConfig.staticPaths)) {
                bootupConfig.staticPaths.forEach((path) => {
                    this.iLoggerService.debug('Express static path: ', path);
                    app.use(express.static(path));
                });
            }
            yield this.initDefaultMiddleware(app, bootupConfig);
            yield this.configureRoutes(app, bootupConfig);
            return app;
        });
    }
};
BootupService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService)),
    __param(1, (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AuthMiddleware)),
    __metadata("design:paramtypes", [Object, authMiddleware_1.AuthMiddleware])
], BootupService);
exports.BootupService = BootupService;
