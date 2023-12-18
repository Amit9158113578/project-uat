import { BaseController } from '../baseController';
import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { ILoggerService } from '../../service/util/iLoggerService';
import { IUserService } from '../../service/domain/iUserService';
import { URLConstants } from '../../constants/urlConstants';
import { Request, Response } from 'express';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { ErrorCodes } from '../../constants/errorCodes';
import { UpdateUserRequest, ChangePasswordRequest, SignupRequest, ListQueryRequest, ResetPasswordRequest } from '../../types/request';
import { EncryptionUtil } from '../../util/encryptionUtil';
import { CommonUtils } from '../../util/commonUtils';


// Schema
const SignupSchema = require('../../schema/user/SignupSchema');
// const UpdateUserSchema = require('../../schema/user/UpdateUserSchema');
const ChangePasswordSchema = require('../../schema/user/ChangePasswordSchema');
const AddUserSchema = require('../../schema/user/AddUserSchema');
const ResetPasswordSchema = require('../../schema/user/ResetPasswordSchema');


/**
 * @description User Controller

 */
@injectable()
export class UserController extends BaseController {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.UserService)
    private iUserService: IUserService;


    constructor() {
        super();
        this.router.get(URLConstants.URL_USERS + '/:userId', this.getUserById);
        this.router.delete(URLConstants.URL_USERS + '/:id', this.deleteUser);
        this.router.put(`${URLConstants.URL_USERS}/refreshToken`, this.refreshToken);
        this.router.put(URLConstants.URL_USERS + '/:userId', this.updateUser);
        this.router.put(URLConstants.URL_USERS, this.changePassword);
        this.router.post(`${URLConstants.URL_USERS}/signup`, this.signup);
        this.router.post(`${URLConstants.URL_USERS}/list`, this.getUserList);
        this.router.put(`${URLConstants.URL_USERS}/deactivate/:id`, this.deactivateUser);
        this.router.post(`${URLConstants.URL_USERS}`, this.addUser);
        this.router.put(`${URLConstants.URL_USERS}/activate/:id`, this.activateUser);
        this.router.put(`${URLConstants.URL_USERS}/resetup/:id`, this.resetupUser);
        this.router.put(`${URLConstants.URL_USERS}/:id/resetPassword`, this.resetPassword);
    }


    /**
     * @description API - Get user by ID
     * @param req {Request} - Express Request
     * @param res {Response} - Express Response
     * @returns User object {string}
     * @throws InvalidRequestException if req.params.userId is invalid or blank
     */
    private getUserById = async (req: Request, res: Response) => {
        try {
            const userId: string = req.params.userId;
            if (!userId || userId.trim().length <= 0) {
                throw new InvalidRequestException(['\'userId\' must not be null'], ErrorCodes.ERR_API_INVALID_REQUEST, 400);
            }
            this.iLoggerService.debug('UserController::getUserById - Request to find user by ID', req.params.userId);
            let userResult = await this.iUserService.findUserById(userId);
            if (userResult.success) {
                this.sendResponse(200, userResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::getUserById - Error while finding user by id');
            this.sendError(error);
        }
    }

     /**
    * @author <Rohit.L>
    * @description deleteUser
    * @param req {Request} - Express Request - userId
    * @param res {Response} - Express Response - User details
    * @returns  UserResponse object is returned
    * @throws InvalidRequestException if User id is invalid
    */
     private deleteUser = async (req: Request, res: Response) => {
        try {
            const userId: string = req.params.id;
            this.iLoggerService.debug('UserController::deleteUser - userId', userId);
            const response = await this.iUserService.deleteUser(userId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::deleteUser - Error while delete User');
            this.sendError(error);
        }
    }

    /**
     * @description API - Update user
     * @param req {Request} - Express Request
     * @param res {Response} - Express Response
     * @returns ApiResponse<boolean>
     * @throws InvalidRequestException if req.params.userId is invalid or blank or request is invalid
     */
    private updateUser = async (req: Request, res: Response) => {
        try {
            const updateUserRequest: UpdateUserRequest = req.body;
            updateUserRequest.userId = req.params.userId;
            // this.validateRequest(updateUserRequest, UpdateUserSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            if (updateUserRequest.password && updateUserRequest.password !== '') {
                const hashedPassword = EncryptionUtil.encryptString(updateUserRequest.password);
                updateUserRequest.password = hashedPassword;
            }
            const updateResult = await this.iUserService.updateUser(updateUserRequest);
            if (updateResult.success) {
                this.sendResponse(200, true);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::updateUser - Error while update user');
            this.sendError(error);
        }
    }

    /**
    * @description API - Change Password
    * @param req {Request} - Express Request
    * @param res {Response} - Express Response
    * @returns ApiResponse<boolean>
    * @throws InvalidRequestException if req.body is invalid or blank or password is invalid
    */
    private changePassword = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.debug('UserController::changePassword - Request to change password');
            const changePasswordRequest: ChangePasswordRequest = req.body;
            this.validateRequest(changePasswordRequest, ChangePasswordSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const email: string = changePasswordRequest.email;
            const userResult = await this.iUserService.findUserByEmailOrPhone(email, email);
            if (userResult.success) {
                const user = userResult.data;
                const isPasswordMatch = EncryptionUtil.comparePasswords(changePasswordRequest.oldPassword, user.password);
                if (isPasswordMatch) {
                    const hashedPassword = EncryptionUtil.encryptString(changePasswordRequest.newPassword);
                    const updateUserRequest: UpdateUserRequest = {
                        password: hashedPassword,
                        userId: user.id,
                    };
                    const updateResult = await this.iUserService.updateUser(updateUserRequest);
                    if (updateResult.success) {
                        this.iLoggerService.debug('UserController::changePassword - Password changed success');
                        this.sendResponse(200, true);
                    } else {
                        throw new InvalidRequestException([], ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
                    }
                } else {
                    this.iLoggerService.debug('UserController::changePassword - Password doesn\'t match');
                    throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_PASSWORD, 400);
                }
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::changePassword - Error while update password');
            this.sendError(error);
        }
    }

    /**
     * @description API - Admin sign up API
     * @param req {Request} - Express Request - Signup request
     * @param res {Response} - Express Response - sent email to admin user - JWT token
     * @throws InvalidRequestException if request is invalid
     */
    private signup = async (req: Request, res: Response) => {
        try {
            const signupRequest: SignupRequest = req.body;
            this.validateRequest(signupRequest, SignupSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            await this.createUser(signupRequest);
        } catch (error) {
            this.iLoggerService.error('Error - UserController::signup - Error while user registration');
            this.sendError(error);
        }
    }

    // This can be called through sigup/add user
    private async createUser(signupRequest: SignupRequest) {
        const password = CommonUtils.generateRandomString(8);
        signupRequest.password = password;
        this.validateRequest(signupRequest, AddUserSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
        signupRequest.status = 'ACTIVE';
        const persistUserResult = await this.iUserService.signupUser(signupRequest);
        this.iLoggerService.debug('UserController::createUser - new admin user ', persistUserResult);
        this.sendResponse(201, 'User created successfully');
    }



    /**
    * @description gets all Users lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all Users details
    * @throws ServiceException if failed to retrieve Users
    */
    private getUserList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('UserController::getUsersList');
            const listQueryRequest: ListQueryRequest = req.body;
            this.iLoggerService.log('UserController::getUsersList - retrieve users list', listQueryRequest);
            const response = await this.iUserService.getUserList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('UserController::getUsersList - Error while retrieving users list', 400);
            this.sendError(error);
        }
    }

    /**
     * @description API - Deactivate users
     * @param req {Request} - Express Request - user's Id
     * @param res {Response} - Express Response - success result - deleted user's information
     * @returns 200 if user's information is returned
     * @throws InvalidRequestException if request is invalid
    */
    private deactivateUser = async (req: Request, res: Response) => {
        try {
            const id: string = req.params.id;
            this.iLoggerService.debug('UserController::deactivateUser - DeactivateUser', id);
            const response = await this.iUserService.deactivateUser(id);
            if (response.success) {
                this.sendResponse(200, true);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::deactivateUser - Error while deleting users details by id');
            this.sendError(error);
        }
    }

    /**
    * @description add user
    * @param req {Request} - Express Request - user details
    * @param res {Response} - Express Response - success result
    * @throws InvalidRequestException if failed
    * @returns 201 if user is added
    */
    private addUser = async (req: Request, res: Response) => {
        try {
            const signupRequest: SignupRequest = req.body;
            const password = CommonUtils.generateRandomString(8);
            signupRequest.password = password;
            // this.validateRequest(signupRequest, AddUserSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            signupRequest.status = 'ACTIVE';
            const persistUserResult = await this.iUserService.signupUser(signupRequest);
            this.iLoggerService.debug('UserController::AddUser - new admin user ', persistUserResult);
            this.sendResponse(201, 'User created successfully');
        } catch (error) {
            this.iLoggerService.error('UserController::addUser - Error while adding user', 400);
            this.sendError(error);
        }
    }

    /**
     * @description API - activate users
     * @param req {Request} - Express Request - user's Id
     * @param res {Response} - Express Response - success result - activated user's status
     * @returns 200 if user's information is returned
     * @throws InvalidRequestException if request is invalid
    */
    private activateUser = async (req: Request, res: Response) => {
        try {
            const id: string = req.params.id;
            this.iLoggerService.debug('UserController::activateUser - activateUser', id);
            const response = await this.iUserService.activateUser(id);
            this.iLoggerService.log('UserController::activateUser - print response', response);
            if (response.success) {
                this.sendResponse(200, true);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::deactivateUser - Error while activate users details by id');
            this.sendError(error);
        }
    }


    /**
     * @description API - refresh token
     * @param req {Request} - Express Request - clientId
     * @param res {Response} - Express Response - token
     * @returns 200 if generated token is returned
     * @throws InvalidRequestException if request is invalid
    */
    private refreshToken = async (req: Request, res: Response) => {
        try {
            const sessioninfo = this.getSessionInfo();
            const userId: string = sessioninfo.userId;
            const user = await this.iUserService.findUserById(userId);
            const jwtToken = await this.iUserService.generateUserToken(user.data);
            this.sendResponse(200, jwtToken);
        } catch (error) {
            this.iLoggerService.error('Error - UserController::refreshToken - Error while refreshing token');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit L.>
    * @description API - Resetup users
    * @param req {Request} - Express Request - user's Id
    * @param res {Response} - Express Response - success result - Resetup user's information
    * @returns 200 if user's information is returned
    * @throws InvalidRequestException if request is invalid
   */
    private resetupUser = async (req: Request, res: Response) => {
        try {
            const id: string = req.params.id;
            this.iLoggerService.debug('UserController::resetupUser - ResetupUser', id);
            const response = await this.iUserService.resetupUser(id);
            if (response.success) {
                this.sendResponse(200, true);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_UPDATE_RESOURCE, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::resetupUser - Error while resetup users details by id');
            this.sendError(error);
        }
    }

    /**
     * @description API - Reset password by user Id
     * @param req {Request} - Express Request - req.body (user id and password)
     * @param res {Response} - Express Response -
     * @returns 200 if password is reset successfully
     * @throws InvalidRequestException if user id is invalid or permission denied
     */
    private resetPassword = async (req: Request, res: Response) => {
        try {
            const resetPasswordRequest: ResetPasswordRequest = req.body;
            resetPasswordRequest.userId = req.params.id;
            this.iLoggerService.debug('UserController::resetPassword - Reset User Password');
            this.validateRequest(resetPasswordRequest, ResetPasswordSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            await this.iUserService.resetPassword(resetPasswordRequest);
            this.sendResponse(202, 'Updated');
        } catch (error) {
            this.iLoggerService.error('Error - UserController::resetPassword - Error while reseting password');
            this.sendError(error);
        }
    }
}
