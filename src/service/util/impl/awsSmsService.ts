import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ILoggerService } from '../iLoggerService';
import { SendSMSRequest } from '../../../types/request';
import { ISmsService } from '../iSmsService';
import { SNS } from 'aws-sdk';
import { AppVariables } from '../../../config/appVariables';

/**
 *
 * @description - Sms Service implementation

 */

@injectable()
export class AwsSmsService implements ISmsService {


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
        this.iLoggerService.debug('SmsService::sendSMS - send sms request: ', sendSMSRequest);
        // Create publish parameters
        const params = {
            Message: sendSMSRequest.message, // required
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional',
                }
            },
            PhoneNumber: sendSMSRequest.phoneNumber,
        };
        const awsSnsResponse = await new SNS({
            apiVersion: '2010-03-31',
            region: this.appVariables.awsConfiguration.region,
        }).publish(params).promise();
        this.iLoggerService.debug('SmsService::sendSMS - sms sent: ', awsSnsResponse);
        return awsSnsResponse;
    }
}


