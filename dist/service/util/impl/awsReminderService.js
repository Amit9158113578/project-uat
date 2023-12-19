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
exports.AWSReminderService = void 0;
const aws_sdk_1 = require("aws-sdk");
const inversify_1 = require("inversify");
const appVariables_1 = require("../../../config/appVariables");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
/**

 * @description Reminder service

 */
let AWSReminderService = class AWSReminderService {
    constructor() {
        this.MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        ];
    }
    /**

     * @description Sets SMS reminder
     * @param setSmsReminderRequest {SetSmsReminderRequest} - Set SMS Reminder
     * @returns {string} reminderId
     * @throws ServiceException if failed to set reminder
     */
    setSmsReminder(setSmsReminderRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('AWSReminderService::setSmsReminder - Set SMS Reminder');
            const eventBridge = new aws_sdk_1.EventBridge({
                region: this.appVariables.awsConfiguration.region,
            });
            const putEventResult = yield eventBridge.putRule({
                Name: setSmsReminderRequest.id,
                ScheduleExpression: this.getCronJobExpression(setSmsReminderRequest.timestamp),
                State: 'ENABLED'
            }).promise();
            this.iLoggerService.debug('AWSReminderService::setSmsReminder - Put Rule response', putEventResult);
            if (!putEventResult.$response.error) {
                const putTargetResponse = yield eventBridge.putTargets({
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
        });
    }
    /**

     * @description Delete reminder
     * @param reminderId {string} - Id of reminder to be deleted
     * @throws ServiceException if failed to remove reminder
     */
    deleteReminder(reminderId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('AWSReminderService::deleteReminder - Delete Reminder', reminderId);
            const eventBridge = new aws_sdk_1.EventBridge();
            yield eventBridge.removeTargets({
                Ids: [
                    reminderId,
                ],
                Rule: reminderId,
            }).promise();
            yield eventBridge.deleteRule({
                Name: reminderId,
            }).promise();
        });
    }
    getCronJobExpression(timestamp) {
        const date = new Date(timestamp);
        const monthDay = date.getUTCDate();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const cronExpression = `cron(${minutes} ${hours} ${monthDay} ${this.MONTH_NAMES[month]} ? ${year})`;
        return cronExpression;
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AppVariables),
    __metadata("design:type", appVariables_1.AppVariables)
], AWSReminderService.prototype, "appVariables", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], AWSReminderService.prototype, "iLoggerService", void 0);
AWSReminderService = __decorate([
    (0, inversify_1.injectable)()
], AWSReminderService);
exports.AWSReminderService = AWSReminderService;
