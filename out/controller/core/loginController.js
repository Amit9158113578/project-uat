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
exports.LoginController = void 0;
const baseController_1 = require("../baseController");
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
const encryptionUtil_1 = require("../../util/encryptionUtil");
const commonConstants_1 = require("../../constants/commonConstants");
const commonUtils_1 = require("../../util/commonUtils");
const LoginSchema = require('../../schema/LoginSchema');
let LoginController = class LoginController extends baseController_1.BaseController {
    constructor() {
        super();
        /**
        * @author <Rohit.L>
        * @description API - login API with JSON input
        * @param req {Request} - Express Request - LoginRequest
        * @param res {Response} - Express Response - Jwt Token
        * @returns  Jwt Token is returned
        * @throws InvalidRequestException if Unauthorized
        */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loginRequest = req.body;
                console.log(loginRequest);
                this.iLoggerService.debug('LoginController::login - Request to do login', loginRequest);
                this.validateRequest(loginRequest, LoginSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const user = yield this.iUserService.checkLogin(loginRequest);
                const jwtToken = yield this.iUserService.generateUserToken(user);
                this.iLoggerService.debug('LoginController::login - login successfully! JWT Token', jwtToken);
                user.token = jwtToken;
                this.sendResponse(200, user);
            }
            catch (error) {
                this.iLoggerService.error('Error - LoginController::login - Error while login');
                this.sendError(error);
            }
        });
        /**
     * @description API - Change Password
     * @param req {Request} - Express Request
     * @param res {Response} - Express Response
     * @returns ApiResponse<boolean>
     * @throws InvalidRequestException if req.body is invalid or blank or password is invalid
     */
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('UserController::changePassword - Request to change password');
                const changePasswordRequest = req.body;
                const email = changePasswordRequest.email;
                const userResult = yield this.iUserService.findUserByEmailOrPhone(email, email);
                if (userResult.success) {
                    const user = userResult.data;
                    const isPasswordMatch = encryptionUtil_1.EncryptionUtil.comparePasswords(changePasswordRequest.oldPassword, user.password);
                    if (isPasswordMatch) {
                        const hashedPassword = encryptionUtil_1.EncryptionUtil.encryptString(changePasswordRequest.newPassword);
                        const updateUserRequest = {
                            password: hashedPassword,
                            userId: user.id,
                        };
                        const updateResult = yield this.iUserService.updateUser(updateUserRequest);
                        if (updateResult.success) {
                            this.iLoggerService.debug('UserController::changePassword - Password changed success');
                            this.sendResponse(200, true);
                        }
                        else {
                            throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
                        }
                    }
                    else {
                        this.iLoggerService.debug('UserController::changePassword - Password doesn\'t match');
                        throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_PASSWORD, 400);
                    }
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::changePassword - Error while update password');
                this.sendError(error);
            }
        });
        /**
       * @description API - Forgot Password
       * @param req {Request} - Express Request
       * @param res {Response} - Express Response
       * @returns ApiResponse<boolean>
       * @throws InvalidRequestException if req.body is invalid or blank or password is invalid
       */
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('UserController::forgotPassword - Request to forgot password');
                const forgotPasswordRequest = req.body;
                const email = forgotPasswordRequest.email;
                const userResult = yield this.iUserService.findUserByEmailOrPhone(email, email);
                if (userResult.success) {
                    const user = userResult.data;
                    const decryptPassword = encryptionUtil_1.EncryptionUtil.decryptString(user.password);
                    if (decryptPassword) {
                        const resetPasswordLink = commonConstants_1.CommonConstants.HOST + "?email=" + user.email;
                        const apiRequest = {
                            email: user.email,
                            fullName: user.fullname,
                            link: resetPasswordLink,
                            phoneNumber: user.phone,
                            resetcode: decryptPassword,
                        };
                        yield commonUtils_1.CommonUtils.callApi(commonConstants_1.CommonConstants.APIURL, 'POST', apiRequest);
                        res.status(200).send(true);
                    }
                }
                else {
                    this.iLoggerService.debug('UserController::forgot password - email doesn\'t match');
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::forgotPassword - Error while forgot password');
                this.sendError(error); // Assuming sendError handles sending error response
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_LOGIN}`, this.login);
        this.router.put(`${urlConstants_1.URLConstants.URL_LOGIN}/resetPassword`, this.changePassword);
        this.router.put(`${urlConstants_1.URLConstants.URL_LOGIN}/forgotPassword`, this.forgotPassword);
    }
    ;
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], LoginController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.UserService),
    __metadata("design:type", Object)
], LoginController.prototype, "iUserService", void 0);
LoginController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], LoginController);
exports.LoginController = LoginController;
