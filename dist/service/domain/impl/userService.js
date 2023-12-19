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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const commonUtils_1 = require("../../../util/commonUtils");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
const JWT = require("jsonwebtoken");
const encryptionUtil_1 = require("../../../util/encryptionUtil");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const dateUtils_1 = require("../../../util/dateUtils");
const commonConstants_1 = require("../../../constants/commonConstants");
/**

 * @description - User Service implementation

 */
let UserService = class UserService {
    /**

     * @description finds user by username/mobileno and do password check
     * @param loginRequest {LoginRequest} - username can be email/mobileno
     * @returns User
     * @throws ServiceException if user not found or password is invalid or user is blocked/deactivated
     */
    checkLogin(loginRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('UserService::getLoginUser - Find user for login', loginRequest);
                const username = loginRequest.userName.toLowerCase();
                let userResult = yield this.findUserByEmailOrPhone(username, username);
                if (commonUtils_1.CommonUtils.isSuccess(userResult) && encryptionUtil_1.EncryptionUtil.comparePasswords(loginRequest.password, userResult.data.password)) {
                    if (userResult.data.status === 'BLOCKED' || userResult.data.status === 'DEACTIVATED') {
                        throw new serviceException_1.ServiceException(['User is blocked/deactivated'], errorCodes_1.ErrorCodes.ERR_API_USER_BLOCKED, 403);
                    }
                    return userResult.data;
                }
                else {
                    throw new serviceException_1.ServiceException(['Invalid username or password'], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - UserService::getLoginUser - Error while getting user', error);
                throw error;
            }
        });
    }
    /**
* @author <Rohit.L.>
* @description delete user details
* @param id {string} - primary email id
* @returns delete user information by id
* @throws ServiceException if failed to delete ruralDestinatio  details
*/
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_USERS,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleService::deleteRole - Error while deleting user record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**

     * @description generates JWT token for the user
     * @param user {User} - User Object
     * @param application {Application} - Application object
     * @param sessionValidityTime {number} - Session Validity time in Minutes
     * @returns JWT Token {string}
     * @throws ServiceException if error occured while generating JWT token
     */
    generateUserToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.error('UserService::generateUserToken - User Scopes - ', user.role);
            try {
                const token = JWT.sign({
                    exp: Math.floor(Date.now() / 1000) + dateUtils_1.DateUtils.convertMinutesToSeconds(1200),
                    fullname: user.fullname,
                    iat: Date.now(),
                    id: user.id,
                    role: user.role,
                    status: user.status,
                    timezone: dateUtils_1.DateUtils.DEFAULT_TIMEZONE,
                }, commonConstants_1.CommonConstants.JWTPRIVATEKEY, {
                    algorithm: commonConstants_1.CommonConstants.ALGORITHM,
                    audience: commonConstants_1.CommonConstants.AUDIENCE,
                    issuer: commonConstants_1.CommonConstants.ISSUER,
                    subject: user.email,
                });
                return token;
            }
            catch (error) {
                this.iLoggerService.error('Error - UserService::generateUserToken - Error while generating JWT token', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_SERVICE_EXCEPTION, 500);
            }
        });
    }
    /**

     * @description finds user by email or phone
     * @param email {string} - user email
     * @param phone {string} - user phone
     * @returns User
     */
    findUserByEmailOrPhone(email, phone, employeeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let findUserQuery = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email
                    },
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_PHONE,
                        op: 'eq',
                        value: phone
                    },
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMPLOYEE_CODE,
                        op: 'eq',
                        value: employeeCode
                    }
                ],
                op: 'or',
                tableName: dbConstants_1.DBConstants.DB_TABLE_USERS
            };
            let userResult = yield this.iDataService.findEntityByQuery(findUserQuery);
            return userResult;
        });
    }
    /**

     * @description finds user by id
     * @param id {string} - primary key id
     * @returns User
     */
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let findUserByIdRequest = {
                id: id,
                tableName: dbConstants_1.DBConstants.DB_TABLE_USERS
            };
            let userResult = yield this.iDataService.findEntityById(findUserByIdRequest);
            return userResult;
        });
    }
    /**

     * @description update user
     * @param updateUserRequest {UpdateUserRequest} - UpdateUserRequest
     * @returns Number 1 if success
     */
    updateUser(updateUserRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateValues = {};
            const fieldsToUpdate = ['fullname', 'phone', 'password', 'status', 'userRole', 'role', 'employeeCode', 'jobTitle', 'startDate', 'endDate'];
            for (const field of fieldsToUpdate) {
                if (updateUserRequest[field]) {
                    updateValues[field] = updateUserRequest[field];
                }
            }
            const updateEntityRequest = {
                id: updateUserRequest.userId,
                tableName: dbConstants_1.DBConstants.DB_TABLE_USERS,
                values: updateValues,
            };
            delete updateUserRequest.userId;
            const updateResult = yield this.iDataService.updateEntity(updateEntityRequest);
            return updateResult;
        });
    }
    /**

     * @description add a new user
     * @param signupRequest {SignupRequest} - SignupRequest
     * @returns User
     */
    signupUser(signupRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUserResult = yield this.findUserByEmailOrPhone(signupRequest.email, signupRequest.phone, signupRequest.employeeCode);
                if (commonUtils_1.CommonUtils.isSuccess(findUserResult)) {
                    this.iLoggerService.debug('UserService::signupUser- User already exists' + signupRequest.email);
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_USER_ALREADY_EXISTS, 400);
                }
                const hashedPassword = encryptionUtil_1.EncryptionUtil.encryptString(signupRequest.password);
                const user = {
                    email: signupRequest.email.toLowerCase(),
                    fullname: signupRequest.fullname,
                    password: hashedPassword,
                    phone: signupRequest.phone,
                    role: signupRequest.role,
                    status: signupRequest.status,
                    employeeCode: signupRequest.employeeCode,
                    jobTitle: signupRequest.jobTitle,
                    userRole: signupRequest.userRole,
                };
                const persistEntityRequest = {
                    entity: user,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_USERS
                };
                const persistUserResult = yield this.iDataService.persistEntity(persistEntityRequest);
                this.iLoggerService.log('UserService::addUser - New member user ', persistUserResult);
                const resetPasswordLink = commonConstants_1.CommonConstants.HOST + "?email=" + user.email;
                const apiRequest = {
                    email: user.email,
                    fullName: user.fullname,
                    link: resetPasswordLink,
                    phoneNumber: user.phone,
                    resetcode: signupRequest.password,
                };
                console.log('apiRequest :', apiRequest);
                yield commonUtils_1.CommonUtils.callApi(commonConstants_1.CommonConstants.APIURL, 'POST', apiRequest);
                return persistUserResult;
            }
            catch (error) {
                this.iLoggerService.error('Error - UserService::signupUser - Error while creating new user', error);
                if (error instanceof InvalidRequestException_1.InvalidRequestException) {
                    throw error;
                }
                else {
                    throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_SERVICE_EXCEPTION, 500);
                }
            }
        });
    }
    /**
     *
     * @description gets users by query criteria
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response users
     * @throws ServiceException if failed to retrieve users
     */
    getUserList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('UserService:getUserList - Query Request', listQueryRequest);
                let findUserQuery = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    op: listQueryRequest.op,
                    order: listQueryRequest.order,
                    outputProperties: listQueryRequest.outputProperties,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_USERS,
                };
                const response = yield this.iDataService.findManyByQuery(findUserQuery);
                this.iLoggerService.log('UserService:getUserList - find users result', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error:UserService:getUserList - Error while getting users', error);
                throw error;
            }
        });
    }
    /**
     *
     * @description Deactivate user
     * @param id {string} - user ID
     * @returns success response
     * @throws ServiceException if failed to update user
     */
    deactivateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateEntityRequest = {
                id,
                tableName: dbConstants_1.DBConstants.DB_TABLE_USERS,
                values: { status: 'DEACTIVE' },
            };
            const response = yield this.iDataService.updateEntity(updateEntityRequest);
            return response;
        });
    }
    /**
     *
     * @description activate user
     * @param id {string} - user ID
     * @returns success response
     * @throws ServiceException if failed to update user
     */
    activateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateEntityRequest = {
                id,
                tableName: dbConstants_1.DBConstants.DB_TABLE_USERS,
                values: { status: 'ACTIVE' },
            };
            const response = yield this.iDataService.updateEntity(updateEntityRequest);
            return response;
        });
    }
    /**
     *
     * @description Reset Password
     * @param resetPasswordRequest {ResetPasswordRequest} - User ID
     * @returns success response
     * @throws ServiceException if failed to reset password
     */
    resetPassword(resetPasswordRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('UserService:resetPassword - Response');
            const hashedPassword = encryptionUtil_1.EncryptionUtil.encryptString(resetPasswordRequest.newPassword);
            const updateUserRequest = {
                password: hashedPassword,
                userId: resetPasswordRequest.userId,
            };
            const response = yield this.updateUser(updateUserRequest);
            this.iLoggerService.log('UserService:resetPassword - Response', response);
            return response;
        });
    }
    /**
     * @author <Rohit L.>
     * @description Resetup user
     * @param id {string} - user ID
     * @returns success response
     * @throws ServiceException if failed to update user
     */
    resetupUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateEntityRequest = {
                id,
                tableName: dbConstants_1.DBConstants.DB_TABLE_USERS,
                values: { status: 'SETUP_PENDING' },
            };
            const response = yield this.iDataService.updateEntity(updateEntityRequest);
            return response;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], UserService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], UserService.prototype, "iDataService", void 0);
UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
exports.UserService = UserService;
