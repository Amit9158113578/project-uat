"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmNotificationService = void 0;
const admin = require("firebase-admin");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const inversify_1 = require("inversify");
/**

 * @description Farebas cloud messaging Notification service

 */
let FcmNotificationService = class FcmNotificationService {
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
    sendNotification(sendNotificationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const messages = [];
            sendNotificationRequest.deviceIds.forEach(deviceId => {
                messages.push({
                    data: sendNotificationRequest.message,
                    token: deviceId,
                });
            });
            const response = yield admin.messaging().sendAll(messages);
            this.iLoggerService.debug('FcmNotificationService::sendNotification - Success count', response.successCount);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], FcmNotificationService.prototype, "iLoggerService", void 0);
FcmNotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], FcmNotificationService);
exports.FcmNotificationService = FcmNotificationService;
