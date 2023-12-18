import 'reflect-metadata';
import { Container } from 'inversify';
import { BootupService } from './bootupService';
import { ILoggerService } from '../service/util/iLoggerService';
import { LoggerService } from '../service/util/impl/loggerService';
import { BaseIdentifiers } from './baseIdentifiers';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { IDatabaseService } from '../service/db/iDatabaseService';
import { RequestContext } from './requestContext';
import { RequestContextMiddleware } from '../middleware/requestContextMiddleware';
import { MongoDbService } from '../service/db/impl/mongoDbService';
import { MongoDbReadService } from '../service/db/impl/mongoDbReadService';
import { IDatabaseClient } from '../service/db/iDatabaseClient';
import { MongoDbClient } from '../service/db/impl/mongoDbClient';
import { MongoDbWriteService } from '../service/db/impl/mongoDbWriteService';
import { IUserService } from '../service/domain/iUserService';
import { UserService } from '../service/domain/impl/userService';
import { AppVariables } from './appVariables';
import { IEmailService } from '../service/util/iEmailService';
import { NodeMailerService } from '../service/util/impl/nodeMailerService';
import { IMapService } from '../service/util/iMapService';
import { GoogleMapService } from '../service/util/impl/googleMapService';
import { IFileService } from '../service/util/iFileService';
import { S3FileService } from '../service/util/impl/s3FileService';
import { IPDFService } from '../service/util/iPdfService';
import { HtmlPdfService } from '../service/util/impl/htmlPdfService';
import { ICalendarService } from '../service/util/iCalendarService';
import { GoogleCalendarService } from '../service/util/impl/googleCalendarService';
import { INotificationService } from '../service/util/iNotificationService';
import { FcmNotificationService } from '../service/util/impl/fcmNotificationService';
import { AWSReminderService } from '../service/util/impl/awsReminderService';
import { IReminderService } from '../service/util/iReminderService';
import { IHttpService } from '../service/util/iHttpService';
import { AxiosHttpService } from '../service/util/impl/axiosHttpService';
import { ISmsService } from '../service/util/iSmsService';
import { TwilioSmsService } from '../service/util/impl/twilioSmsService';
import { TestController } from '../controller/domain/TestController';
import { LoginController } from '../controller/core/loginController';
import { UserController } from '../controller/core/userController';
import { ResourceController } from '../controller/domain/ResourceController';
import { IResourceService } from '../service/domain/IResourceService';
import { ResourceService } from '../service/domain/impl/ResourceService';
import { ClientController } from '../controller/domain/ClientController';
import { IClientService } from '../service/domain/IClientService';
import { ClientService } from '../service/domain/impl/ClientService';
import { RoleController } from '../controller/domain/RoleController';
import { IRoleService } from '../service/domain/IRoleService';
import { RoleService } from '../service/domain/impl/RoleService';
import { DepartmentService } from '../service/domain/impl/DepartmentService';
import { IDepartmentService } from '../service/domain/IDepartmentService';
import { DepartmentController } from '../controller/domain/DepartmentController';
import { ICategoryService } from '../service/domain/ICategoryService';
import { CategoryService } from '../service/domain/impl/CategoryService';
import { CategoryController } from '../controller/domain/CategoryController';
import { DocumentController } from '../controller/domain/DocumentController';
import { ProjectController } from '../controller/domain/ProjectController';
import { ProjectService } from '../service/domain/impl/ProjectService';
import { IProjectService } from '../service/domain/IProjectService';
import { JobTitleService } from '../service/domain/impl/JobTitleService';
import { JobTitleController } from '../controller/domain/JobTitleController';
import { ResourceMatrixController } from '../controller/domain/ResourceMatrixController';




/**

 * @description Dependency injection config

 */
export class BaseDIConfig {

    private static container: Container;

    public static async register(): Promise<Container> {

        // DI Container
        if (!BaseDIConfig.container) {
            const container = new Container({ defaultScope: 'Singleton' });
            // Config
            container.bind<BootupService>(BaseIdentifiers.BootupService).to(BootupService);
            container.bind<ILoggerService>(BaseIdentifiers.LoggerService).to(LoggerService);
            container.bind<AppVariables>(BaseIdentifiers.AppVariables).to(AppVariables);

            // Middlewares
            container.bind<RequestContext>(BaseIdentifiers.RequestContext).to(RequestContext);
            container.bind<RequestContextMiddleware>(BaseIdentifiers.RequestContextMiddleware).to(RequestContextMiddleware);
            container.bind<AuthMiddleware>(BaseIdentifiers.AuthMiddleware).to(AuthMiddleware);

            // DB Implementation
            container.bind<IDatabaseService>(BaseIdentifiers.DbService).to(MongoDbService);
            container.bind<IDatabaseClient>(BaseIdentifiers.DbClient).to(MongoDbClient);
            container.bind<MongoDbReadService>(BaseIdentifiers.MongoReadService).to(MongoDbReadService);
            container.bind<MongoDbWriteService>(BaseIdentifiers.MongoWriteService).to(MongoDbWriteService);

            // Service implementation
            container.bind<IUserService>(BaseIdentifiers.UserService).to(UserService);
           
            container.bind<IEmailService>(BaseIdentifiers.EmailService).to(NodeMailerService);
         
            container.bind<IMapService>(BaseIdentifiers.MapService).to(GoogleMapService);
           
            container.bind<IFileService>(BaseIdentifiers.FileService).to(S3FileService);
           
            container.bind<IPDFService>(BaseIdentifiers.PdfService).to(HtmlPdfService);
      
            container.bind<ICalendarService>(BaseIdentifiers.CalendarService).to(GoogleCalendarService);
           
            container.bind<INotificationService>(BaseIdentifiers.FcmNotificationService).to(FcmNotificationService);
           
            container.bind<IReminderService>(BaseIdentifiers.ReminderService).to(AWSReminderService);
            container.bind<IHttpService>(BaseIdentifiers.HttpService).to(AxiosHttpService);
           
            container.bind<ISmsService>(BaseIdentifiers.SmsService).to(TwilioSmsService);

            container.bind<IResourceService>(BaseIdentifiers.ResourceService).to(ResourceService);
            container.bind<IClientService>(BaseIdentifiers.ClientService).to(ClientService);
            container.bind<IRoleService>(BaseIdentifiers.RoleService).to(RoleService);
            container.bind<IDepartmentService>(BaseIdentifiers.DepartmentService).to(DepartmentService);
            container.bind<ICategoryService>(BaseIdentifiers.CategoryService).to(CategoryService);
            container.bind<IProjectService>(BaseIdentifiers.ProjectService).to(ProjectService);
            container.bind<JobTitleService>(BaseIdentifiers.JobTitleService).to(JobTitleService);
            

            // Controller implementation
            container.bind<TestController>(BaseIdentifiers.TestController).to(TestController);
            container.bind<LoginController>(BaseIdentifiers.LoginController).to(LoginController);
            container.bind<UserController>(BaseIdentifiers.UserController).to(UserController);
            container.bind<ResourceController>(BaseIdentifiers.ResourceController).to(ResourceController);
            container.bind<ClientController>(BaseIdentifiers.ClientController).to(ClientController);
            container.bind<RoleController>(BaseIdentifiers.RoleController).to(RoleController);
            container.bind<DepartmentController>(BaseIdentifiers.DepartmentController).to(DepartmentController);
            container.bind<CategoryController>(BaseIdentifiers.CategoryController).to(CategoryController);
            container.bind<DocumentController>(BaseIdentifiers.DocumentController).to(DocumentController);
            container.bind<ProjectController>(BaseIdentifiers.ProjectController).to(ProjectController);
            container.bind<JobTitleController>(BaseIdentifiers.JobTitleController).to(JobTitleController);
            container.bind<ResourceMatrixController>(BaseIdentifiers.ResourceMatrixController).to(ResourceMatrixController);

            BaseDIConfig.container = container;
        }

        return BaseDIConfig.container;

    }

    public static getContainer(): Container {
        return BaseDIConfig.container;
    }

}
