import { SetSmsReminderRequest } from '../../types/request';

/**

 * @description Reminder service

 */
export interface IReminderService {

    /**

     * @description Sets SMS reminder
     * @param setSmsReminderRequest {SetSmsReminderRequest} - Set SMS Reminder
     * @returns {string} reminderId
     * @throws ServiceException if failed to set reminder
     */
    setSmsReminder(setSmsReminderRequest: SetSmsReminderRequest): Promise<string>;

    /**

     * @description Delete reminder
     * @param reminderId {string} - Id of reminder to be deleted
     * @throws ServiceException if failed to remove reminder
     */
    deleteReminder(reminderId: string): Promise<void>;

}
