import { injectable, inject } from 'inversify';
import { IEmailService } from '../iEmailService';
import { SendEmailRequest } from '../../../types/request';
import { SendEmailResponse } from '../../../types/reponse';
import * as Nodemailer from 'nodemailer';
import { AppVariables } from '../../../config/appVariables';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { CommonUtils } from '../../../util/commonUtils';
import { ILoggerService } from '../iLoggerService';
import { RequestContext } from '../../../config/requestContext';
import { MaskUtils } from '../../../util/maskUtils';

/**

 * @description Nodemailer service implementation

 */
@injectable()
export class NodeMailerService implements IEmailService {


    @inject(BaseIdentifiers.AppVariables)
    private appVariables: AppVariables;

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.RequestContext)
    private requestContext: RequestContext;

    public async sendEmail(sendEmailRequest: SendEmailRequest): Promise<SendEmailResponse> {
        const sendEmailResponse: SendEmailResponse = {
            success: false
        };
        try {
            this.iLoggerService.debug('NodeMailerService::sendEmail - Send Email', sendEmailRequest);
            const transport = Nodemailer.createTransport({
                auth: {
                    pass: this.appVariables.emailConfiguration.userEmailPassword,
                    user: this.appVariables.emailConfiguration.userEmail,
                },
                service: this.appVariables.emailConfiguration.service,
            });

            if (sendEmailRequest.template) {
                const host = CommonUtils.getHost(this.requestContext.getRequest());
                if (!sendEmailRequest.templateData) {
                    sendEmailRequest.templateData = {};
                }
                sendEmailRequest.templateData.cdnHost = host;
                if (sendEmailRequest.maskSensitiveData && sendEmailRequest.templateData) {
                    sendEmailRequest.templateData = MaskUtils.mask(sendEmailRequest.templateData, sendEmailRequest.fieldsToBeMasked);
                }
                sendEmailRequest.html = CommonUtils.getHtmlFromTemplate(sendEmailRequest.template,
                    sendEmailRequest.templateData, (sendEmailRequest.includeTemplate !== undefined ?
                        sendEmailRequest.includeTemplate : true));
            }

            const emailResult = await transport.sendMail({
                bcc: sendEmailRequest.bcc || '',
                cc: sendEmailRequest.cc || '',
                from: sendEmailRequest.from || this.appVariables.emailConfiguration.from,
                html: sendEmailRequest.html,
                subject: sendEmailRequest.subject,
                text: sendEmailRequest.text,
                to: sendEmailRequest.to,
            });
            sendEmailResponse.success = true;
            sendEmailResponse.messageId = emailResult.messageId;
            this.iLoggerService.debug('NodeMailerService::sendEmail - Email sent!');
        } catch (error) {
            this.iLoggerService.error('Error - NodeMailerService::sendEmail - Error while sending a mail', error);
        }
        return sendEmailResponse;
    }


}
