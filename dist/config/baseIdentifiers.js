"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseIdentifiers = void 0;
/**

 * @description DI object identifies

 */
var BaseIdentifiers;
(function (BaseIdentifiers) {
    // Config
    BaseIdentifiers.BootupService = Symbol('BootupService');
    BaseIdentifiers.LoggerService = Symbol('DefaultLoggerService');
    BaseIdentifiers.AppVariables = Symbol('AppVariables');
    // Middlewares
    BaseIdentifiers.AuthMiddleware = Symbol('AuthMiddleware');
    BaseIdentifiers.RequestContext = Symbol('RequestContext');
    BaseIdentifiers.RequestContextMiddleware = Symbol('RequestContextMiddleware');
    // Database implementation
    BaseIdentifiers.DbService = Symbol('DbService');
    BaseIdentifiers.DbClient = Symbol('DbClient');
    BaseIdentifiers.MongoReadService = Symbol('MongoReadService');
    BaseIdentifiers.MongoWriteService = Symbol('MongoWriteService');
    // Domain Services
    BaseIdentifiers.UserService = Symbol('UserService');
    BaseIdentifiers.OrganizationService = Symbol('OrganizationService');
    BaseIdentifiers.MemberService = Symbol('MemberService');
    BaseIdentifiers.EmailService = Symbol('NodeMailerService');
    BaseIdentifiers.PaymentService = Symbol('PaymentService');
    BaseIdentifiers.MapService = Symbol('MapService');
    BaseIdentifiers.LanguageService = Symbol('LanguageService');
    BaseIdentifiers.RouteService = Symbol('RouteService');
    BaseIdentifiers.FileService = Symbol('FileService');
    BaseIdentifiers.PdfService = Symbol('PdfService');
    BaseIdentifiers.CalendarService = Symbol('CalendarService');
    BaseIdentifiers.MeetingService = Symbol('ZoomMeetingService');
    BaseIdentifiers.SequenceService = Symbol('SequenceService');
    BaseIdentifiers.FeedbackService = Symbol('FeedbackService');
    BaseIdentifiers.FcmNotificationService = Symbol('FcmNotificationService');
    BaseIdentifiers.ReminderService = Symbol('AWSReminderService');
    BaseIdentifiers.HttpService = Symbol('HttpService');
    BaseIdentifiers.BillService = Symbol('BillService');
    BaseIdentifiers.SmsService = Symbol('SmsService');
    BaseIdentifiers.ResourceService = Symbol('ResourceService');
    BaseIdentifiers.ClientService = Symbol('ClientService');
    BaseIdentifiers.RoleService = Symbol('RoleService');
    BaseIdentifiers.DepartmentService = Symbol('DepartmentService');
    BaseIdentifiers.CategoryService = Symbol('CategoryService');
    BaseIdentifiers.ProjectService = Symbol('ProjectService');
    BaseIdentifiers.JobTitleService = Symbol('JobTitleService');
    // Controllers
    BaseIdentifiers.TestController = Symbol('TestController');
    BaseIdentifiers.LoginController = Symbol('LoginController');
    BaseIdentifiers.UserController = Symbol('UserController');
    BaseIdentifiers.ResourceController = Symbol('ResourceController');
    BaseIdentifiers.ClientController = Symbol('ClientController');
    BaseIdentifiers.RoleController = Symbol('RoleController');
    BaseIdentifiers.DepartmentController = Symbol('DepartmentController');
    BaseIdentifiers.CategoryController = Symbol('CategoryController');
    BaseIdentifiers.DocumentController = Symbol('DocumentController');
    BaseIdentifiers.ProjectController = Symbol('ProjectController');
    BaseIdentifiers.JobTitleController = Symbol('JobTitleController');
    BaseIdentifiers.ResourceMatrixController = Symbol('ResourceMatrixController');
})(BaseIdentifiers = exports.BaseIdentifiers || (exports.BaseIdentifiers = {}));
