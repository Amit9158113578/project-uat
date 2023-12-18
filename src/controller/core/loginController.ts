import { BaseController } from '../baseController';
import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { Response, Request } from 'express';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ErrorCodes } from '../../constants/errorCodes';
import { ApiRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, UpdateUserRequest } from '../../types/request';
import { IUserService } from '../../service/domain/iUserService';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { EncryptionUtil } from '../../util/encryptionUtil';
import { CommonConstants } from '../../constants/commonConstants';
import { CommonUtils } from '../../util/commonUtils';
const LoginSchema = require('../../schema/LoginSchema');

@injectable()
export class LoginController extends BaseController {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;;

    @inject(BaseIdentifiers.UserService)
    private iUserService: IUserService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_LOGIN}`, this.login);
        this.router.put(`${URLConstants.URL_LOGIN}/resetPassword`, this.changePassword);
        this.router.put(`${URLConstants.URL_LOGIN}/forgotPassword`, this.forgotPassword);

    }

    /**
    * @author <Rohit.L>
    * @description API - login API with JSON input
    * @param req {Request} - Express Request - LoginRequest
    * @param res {Response} - Express Response - Jwt Token
    * @returns  Jwt Token is returned
    * @throws InvalidRequestException if Unauthorized
    */
    private login = async (req: Request, res: Response) => {
        try {
            const loginRequest: LoginRequest = req.body;
            console.log(loginRequest);
            this.iLoggerService.debug('LoginController::login - Request to do login', loginRequest);
            this.validateRequest(loginRequest, LoginSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const user = await this.iUserService.checkLogin(loginRequest);
            const jwtToken = await this.iUserService.generateUserToken(user);
            this.iLoggerService.debug('LoginController::login - login successfully! JWT Token', jwtToken);
            user.token = jwtToken;
            this.sendResponse(200, user);
        } catch (error) {
            this.iLoggerService.error('Error - LoginController::login - Error while login');
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
   * @description API - Forgot Password
   * @param req {Request} - Express Request
   * @param res {Response} - Express Response
   * @returns ApiResponse<boolean>
   * @throws InvalidRequestException if req.body is invalid or blank or password is invalid
   */
    private forgotPassword = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.debug('UserController::forgotPassword - Request to forgot password');
            const forgotPasswordRequest: ForgotPasswordRequest = req.body;
            const email: string = forgotPasswordRequest.email;
            const userResult = await this.iUserService.findUserByEmailOrPhone(email, email);

            if (userResult.success) {
                const user = userResult.data;
                const decryptPassword = EncryptionUtil.decryptString(user.password);

                if (decryptPassword) {
                    const resetPasswordLink = CommonConstants.HOST + "?email=" + user.email;
                    const apiRequest: ApiRequest = {
                        email: user.email,
                        fullName: user.fullname,
                        link: resetPasswordLink,
                        phoneNumber: user.phone,
                        resetcode: decryptPassword,
                    };

                    await CommonUtils.callApi(CommonConstants.APIURL, 'POST', apiRequest);
                    res.status(200).send(true);
                }
            } else {
                this.iLoggerService.debug('UserController::forgot password - email doesn\'t match');
                throw new InvalidRequestException([], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - UserController::forgotPassword - Error while forgot password');
            this.sendError(error); // Assuming sendError handles sending error response
        }
    }
}
