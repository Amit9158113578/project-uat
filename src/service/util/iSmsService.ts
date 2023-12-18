import { SendSMSRequest } from '../../types/request';

/**
 *
 * @description Sms service interface

 */
export interface ISmsService {


    /**
     *
     * @description send sms
     * @param sendSMSRequest {SendSMSRequest}
     * @returns {any}
     * @throws ServiceException if failed to send sms
     */
    sendSMS(sendSMSRequest: SendSMSRequest): Promise<any>;

}
