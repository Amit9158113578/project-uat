
/**

 * @description DI object identifies

 */
export namespace BaseIdentifiers {

    // Config
    export const BootupService = Symbol('BootupService');
    export const LoggerService = Symbol('DefaultLoggerService');
    export const AppVariables = Symbol('AppVariables');

    // Middlewares
    export const AuthMiddleware = Symbol('AuthMiddleware');
    export const RequestContext = Symbol('RequestContext');
    export const RequestContextMiddleware = Symbol('RequestContextMiddleware');


    // Database implementation
    export const DbService = Symbol('DbService');
    export const DbClient = Symbol('DbClient');
    export const MongoReadService = Symbol('MongoReadService');
    export const MongoWriteService = Symbol('MongoWriteService');

    // Domain Services
    export const UserService = Symbol('UserService');
    export const OrganizationService = Symbol('OrganizationService');
    export const MemberService = Symbol('MemberService');
    export const EmailService = Symbol('NodeMailerService');
    export const PaymentService = Symbol('PaymentService');
    export const MapService = Symbol('MapService');
    export const LanguageService = Symbol('LanguageService');
    export const RouteService = Symbol('RouteService');
    export const FileService = Symbol('FileService');
    export const PdfService = Symbol('PdfService');
    export const CalendarService = Symbol('CalendarService');
    export const MeetingService = Symbol('ZoomMeetingService');
    export const SequenceService = Symbol('SequenceService');
    export const FeedbackService = Symbol('FeedbackService');
    export const FcmNotificationService = Symbol('FcmNotificationService');
    export const ReminderService = Symbol('AWSReminderService');
    export const HttpService = Symbol('HttpService');
    export const BillService = Symbol('BillService');
    export const SmsService = Symbol('SmsService');
    export const ResourceService = Symbol('ResourceService');
    export const ClientService = Symbol('ClientService');
    export const RoleService = Symbol('RoleService');
    export const DepartmentService = Symbol('DepartmentService');
    export const CategoryService = Symbol('CategoryService');
    export const ProjectService = Symbol('ProjectService');
    export const JobTitleService  = Symbol('JobTitleService');


    // Controllers
    export const TestController = Symbol('TestController');
    export const LoginController = Symbol('LoginController');
    export const UserController =  Symbol('UserController');
    export const ResourceController =  Symbol('ResourceController');
    export const ClientController =  Symbol('ClientController');
    export const RoleController =  Symbol('RoleController');
    export const DepartmentController =  Symbol('DepartmentController');
    export const CategoryController =  Symbol('CategoryController');
    export const DocumentController = Symbol('DocumentController');
    export const ProjectController = Symbol('ProjectController');
    export const JobTitleController = Symbol('JobTitleController');
    export const ResourceMatrixController = Symbol('ResourceMatrixController');
}
