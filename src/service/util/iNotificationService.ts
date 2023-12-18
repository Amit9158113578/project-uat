import { SendNotificationRequest } from '../../types/request';

/**

 * @description Notification service

 */
export interface INotificationService {

    /**

     * @description Send Notification to device IDs
     * @param sendNotificationRequest {SendNotificationRequest} - Send Notification
     * @throws ServiceException if failed to send notification
     */
    sendNotification(sendNotificationRequest: SendNotificationRequest): Promise<void>;

}
