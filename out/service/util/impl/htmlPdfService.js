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
exports.HtmlPdfService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const commonUtils_1 = require("../../../util/commonUtils");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
const pdf = require("html-pdf");
const path = require("path");
/**

 * @description PDF service interface

 */
let HtmlPdfService = class HtmlPdfService {
    /**

     * @description generate PDF file
     * @param templatePath {string} - template path
     * @param templateData {any} - template data
     * @returns ReadStream
     * @throws ServiceException if failed to generate PDF
     */
    generatePdf(templatePath, templateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const tmpDir = path.join(__dirname, '../tmp');
                    this.iLoggerService.debug('HtmlPdfService::generatePdf - Generate PDF from template', templatePath);
                    const html = commonUtils_1.CommonUtils.getHtmlFromTemplate(templatePath, templateData);
                    pdf.create(html, {
                        directory: tmpDir,
                        format: 'A3',
                        timeout: 300000,
                    }).toStream((error, stream) => {
                        if (error) {
                            this.iLoggerService.error('HtmlPdfService::generatePdf - Error while creating pdf', error);
                            reject(new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_PDF_SERVICE_EXCEPTION, 500));
                        }
                        else {
                            resolve(stream);
                        }
                    });
                }
                catch (error) {
                    this.iLoggerService.error('HtmlPdfService::generatePdf - Error while creating pdf', error);
                    reject(new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_PDF_SERVICE_EXCEPTION, 500));
                }
            });
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], HtmlPdfService.prototype, "iLoggerService", void 0);
HtmlPdfService = __decorate([
    (0, inversify_1.injectable)()
], HtmlPdfService);
exports.HtmlPdfService = HtmlPdfService;
