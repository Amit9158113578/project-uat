import { EventBridge } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { AppVariables } from '../../../config/appVariables';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { SetSmsReminderRequest } from '../../../types/request';
import { ILoggerService } from '../iLoggerService';

/**

 * @description Reminder service

 */
@injectable()
export class AWSReminderService {

    @inject(BaseIdentifiers.AppVariables)
    private appVariables: AppVariables;

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    private readonly MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    /**

     * @description Sets SMS reminder
     * @param setSmsReminderRequest {SetSmsReminderRequest} - Set SMS Reminder
     * @returns {string} reminderId
     * @throws ServiceException if failed to set reminder
     */
    public async setSmsReminder(setSmsReminderRequest: SetSmsReminderRequest): Promise<string> {
        this.iLoggerService.debug('AWSReminderService::setSmsReminder - Set SMS Reminder');
        const eventBridge = new EventBridge({
            region: this.appVariables.awsConfiguration.region,
        });
        const putEventResult = await eventBridge.putRule({
            Name: setSmsReminderRequest.id,
            ScheduleExpression: this.getCronJobExpression(setSmsReminderRequest.timestamp),
            State: 'ENABLED'
        }).promise();
        this.iLoggerService.debug('AWSReminderService::setSmsReminder - Put Rule response', putEventResult);
        if (!putEventResult.$response.error) {
            const putTargetResponse = await eventBridge.putTargets({
                Rule: setSmsReminderRequest.id,
                Targets: [{
                    Arn: this.appVariables.awsConfiguration.sendSmsLambdaArn,
                    Id: setSmsReminderRequest.id,
                    Input: JSON.stringify({
                        eventRule: setSmsReminderRequest.id,
                        smsRequests: setSmsReminderRequest.smsRequests
                    }),
                }],
            }).promise();
            this.iLoggerService.debug('AWSReminderService::setSmsReminder - Put target response', putTargetResponse);
            if (!putTargetResponse.$response.error) {
                return setSmsReminderRequest.id;
            }
        }
    }

    /**

     * @description Delete reminder
     * @param reminderId {string} - Id of reminder to be deleted
     * @throws ServiceException if failed to remove reminder
     */
    public async deleteReminder(reminderId: string): Promise<void> {
        this.iLoggerService.debug('AWSReminderService::deleteReminder - Delete Reminder', reminderId);
        const eventBridge = new EventBridge();
        await eventBridge.removeTargets({
            Ids: [
                reminderId,
            ],
            Rule: reminderId,
        }).promise();
        await eventBridge.deleteRule({
            Name: reminderId,
        }).promise();
    }


    private getCronJobExpression(timestamp: number) {
        const date = new Date(timestamp);
        const monthDay = date.getUTCDate();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const cronExpression = `cron(${minutes} ${hours} ${monthDay} ${this.MONTH_NAMES[month]} ? ${year})`;
        return cronExpression;
    }

}
