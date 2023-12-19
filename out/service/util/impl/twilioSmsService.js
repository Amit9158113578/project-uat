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
exports.TwilioSmsService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const twilio_1 = require("twilio");
const appVariables_1 = require("../../../config/appVariables");
/**
 *
 * @description - Sms Service implementation

 */
let TwilioSmsService = class TwilioSmsService {
    /**
     *
     * @description send sms
     * @param sendSMSRequest {SendSMSRequest}
     * @returns {any}
     * @throws ServiceException if failed to send sms
     */
    sendSMS(sendSMSRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('TwilioSmsService::sendSMS - send sms request: ', sendSMSRequest);
            const twilio = new twilio_1.Twilio(this.appVariables.twilioConfiguration.accountId, this.appVariables.twilioConfiguration.authToken);
            const twilioResponse = yield twilio.messages.create({
                body: sendSMSRequest.message,
                from: this.appVariables.twilioConfiguration.fromPhoneNo,
                to: `${sendSMSRequest.countryCode}${sendSMSRequest.phoneNumber}`,
            });
            this.iLoggerService.debug('TwilioSmsService::sendSMS - sms sent: ', twilioResponse);
            return twilioResponse;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], TwilioSmsService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AppVariables),
    __metadata("design:type", appVariables_1.AppVariables)
], TwilioSmsService.prototype, "appVariables", void 0);
TwilioSmsService = __decorate([
    (0, inversify_1.injectable)()
], TwilioSmsService);
exports.TwilioSmsService = TwilioSmsService;
