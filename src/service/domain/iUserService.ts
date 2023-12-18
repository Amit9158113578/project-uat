import { User, } from '../../types/entity';
import { LoginRequest, UpdateUserRequest, SignupRequest, ListQueryRequest, ResetPasswordRequest } from '../../types/request';
import { Response } from '../../types/reponse';

/**

 * @description UserService interface

 */
export interface IUserService {

    /**

     * @description checks login
     * @param loginRequest {LoginRequest} - username can be email/contactNo
     * @returns User
     * @throws ServiceException if user not found or password is invalid
     */
    checkLogin(loginRequest: LoginRequest): Promise<User>;

    /**

     * @description generates JWT token for the user
     * @param user {User} - User Object
     * @param application {Application} - Application object
     * @param sessionValidityTime {number} - Session Validity time in Minutes
     * @returns JWT Token {string}
     * @throws ServiceException if error occured while generating JWT token
    */
    generateUserToken(user: User): Promise<string>;


    /**

     * @description finds user by email or phone
     * @param email {string} - user email
     * @param phone {string} - user phone
     * @returns User
     */
    findUserByEmailOrPhone(email: string, phone: string): Promise<Response<User>>;


    /**

     * @description finds user by id
     * @param id {string} - primary key id
     * @returns User
     */
    findUserById(id: string): Promise<Response<User>>;


     /**

     * @description delete user by id
     * @param id {string} - primary key id
     * @returns User
     */
     deleteUser(id: string): Promise<Response<Number>>;
    /**

     * @description update user
     * @param updateUserRequest {UpdateUserRequest} - UpdateUserRequest
     * @returns Number - 1 if success
     */
    updateUser(updateUserRequest: UpdateUserRequest): Promise<Response<Number>>;

    /**

     * @description add a new user
     * @param signupRequest {SignupRequest} - SignupRequest
     * @returns User
     */
    signupUser(signupRequest: SignupRequest): Promise<Response<User>>;

    /**
     *
     * @description gets users by query criteria
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response users
     * @throws ServiceException if failed to retrieve users
     */
    getUserList(listQueryRequest: ListQueryRequest): Promise<Response<User[]>>;

    /**
     *
     * @description Deactivate User
     * @param id {string} - User ID
     * @returns success response
     * @throws ServiceException if failed to update User
     */
    deactivateUser(id: string): Promise<Response<Number>>;

    /**
     *
     * @description Activate User
     * @param id {string} - User ID
     * @returns success response
     * @throws ServiceException if failed to update User
     */
    activateUser(id: string): Promise<Response<Number>>;


    /**
     *
     * @description Reset Password
     * @param resetPasswordRequest {ResetPasswordRequest} - User ID
     * @returns success response
     * @throws ServiceException if failed to reset password
     */
    resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<Response<Number>>;

    /**
     * @author <Rohit L.>
     * @description Resetup User
     * @param id {string} - User ID
     * @returns success response
     * @throws ServiceException if failed to update User
     */
    resetupUser(id: string): Promise<Response<Number>>;

}
