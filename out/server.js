"use strict";
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
exports.Server = void 0;
const baseDIConfig_1 = require("./config/baseDIConfig");
const baseIdentifiers_1 = require("./config/baseIdentifiers");
const urlConstants_1 = require("./constants/urlConstants");
const https = require("https"); // Add this line to import the 'https' module
const fs = require("fs"); // Add this line to import the 'fs' module for file operations
/**

 * @description Express server

 */
class Server {
    constructor() {
        this.httpsServer = null; // Add a new property for HTTPS server
    }
    /**

     * @description starts express server
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const diContainer = yield baseDIConfig_1.BaseDIConfig.register();
                const bootupService = diContainer.get(baseIdentifiers_1.BaseIdentifiers.BootupService);
                const authMiddleware = diContainer.get(baseIdentifiers_1.BaseIdentifiers.AuthMiddleware);
                const iLoggerService = diContainer.get(baseIdentifiers_1.BaseIdentifiers.LoggerService);
                const requestContextMiddleware = diContainer.get(baseIdentifiers_1.BaseIdentifiers.RequestContextMiddleware);
                // const appVariables = diContainer.get<AppVariables>(BaseIdentifiers.AppVariables);
                // await appVariables.loadConfiguration();
                iLoggerService.debug('Server::start - Set application CORS settings');
                iLoggerService.debug('Server::start - CORS settings Allowed Origins');
                let bootupConfig = {
                    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
                    allowedOrigins: [
                        'http://localhost',
                        'http://localhost:4200',
                        'http://localhost:63351',
                        'http://192.64.85.117',
                        'http://192.64.85.117/promanage-ui',
                        'https://project.comsensetechnologies.com',
                        'http://3.109.10.127',
                        'http://3.109.10.127/promanage-ui',
                        'https://project.comsensetechnologies.com/promanage-ui',
                        'https://3.109.10.127',
                        'http://3.109.10.127/promanage-ui',
                        'http://3.7.58.32',
                        'https://3.7.58.32',
                        'http://3.7.58.32/promanage-ui',
                        'https://3.7.58.32/promanage-ui'
                    ],
                    controllers: [
                        baseIdentifiers_1.BaseIdentifiers.TestController,
                        baseIdentifiers_1.BaseIdentifiers.LoginController,
                        baseIdentifiers_1.BaseIdentifiers.UserController,
                        baseIdentifiers_1.BaseIdentifiers.ResourceController,
                        baseIdentifiers_1.BaseIdentifiers.ClientController,
                        baseIdentifiers_1.BaseIdentifiers.RoleController,
                        baseIdentifiers_1.BaseIdentifiers.DepartmentController,
                        baseIdentifiers_1.BaseIdentifiers.CategoryController,
                        baseIdentifiers_1.BaseIdentifiers.DocumentController,
                        baseIdentifiers_1.BaseIdentifiers.ProjectController,
                        baseIdentifiers_1.BaseIdentifiers.JobTitleController,
                        baseIdentifiers_1.BaseIdentifiers.ResourceMatrixController
                    ],
                    middlewares: [authMiddleware.invoke, requestContextMiddleware.invoke],
                    publicRoutes: [
                        urlConstants_1.URLConstants.URL_LOGIN,
                        `${urlConstants_1.URLConstants.URL_LOGIN}/resetPassword`,
                        urlConstants_1.URLConstants.URL_Tests
                    ],
                    staticPaths: [`${__dirname}/public`],
                };
                const app = yield bootupService.start(bootupConfig);
                /*this.httpServer = http.createServer(app);
                const port = process.env.PORT ? process.env.PORT : 3000;
                this.httpServer = app.listen(port, async () => {
                    let message = 'ExpressServer:start:Express server listening on port ' + port;
                    iLoggerService.debug(message);
                });
                //temp
                */
                // Create an HTTPS server
                this.httpsServer = https.createServer({
                    key: fs.readFileSync('/opt/cert/comsensetechnologies.key'),
                    cert: fs.readFileSync('/opt/cert/comsensetechnologies.crt')
                }, app);
                // Start the HTTPS server
                const httpsPort = 8092; // You can change this to the desired HTTPS port
                this.httpsServer.listen(httpsPort, () => {
                    let message = 'ExpressServer:start:HTTPS server listening on port ' + httpsPort;
                    iLoggerService.debug(message);
                });
                return app;
            }
            catch (e) {
                let message = 'app:Error starting app';
                console.error(message);
                console.error(e);
                throw e;
            }
        });
    }
    /**

     * @description terminates express server
     */
    stop() {
        if (this.httpServer != null) {
            console.log('ExpressServer:stop:Terminating Test server');
            this.httpServer.close();
        }
    }
}
exports.Server = Server;
