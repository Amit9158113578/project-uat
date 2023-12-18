import { BaseDIConfig } from './config/baseDIConfig';
import { BootupService } from './config/bootupService';
import { IBootupConfig } from './config/iBootupConfig';
import { BaseIdentifiers } from './config/baseIdentifiers';
import * as http from 'http';
import { Application } from 'express';
import { AuthMiddleware } from './middleware/authMiddleware';
import { RequestContextMiddleware } from './middleware/requestContextMiddleware';
import { ILoggerService } from './service/util/iLoggerService';
import { URLConstants } from './constants/urlConstants';
import * as https from 'https'; // Add this line to import the 'https' module
import * as fs from 'fs'; // Add this line to import the 'fs' module for file operations

/**

 * @description Express server

 */
export class Server {

    private httpServer: http.Server;

    private httpsServer: http.Server | null = null; // Add a new property for HTTPS server

    /**

     * @description starts express server
     */
    public async start(): Promise<Application> {
        try {
            const diContainer = await BaseDIConfig.register();
            const bootupService = diContainer.get<BootupService>(BaseIdentifiers.BootupService);
            const authMiddleware = diContainer.get<AuthMiddleware>(BaseIdentifiers.AuthMiddleware);
            const iLoggerService = diContainer.get<ILoggerService>(BaseIdentifiers.LoggerService);
            const requestContextMiddleware = diContainer.get<RequestContextMiddleware>(BaseIdentifiers.RequestContextMiddleware);
            // const appVariables = diContainer.get<AppVariables>(BaseIdentifiers.AppVariables);
            // await appVariables.loadConfiguration();
            iLoggerService.debug('Server::start - Set application CORS settings');
            iLoggerService.debug('Server::start - CORS settings Allowed Origins');
            let bootupConfig: IBootupConfig = {
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
                    BaseIdentifiers.TestController,
                    BaseIdentifiers.LoginController,
                    BaseIdentifiers.UserController,
                    BaseIdentifiers.ResourceController,
                    BaseIdentifiers.ClientController,
                    BaseIdentifiers.RoleController,
                    BaseIdentifiers.DepartmentController,
                    BaseIdentifiers.CategoryController,
                    BaseIdentifiers.DocumentController,
                    BaseIdentifiers.ProjectController,
                    BaseIdentifiers.JobTitleController,
                    BaseIdentifiers.ResourceMatrixController
                ],
                middlewares: [authMiddleware.invoke, requestContextMiddleware.invoke],
                publicRoutes: [
                    URLConstants.URL_LOGIN,
                    `${URLConstants.URL_LOGIN}/resetPassword`,
                    URLConstants.URL_Tests
                ],
                staticPaths: [`${__dirname}/public`],
            };
            const app = await bootupService.start(bootupConfig);
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
        } catch (e) {
            let message = 'app:Error starting app';
            console.error(message);
            console.error(e);
            throw e;
        }
    }

    /**

     * @description terminates express server
     */
    public stop() {
        if (this.httpServer != null) {
            console.log('ExpressServer:stop:Terminating Test server');
            this.httpServer.close();
        }
    }

}
