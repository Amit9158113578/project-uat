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
exports.DocumentController = void 0;
const baseController_1 = require("../baseController");
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const commonUtils_1 = require("../../util/commonUtils");
const path = require("path");
/**
    * @description Document Controller
*/
let DocumentController = class DocumentController extends baseController_1.BaseController {
    constructor() {
        super();
        /**
        * @description API - Upload Image
        * @param req {Request} - Express Request - image
        * @param res {Response} - Express Response - success result
        * @returns 201 if resource is uploaded
        * @throws InvalidRequestException if request is invalid
        */
        this.uploadDocument = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadedFile = req.files.file;
                const projectTitle = req.body.projectTitle;
                this.iLoggerService.log('DocumentController::uploadDocument - uploadedFile', uploadedFile);
                const saveFileRequest = {
                    fileContent: uploadedFile.data,
                    fileName: `${commonUtils_1.CommonUtils.generateUniqueID()}_${uploadedFile.name}`,
                };
                const filePath = yield commonUtils_1.CommonUtils.saveFile(saveFileRequest.fileName, saveFileRequest.fileContent, projectTitle);
                const saveFileResponse = {
                    fileName: filePath,
                };
                const apiResponse = { success: true, data: saveFileResponse };
                res.status(201);
                res.send(apiResponse);
            }
            catch (error) {
                this.iLoggerService.error('Error - DocumentController::uploadDocument - Error while uploading resource');
                this.sendError(error);
            }
        });
        /**
     * @description API - Get File
     * @param req {Request} - Express Request - file path
     * @param res {Response} - Express Response - file content or error response
     * @returns 200 with file content if the file exists, error response otherwise
     * @throws InvalidRequestException if request is invalid
     */
        this.getDocument = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionInfo = this.getSessionInfo();
                console.log('sessionInfo', sessionInfo);
                const filePath = req.query.filePath;
                const fileContent = yield commonUtils_1.CommonUtils.getFile(filePath);
                const fileName = path.basename(filePath);
                this.iLoggerService.log('DocumentController::getDocument - fileName', fileName);
                if (fileContent) {
                    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                    res.setHeader('Content-Length', fileContent.length);
                    res.setHeader('Content-Type', 'application/octet-stream');
                    res.status(200);
                    res.send(Buffer.from(fileContent));
                }
                else {
                    res.status(404).send('File not found');
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - DocumentController::getFile - Error while retrieving the file');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_DOCUMENT}`, this.uploadDocument);
        this.router.get(`${urlConstants_1.URLConstants.URL_DOCUMENT}`, this.getDocument);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], DocumentController.prototype, "iLoggerService", void 0);
DocumentController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DocumentController);
exports.DocumentController = DocumentController;
