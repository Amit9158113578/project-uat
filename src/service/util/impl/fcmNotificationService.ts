import { SendNotificationRequest } from '../../../types/request';
import { INotificationService } from '../iNotificationService';
import * as admin from 'firebase-admin';
import { ILoggerService } from '../iLoggerService';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { inject, injectable } from 'inversify';
/**

 * @description Farebas cloud messaging Notification service

 */
@injectable()
export class FcmNotificationService implements INotificationService {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;


    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert('FirebasePrivateKey'),
            databaseURL: 'https://medtransgo.firebaseio.com',
        });
    }

    /**

     * @description Send Notification to device IDs
     * @param sendNotificationRequest {SendNotificationRequest} - Send Notification
     * @throws ServiceException if failed to send notification
     */
    public async sendNotification(sendNotificationRequest: SendNotificationRequest) {
        // if (sendNotificationRequest.userIds && sendNotificationRequest.userIds.length > 0) {
        //     const devicesResponse = await this.iDeviceService.getDeviceList({
        //         conditions: [
        //             {
        //                 fieldName: FieldNames.FIELD_USER_ID,
        //                 op: 'in',
        //                 value: sendNotificationRequest.userIds,
        //             }
        //         ],
        //         limit: DBConstants.DB_QUERY_MAX_RESULT,
        //     });
        //     if (devicesResponse.success && devicesResponse.data && devicesResponse.data.length > 0) {
        //         devicesResponse.data.forEach(device => {
        //             sendNotificationRequest.deviceIds.push(device.token);
        //         });
        //     }
        // }
        const messages: admin.messaging.Message[] = [];
        sendNotificationRequest.deviceIds.forEach(deviceId => {
            messages.push({
                data: sendNotificationRequest.message,
                token: deviceId,
            });
        });
        const response = await admin.messaging().sendAll(messages);
        this.iLoggerService.debug('FcmNotificationService::sendNotification - Success count', response.successCount);
    }

}
