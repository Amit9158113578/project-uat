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
exports.UserController = void 0;
const baseController_1 = require("../baseController");
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
const errorCodes_1 = require("../../constants/errorCodes");
const encryptionUtil_1 = require("../../util/encryptionUtil");
const commonUtils_1 = require("../../util/commonUtils");
// Schema
const SignupSchema = require('../../schema/user/SignupSchema');
// const UpdateUserSchema = require('../../schema/user/UpdateUserSchema');
const ChangePasswordSchema = require('../../schema/user/ChangePasswordSchema');
const AddUserSchema = require('../../schema/user/AddUserSchema');
const ResetPasswordSchema = require('../../schema/user/ResetPasswordSchema');
/**
 * @description User Controller

 */
let UserController = class UserController extends baseController_1.BaseController {
    constructor() {
        super();
        /**
         * @description API - Get user by ID
         * @param req {Request} - Express Request
         * @param res {Response} - Express Response
         * @returns User object {string}
         * @throws InvalidRequestException if req.params.userId is invalid or blank
         */
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId || userId.trim().length <= 0) {
                    throw new InvalidRequestException_1.InvalidRequestException(['\'userId\' must not be null'], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 400);
                }
                this.iLoggerService.debug('UserController::getUserById - Request to find user by ID', req.params.userId);
                let userResult = yield this.iUserService.findUserById(userId);
                if (userResult.success) {
                    this.sendResponse(200, userResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::getUserById - Error while finding user by id');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description deleteUser
       * @param req {Request} - Express Request - userId
       * @param res {Response} - Express Response - User details
       * @returns  UserResponse object is returned
       * @throws InvalidRequestException if User id is invalid
       */
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                this.iLoggerService.debug('UserController::deleteUser - userId', userId);
                const response = yield this.iUserService.deleteUser(userId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::deleteUser - Error while delete User');
                this.sendError(error);
            }
        });
        /**
         * @description API - Update user
         * @param req {Request} - Express Request
         * @param res {Response} - Express Response
         * @returns ApiResponse<boolean>
         * @throws InvalidRequestException if req.params.userId is invalid or blank or request is invalid
         */
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUserRequest = req.body;
                updateUserRequest.userId = req.params.userId;
                // this.validateRequest(updateUserRequest, UpdateUserSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
                if (updateUserRequest.password && updateUserRequest.password !== '') {
                    const hashedPassword = encryptionUtil_1.EncryptionUtil.encryptString(updateUserRequest.password);
                    updateUserRequest.password = hashedPassword;
                }
                const updateResult = yield this.iUserService.updateUser(updateUserRequest);
                if (updateResult.success) {
                    this.sendResponse(200, true);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::updateUser - Error while update user');
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
                this.validateRequest(changePasswordRequest, ChangePasswordSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
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
         * @description API - Admin sign up API
         * @param req {Request} - Express Request - Signup request
         * @param res {Response} - Express Response - sent email to admin user - JWT token
         * @throws InvalidRequestException if request is invalid
         */
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const signupRequest = req.body;
                this.validateRequest(signupRequest, SignupSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                yield this.createUser(signupRequest);
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::signup - Error while user registration');
                this.sendError(error);
            }
        });
        /**
        * @description gets all Users lists
        * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
        * @returns Response all Users details
        * @throws ServiceException if failed to retrieve Users
        */
        this.getUserList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('UserController::getUsersList');
                const listQueryRequest = req.body;
                this.iLoggerService.log('UserController::getUsersList - retrieve users list', listQueryRequest);
                const response = yield this.iUserService.getUserList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('UserController::getUsersList - Error while retrieving users list', 400);
                this.sendError(error);
            }
        });
        /**
         * @description API - Deactivate users
         * @param req {Request} - Express Request - user's Id
         * @param res {Response} - Express Response - success result - deleted user's information
         * @returns 200 if user's information is returned
         * @throws InvalidRequestException if request is invalid
        */
        this.deactivateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                this.iLoggerService.debug('UserController::deactivateUser - DeactivateUser', id);
                const response = yield this.iUserService.deactivateUser(id);
                if (response.success) {
                    this.sendResponse(200, true);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::deactivateUser - Error while deleting users details by id');
                this.sendError(error);
            }
        });
        /**
        * @description add user
        * @param req {Request} - Express Request - user details
        * @param res {Response} - Express Response - success result
        * @throws InvalidRequestException if failed
        * @returns 201 if user is added
        */
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const signupRequest = req.body;
                const password = commonUtils_1.CommonUtils.generateRandomString(8);
                signupRequest.password = password;
                // this.validateRequest(signupRequest, AddUserSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
                signupRequest.status = 'ACTIVE';
                const persistUserResult = yield this.iUserService.signupUser(signupRequest);
                this.iLoggerService.debug('UserController::AddUser - new admin user ', persistUserResult);
                this.sendResponse(201, 'User created successfully');
            }
            catch (error) {
                this.iLoggerService.error('UserController::addUser - Error while adding user', 400);
                this.sendError(error);
            }
        });
        /**
         * @description API - activate users
         * @param req {Request} - Express Request - user's Id
         * @param res {Response} - Express Response - success result - activated user's status
         * @returns 200 if user's information is returned
         * @throws InvalidRequestException if request is invalid
        */
        this.activateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                this.iLoggerService.debug('UserController::activateUser - activateUser', id);
                const response = yield this.iUserService.activateUser(id);
                this.iLoggerService.log('UserController::activateUser - print response', response);
                if (response.success) {
                    this.sendResponse(200, true);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::deactivateUser - Error while activate users details by id');
                this.sendError(error);
            }
        });
        /**
         * @description API - refresh token
         * @param req {Request} - Express Request - clientId
         * @param res {Response} - Express Response - token
         * @returns 200 if generated token is returned
         * @throws InvalidRequestException if request is invalid
        */
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessioninfo = this.getSessionInfo();
                const userId = sessioninfo.userId;
                const user = yield this.iUserService.findUserById(userId);
                const jwtToken = yield this.iUserService.generateUserToken(user.data);
                this.sendResponse(200, jwtToken);
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::refreshToken - Error while refreshing token');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit L.>
        * @description API - Resetup users
        * @param req {Request} - Express Request - user's Id
        * @param res {Response} - Express Response - success result - Resetup user's information
        * @returns 200 if user's information is returned
        * @throws InvalidRequestException if request is invalid
       */
        this.resetupUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                this.iLoggerService.debug('UserController::resetupUser - ResetupUser', id);
                const response = yield this.iUserService.resetupUser(id);
                if (response.success) {
                    this.sendResponse(200, true);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::resetupUser - Error while resetup users details by id');
                this.sendError(error);
            }
        });
        /**
         * @description API - Reset password by user Id
         * @param req {Request} - Express Request - req.body (user id and password)
         * @param res {Response} - Express Response -
         * @returns 200 if password is reset successfully
         * @throws InvalidRequestException if user id is invalid or permission denied
         */
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const resetPasswordRequest = req.body;
                resetPasswordRequest.userId = req.params.id;
                this.iLoggerService.debug('UserController::resetPassword - Reset User Password');
                this.validateRequest(resetPasswordRequest, ResetPasswordSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                yield this.iUserService.resetPassword(resetPasswordRequest);
                this.sendResponse(202, 'Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - UserController::resetPassword - Error while reseting password');
                this.sendError(error);
            }
        });
        this.router.get(urlConstants_1.URLConstants.URL_USERS + '/:userId', this.getUserById);
        this.router.delete(urlConstants_1.URLConstants.URL_USERS + '/:id', this.deleteUser);
        this.router.put(`${urlConstants_1.URLConstants.URL_USERS}/refreshToken`, this.refreshToken);
        this.router.put(urlConstants_1.URLConstants.URL_USERS + '/:userId', this.updateUser);
        this.router.put(urlConstants_1.URLConstants.URL_USERS, this.changePassword);
        this.router.post(`${urlConstants_1.URLConstants.URL_USERS}/signup`, this.signup);
        this.router.post(`${urlConstants_1.URLConstants.URL_USERS}/list`, this.getUserList);
        this.router.put(`${urlConstants_1.URLConstants.URL_USERS}/deactivate/:id`, this.deactivateUser);
        this.router.post(`${urlConstants_1.URLConstants.URL_USERS}`, this.addUser);
        this.router.put(`${urlConstants_1.URLConstants.URL_USERS}/activate/:id`, this.activateUser);
        this.router.put(`${urlConstants_1.URLConstants.URL_USERS}/resetup/:id`, this.resetupUser);
        this.router.put(`${urlConstants_1.URLConstants.URL_USERS}/:id/resetPassword`, this.resetPassword);
    }
    // This can be called through sigup/add user
    createUser(signupRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = commonUtils_1.CommonUtils.generateRandomString(8);
            signupRequest.password = password;
            this.validateRequest(signupRequest, AddUserSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
            signupRequest.status = 'ACTIVE';
            const persistUserResult = yield this.iUserService.signupUser(signupRequest);
            this.iLoggerService.debug('UserController::createUser - new admin user ', persistUserResult);
            this.sendResponse(201, 'User created successfully');
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], UserController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.UserService),
    __metadata("design:type", Object)
], UserController.prototype, "iUserService", void 0);
UserController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
