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
exports.S3FileService = void 0;
const inversify_1 = require("inversify");
const aws_sdk_1 = require("aws-sdk");
const appVariables_1 = require("../../../config/appVariables");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
/**

 * @description S3 File service implementation

 */
let S3FileService = class S3FileService {
    /**

     * @description Save File
     * @param saveFileRequest {SaveFileRequest} - SaveFileRequest object
     * @returns SaveFileResponse
     * @throws ServiceException if failed to save file
     */
    saveFile(saveFileRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('S3FileService::saveFile - Upload file to S3');
                const s3 = this.getS3Client();
                const params = {
                    Body: saveFileRequest.fileContent,
                    Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                    Key: saveFileRequest.fileName,
                };
                const uploadResult = yield s3.upload(params).promise();
                const saveFileResponse = {
                    fileName: uploadResult.Key,
                };
                this.iLoggerService.debug('S3FileService::saveFile - Upload file to S3 Result', uploadResult);
                return saveFileResponse;
            }
            catch (error) {
                this.iLoggerService.debug('Error - S3FileService::saveFile - Error while uploading file', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
            }
        });
    }
    /**

     * @description Get File
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file
     * @throws ServiceException if failed to get file
     */
    getFile(getFileRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3 = this.getS3Client();
                const params = {
                    Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                    Key: getFileRequest.fileName,
                };
                const getResult = yield s3.getObject(params).promise();
                return getResult.Body;
            }
            catch (error) {
                this.iLoggerService.error('Error - S3FileService::getFile - Error while getting file', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
            }
        });
    }
    /**

     * @description Get File URL
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file url
     * @throws ServiceException if failed to get file url
     */
    getFileUrl(getFileRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3 = this.getS3Client();
                const params = {
                    Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                    Expires: 60 * 5,
                    Key: getFileRequest.fileName,
                };
                const signedUrl = s3.getSignedUrl('getObject', params);
                return signedUrl;
            }
            catch (error) {
                this.iLoggerService.error('Error - S3FileService::getFileUrl - Error while getting file URL', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
            }
        });
    }
    /**

     * @description Get File Stream
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file
     * @throws ServiceException if failed to get file stream
     */
    getFileStream(getFileRequest) {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                Key: getFileRequest.fileName,
            };
            return s3.getObject(params).createReadStream();
        }
        catch (error) {
            this.iLoggerService.error('Error - S3FileService::getFile - Error while getting file', error);
            throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
        }
    }
    /**
     *
     * @description Delete File
     * @param deleteFileRequest {DeleteFileRequest} - DeleteFileRequest object
     * @returns file
     * @throws ServiceException if failed to delete file
     */
    deleteFile(deleteFileRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3 = this.getS3Client();
                const params = {
                    Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                    Key: deleteFileRequest.fileName,
                };
                const deleteResponse = yield s3.deleteObject(params).promise();
                return deleteResponse;
            }
            catch (error) {
                this.iLoggerService.error('Error - S3FileService::deleteFile - Error while deleting file', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_DELETE_RESOURCE, 500);
            }
        });
    }
    getS3Client() {
        if (!this.s3Client) {
            this.s3Client = new aws_sdk_1.S3();
        }
        return this.s3Client;
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AppVariables),
    __metadata("design:type", appVariables_1.AppVariables)
], S3FileService.prototype, "appVariables", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], S3FileService.prototype, "iLoggerService", void 0);
S3FileService = __decorate([
    (0, inversify_1.injectable)()
], S3FileService);
exports.S3FileService = S3FileService;
