import { SendEmailResponse } from '../../types/reponse';
import { SendEmailRequest } from '../../types/request';

/**

 * @description Email service interface

 */
export interface IEmailService {

    /**

     * @description Sends email
     * @param sendEmailRequest {SendEmailRequest} - SendEmailRequest object
     * @returns SendEmailResponse
     * @throws ServiceException if failed to send an email
     */
    sendEmail(sendEmailRequest: SendEmailRequest): Promise<SendEmailResponse>;

}
