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
exports.BaseDIConfig = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const bootupService_1 = require("./bootupService");
const loggerService_1 = require("../service/util/impl/loggerService");
const baseIdentifiers_1 = require("./baseIdentifiers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const requestContext_1 = require("./requestContext");
const requestContextMiddleware_1 = require("../middleware/requestContextMiddleware");
const mongoDbService_1 = require("../service/db/impl/mongoDbService");
const mongoDbReadService_1 = require("../service/db/impl/mongoDbReadService");
const mongoDbClient_1 = require("../service/db/impl/mongoDbClient");
const mongoDbWriteService_1 = require("../service/db/impl/mongoDbWriteService");
const userService_1 = require("../service/domain/impl/userService");
const appVariables_1 = require("./appVariables");
const nodeMailerService_1 = require("../service/util/impl/nodeMailerService");
const googleMapService_1 = require("../service/util/impl/googleMapService");
const s3FileService_1 = require("../service/util/impl/s3FileService");
const htmlPdfService_1 = require("../service/util/impl/htmlPdfService");
const googleCalendarService_1 = require("../service/util/impl/googleCalendarService");
const fcmNotificationService_1 = require("../service/util/impl/fcmNotificationService");
const awsReminderService_1 = require("../service/util/impl/awsReminderService");
const axiosHttpService_1 = require("../service/util/impl/axiosHttpService");
const twilioSmsService_1 = require("../service/util/impl/twilioSmsService");
const TestController_1 = require("../controller/domain/TestController");
const loginController_1 = require("../controller/core/loginController");
const userController_1 = require("../controller/core/userController");
const ResourceController_1 = require("../controller/domain/ResourceController");
const ResourceService_1 = require("../service/domain/impl/ResourceService");
const ClientController_1 = require("../controller/domain/ClientController");
const ClientService_1 = require("../service/domain/impl/ClientService");
const RoleController_1 = require("../controller/domain/RoleController");
const RoleService_1 = require("../service/domain/impl/RoleService");
const DepartmentService_1 = require("../service/domain/impl/DepartmentService");
const DepartmentController_1 = require("../controller/domain/DepartmentController");
const CategoryService_1 = require("../service/domain/impl/CategoryService");
const CategoryController_1 = require("../controller/domain/CategoryController");
const DocumentController_1 = require("../controller/domain/DocumentController");
const ProjectController_1 = require("../controller/domain/ProjectController");
const ProjectService_1 = require("../service/domain/impl/ProjectService");
const JobTitleService_1 = require("../service/domain/impl/JobTitleService");
const JobTitleController_1 = require("../controller/domain/JobTitleController");
const ResourceMatrixController_1 = require("../controller/domain/ResourceMatrixController");
/**

 * @description Dependency injection config

 */
class BaseDIConfig {
    static register() {
        return __awaiter(this, void 0, void 0, function* () {
            // DI Container
            if (!BaseDIConfig.container) {
                const container = new inversify_1.Container({ defaultScope: 'Singleton' });
                // Config
                container.bind(baseIdentifiers_1.BaseIdentifiers.BootupService).to(bootupService_1.BootupService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.LoggerService).to(loggerService_1.LoggerService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.AppVariables).to(appVariables_1.AppVariables);
                // Middlewares
                container.bind(baseIdentifiers_1.BaseIdentifiers.RequestContext).to(requestContext_1.RequestContext);
                container.bind(baseIdentifiers_1.BaseIdentifiers.RequestContextMiddleware).to(requestContextMiddleware_1.RequestContextMiddleware);
                container.bind(baseIdentifiers_1.BaseIdentifiers.AuthMiddleware).to(authMiddleware_1.AuthMiddleware);
                // DB Implementation
                container.bind(baseIdentifiers_1.BaseIdentifiers.DbService).to(mongoDbService_1.MongoDbService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.DbClient).to(mongoDbClient_1.MongoDbClient);
                container.bind(baseIdentifiers_1.BaseIdentifiers.MongoReadService).to(mongoDbReadService_1.MongoDbReadService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.MongoWriteService).to(mongoDbWriteService_1.MongoDbWriteService);
                // Service implementation
                container.bind(baseIdentifiers_1.BaseIdentifiers.UserService).to(userService_1.UserService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.EmailService).to(nodeMailerService_1.NodeMailerService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.MapService).to(googleMapService_1.GoogleMapService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.FileService).to(s3FileService_1.S3FileService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.PdfService).to(htmlPdfService_1.HtmlPdfService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.CalendarService).to(googleCalendarService_1.GoogleCalendarService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.FcmNotificationService).to(fcmNotificationService_1.FcmNotificationService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ReminderService).to(awsReminderService_1.AWSReminderService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.HttpService).to(axiosHttpService_1.AxiosHttpService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.SmsService).to(twilioSmsService_1.TwilioSmsService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ResourceService).to(ResourceService_1.ResourceService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ClientService).to(ClientService_1.ClientService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.RoleService).to(RoleService_1.RoleService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.DepartmentService).to(DepartmentService_1.DepartmentService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.CategoryService).to(CategoryService_1.CategoryService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ProjectService).to(ProjectService_1.ProjectService);
                container.bind(baseIdentifiers_1.BaseIdentifiers.JobTitleService).to(JobTitleService_1.JobTitleService);
                // Controller implementation
                container.bind(baseIdentifiers_1.BaseIdentifiers.TestController).to(TestController_1.TestController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.LoginController).to(loginController_1.LoginController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.UserController).to(userController_1.UserController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ResourceController).to(ResourceController_1.ResourceController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ClientController).to(ClientController_1.ClientController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.RoleController).to(RoleController_1.RoleController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.DepartmentController).to(DepartmentController_1.DepartmentController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.CategoryController).to(CategoryController_1.CategoryController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.DocumentController).to(DocumentController_1.DocumentController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ProjectController).to(ProjectController_1.ProjectController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.JobTitleController).to(JobTitleController_1.JobTitleController);
                container.bind(baseIdentifiers_1.BaseIdentifiers.ResourceMatrixController).to(ResourceMatrixController_1.ResourceMatrixController);
                BaseDIConfig.container = container;
            }
            return BaseDIConfig.container;
        });
    }
    static getContainer() {
        return BaseDIConfig.container;
    }
}
exports.BaseDIConfig = BaseDIConfig;
