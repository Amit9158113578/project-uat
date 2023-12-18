import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ILoggerService } from '../iLoggerService';
import { SendSMSRequest } from '../../../types/request';
import { ISmsService } from '../iSmsService';
import { Twilio } from 'twilio';
import { AppVariables } from '../../../config/appVariables';

/**
 *
 * @description - Sms Service implementation

 */

@injectable()
export class TwilioSmsService implements ISmsService {


    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.AppVariables)
    private appVariables: AppVariables;

    /**
     *
     * @description send sms
     * @param sendSMSRequest {SendSMSRequest}
     * @returns {any}
     * @throws ServiceException if failed to send sms
     */
    public async sendSMS(sendSMSRequest: SendSMSRequest): Promise<any> {
        this.iLoggerService.debug('TwilioSmsService::sendSMS - send sms request: ', sendSMSRequest);
        const twilio = new Twilio(this.appVariables.twilioConfiguration.accountId,
            this.appVariables.twilioConfiguration.authToken);
        const twilioResponse = await twilio.messages.create({
            body: sendSMSRequest.message,
            from: this.appVariables.twilioConfiguration.fromPhoneNo,
            to: `${sendSMSRequest.countryCode}${sendSMSRequest.phoneNumber}`,
        });
        this.iLoggerService.debug('TwilioSmsService::sendSMS - sms sent: ', twilioResponse);
        return twilioResponse;
    }
}


