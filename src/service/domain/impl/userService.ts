import { IUserService } from '../iUserService';
import { User } from '../../../types/entity';
import { injectable, inject } from 'inversify';
import { ILoggerService } from '../../util/iLoggerService';
import { IDatabaseService } from '../../db/iDatabaseService';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { Query, FindEntityByIdRequest, UpdateEntityRequest, PersistEntityRequest, DeleteEntityRequest } from '../../../types/queryRequest';
import { CommonUtils } from '../../../util/commonUtils';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';
import { LoginRequest, UpdateUserRequest, SignupRequest, ListQueryRequest, ResetPasswordRequest, ApiRequest } from '../../../types/request';
import * as JWT from 'jsonwebtoken';
import { Response } from '../../../types/reponse';
import { EncryptionUtil } from '../../../util/encryptionUtil';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { DateUtils } from '../../../util/dateUtils';
import { CommonConstants } from '../../../constants/commonConstants';

/**

 * @description - User Service implementation

 */

@injectable()
export class UserService implements IUserService {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;


    /**

     * @description finds user by username/mobileno and do password check
     * @param loginRequest {LoginRequest} - username can be email/mobileno
     * @returns User
     * @throws ServiceException if user not found or password is invalid or user is blocked/deactivated
     */
    public async checkLogin(loginRequest: LoginRequest): Promise<User> {
        try {
            this.iLoggerService.debug('UserService::getLoginUser - Find user for login', loginRequest);
            const username = loginRequest.userName.toLowerCase();
            let userResult = await this.findUserByEmailOrPhone(username, username);
            if (CommonUtils.isSuccess(userResult) && EncryptionUtil.comparePasswords(loginRequest.password, userResult.data.password)) {
                if (userResult.data.status === 'BLOCKED' || userResult.data.status === 'DEACTIVATED') {
                    throw new ServiceException(['User is blocked/deactivated'], ErrorCodes.ERR_API_USER_BLOCKED, 403);
                }
                return userResult.data;
            } else {
                throw new ServiceException(['Invalid username or password'], ErrorCodes.ERR_API_INVALID_REQUEST, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserService::getLoginUser - Error while getting user', error);
            throw error;
        }
    }


    /**
* @author <Rohit.L.>
* @description delete user details
* @param id {string} - primary email id
* @returns delete user information by id
* @throws ServiceException if failed to delete ruralDestinatio  details
*/
    public async deleteUser(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_USERS,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - RoleService::deleteRole - Error while deleting user record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }


    /**

     * @description generates JWT token for the user
     * @param user {User} - User Object
     * @param application {Application} - Application object
     * @param sessionValidityTime {number} - Session Validity time in Minutes
     * @returns JWT Token {string}
     * @throws ServiceException if error occured while generating JWT token
     */
    public async generateUserToken(user: User): Promise<string> {
        this.iLoggerService.error('UserService::generateUserToken - User Scopes - ', user.role);
        try {
            const token = JWT.sign({
                exp: Math.floor(Date.now() / 1000) + DateUtils.convertMinutesToSeconds(1200),
                fullname: user.fullname,
                iat: Date.now(),
                id: user.id,
                role: user.role,
                status: user.status,
                timezone: DateUtils.DEFAULT_TIMEZONE,
            }, CommonConstants.JWTPRIVATEKEY, {
                algorithm: CommonConstants.ALGORITHM,
                audience: CommonConstants.AUDIENCE,
                issuer: CommonConstants.ISSUER,
                subject: user.email,
            });
            return token;
        } catch (error) {
            this.iLoggerService.error('Error - UserService::generateUserToken - Error while generating JWT token', error);
            throw new ServiceException([error], ErrorCodes.ERR_SERVICE_EXCEPTION, 500);
        }
    }

    /**

     * @description finds user by email or phone
     * @param email {string} - user email
     * @param phone {string} - user phone
     * @returns User
     */
    public async findUserByEmailOrPhone(email: string, phone: string, employeeCode?: string): Promise<Response<User>> {
        let findUserQuery: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email
                },
                {
                    fieldName: FieldNames.FIELD_PHONE,
                    op: 'eq',
                    value: phone
                },
                {
                    fieldName: FieldNames.FIELD_EMPLOYEE_CODE,
                    op: 'eq',
                    value: employeeCode
                }
            ],
            op: 'or',
            tableName: DBConstants.DB_TABLE_USERS
        };
        let userResult = await this.iDataService.findEntityByQuery<User>(findUserQuery);
        return userResult;
    }


    /**

     * @description finds user by id
     * @param id {string} - primary key id
     * @returns User
     */
    public async findUserById(id: string): Promise<Response<User>> {
        let findUserByIdRequest: FindEntityByIdRequest = {
            id: id,
            tableName: DBConstants.DB_TABLE_USERS
        };
        let userResult = await this.iDataService.findEntityById<User>(findUserByIdRequest);
        return userResult;
    }

    /**

     * @description update user
     * @param updateUserRequest {UpdateUserRequest} - UpdateUserRequest
     * @returns Number 1 if success
     */
    public async updateUser(updateUserRequest: UpdateUserRequest): Promise<Response<Number>> {
        const updateValues = {} as any;
        const fieldsToUpdate = ['fullname', 'phone', 'password', 'status', 'userRole','role', 'employeeCode', 'jobTitle', 'startDate', 'endDate'];

        for (const field of fieldsToUpdate) {
            if (updateUserRequest[field]) {
                updateValues[field] = updateUserRequest[field];
            }
        }
        const updateEntityRequest: UpdateEntityRequest = {
            id: updateUserRequest.userId,
            tableName: DBConstants.DB_TABLE_USERS,
            values: updateValues,
        };
        delete updateUserRequest.userId;
        const updateResult = await this.iDataService.updateEntity(updateEntityRequest);
        return updateResult;
    }

    /**

     * @description add a new user
     * @param signupRequest {SignupRequest} - SignupRequest
     * @returns User
     */
    public async signupUser(signupRequest: SignupRequest): Promise<Response<User>> {
        try {
            const findUserResult = await this.findUserByEmailOrPhone(signupRequest.email, signupRequest.phone, signupRequest.employeeCode);
            if (CommonUtils.isSuccess(findUserResult)) {
                this.iLoggerService.debug('UserService::signupUser- User already exists'+signupRequest.email);
                throw new InvalidRequestException([], ErrorCodes.ERR_API_USER_ALREADY_EXISTS, 400);
            }
            const hashedPassword = EncryptionUtil.encryptString(signupRequest.password);
            const user: User = {
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
            const persistEntityRequest: PersistEntityRequest<User> = {
                entity: user,
                tableName: DBConstants.DB_TABLE_USERS
            };
            const persistUserResult = await this.iDataService.persistEntity<User>(persistEntityRequest);
            this.iLoggerService.log('UserService::addUser - New member user ', persistUserResult);
            const resetPasswordLink = CommonConstants.HOST + "?email=" + user.email;

            const apiRequest: ApiRequest = {
                email: user.email,
                fullName: user.fullname,
                link: resetPasswordLink,
                phoneNumber: user.phone,
                resetcode: signupRequest.password,
            }
            console.log('apiRequest :', apiRequest);
            await CommonUtils.callApi(CommonConstants.APIURL, 'POST', apiRequest);
            return persistUserResult;
        } catch (error) {
            this.iLoggerService.error('Error - UserService::signupUser - Error while creating new user', error);
            if (error instanceof InvalidRequestException) {
                throw error;
            } else {
                throw new ServiceException([error], ErrorCodes.ERR_SERVICE_EXCEPTION, 500);
            }
        }
    }

    /**
     *
     * @description gets users by query criteria
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response users
     * @throws ServiceException if failed to retrieve users
     */
    public async getUserList(listQueryRequest: ListQueryRequest): Promise<Response<User[]>> {
        try {
            this.iLoggerService.log('UserService:getUserList - Query Request', listQueryRequest);
            let findUserQuery: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                op: listQueryRequest.op,
                order: listQueryRequest.order,
                outputProperties: listQueryRequest.outputProperties,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_USERS,
            };
            const response = await this.iDataService.findManyByQuery<User>(findUserQuery);
            this.iLoggerService.log('UserService:getUserList - find users result', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error:UserService:getUserList - Error while getting users', error);
            throw error;
        }
    }

    /**
     *
     * @description Deactivate user
     * @param id {string} - user ID
     * @returns success response
     * @throws ServiceException if failed to update user
     */
    public async deactivateUser(id: string): Promise<Response<Number>> {
        const updateEntityRequest: UpdateEntityRequest = {
            id,
            tableName: DBConstants.DB_TABLE_USERS,
            values: { status: 'DEACTIVE' },
        };
        const response = await this.iDataService.updateEntity(updateEntityRequest);
        return response;
    }

    /**
     *
     * @description activate user
     * @param id {string} - user ID
     * @returns success response
     * @throws ServiceException if failed to update user
     */
    public async activateUser(id: string): Promise<Response<Number>> {
        const updateEntityRequest: UpdateEntityRequest = {
            id,
            tableName: DBConstants.DB_TABLE_USERS,
            values: { status: 'ACTIVE' },
        };
        const response = await this.iDataService.updateEntity(updateEntityRequest);
        return response;
    }

    /**
     *
     * @description Reset Password
     * @param resetPasswordRequest {ResetPasswordRequest} - User ID
     * @returns success response
     * @throws ServiceException if failed to reset password
     */
    public async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<Response<Number>> {
        this.iLoggerService.log('UserService:resetPassword - Response');
        const hashedPassword = EncryptionUtil.encryptString(resetPasswordRequest.newPassword);
        const updateUserRequest: UpdateUserRequest = {
            password: hashedPassword,
            userId: resetPasswordRequest.userId,
        };
        const response = await this.updateUser(updateUserRequest);
        this.iLoggerService.log('UserService:resetPassword - Response', response);
        return response;
    }

    /**
     * @author <Rohit L.>
     * @description Resetup user
     * @param id {string} - user ID
     * @returns success response
     * @throws ServiceException if failed to update user
     */
    public async resetupUser(id: string): Promise<Response<Number>> {
        const updateEntityRequest: UpdateEntityRequest = {
            id,
            tableName: DBConstants.DB_TABLE_USERS,
            values: { status: 'SETUP_PENDING' },
        };
        const response = await this.iDataService.updateEntity(updateEntityRequest);
        return response;
    }
}
