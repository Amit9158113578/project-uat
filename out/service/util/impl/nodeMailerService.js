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
exports.NodeMailerService = void 0;
const inversify_1 = require("inversify");
const Nodemailer = require("nodemailer");
const appVariables_1 = require("../../../config/appVariables");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const commonUtils_1 = require("../../../util/commonUtils");
const requestContext_1 = require("../../../config/requestContext");
const maskUtils_1 = require("../../../util/maskUtils");
/**

 * @description Nodemailer service implementation

 */
let NodeMailerService = class NodeMailerService {
    sendEmail(sendEmailRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendEmailResponse = {
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
                    const host = commonUtils_1.CommonUtils.getHost(this.requestContext.getRequest());
                    if (!sendEmailRequest.templateData) {
                        sendEmailRequest.templateData = {};
                    }
                    sendEmailRequest.templateData.cdnHost = host;
                    if (sendEmailRequest.maskSensitiveData && sendEmailRequest.templateData) {
                        sendEmailRequest.templateData = maskUtils_1.MaskUtils.mask(sendEmailRequest.templateData, sendEmailRequest.fieldsToBeMasked);
                    }
                    sendEmailRequest.html = commonUtils_1.CommonUtils.getHtmlFromTemplate(sendEmailRequest.template, sendEmailRequest.templateData, (sendEmailRequest.includeTemplate !== undefined ?
                        sendEmailRequest.includeTemplate : true));
                }
                const emailResult = yield transport.sendMail({
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
            }
            catch (error) {
                this.iLoggerService.error('Error - NodeMailerService::sendEmail - Error while sending a mail', error);
            }
            return sendEmailResponse;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AppVariables),
    __metadata("design:type", appVariables_1.AppVariables)
], NodeMailerService.prototype, "appVariables", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], NodeMailerService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.RequestContext),
    __metadata("design:type", requestContext_1.RequestContext)
], NodeMailerService.prototype, "requestContext", void 0);
NodeMailerService = __decorate([
    (0, inversify_1.injectable)()
], NodeMailerService);
exports.NodeMailerService = NodeMailerService;
