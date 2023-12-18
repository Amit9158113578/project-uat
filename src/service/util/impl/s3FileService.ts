import { IFileService } from '../iFileService';
import { injectable, inject } from 'inversify';
import { SaveFileRequest, GetFileRequest, DeleteFileRequest } from '../../../types/request';
import { SaveFileResponse } from '../../../types/reponse';
import { S3 } from 'aws-sdk';
import { AppVariables } from '../../../config/appVariables';
import { ILoggerService } from '../iLoggerService';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';

/**

 * @description S3 File service implementation

 */
@injectable()
export class S3FileService implements IFileService {


    @inject(BaseIdentifiers.AppVariables)
    private appVariables: AppVariables;

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    private s3Client: S3;

    /**

     * @description Save File
     * @param saveFileRequest {SaveFileRequest} - SaveFileRequest object
     * @returns SaveFileResponse
     * @throws ServiceException if failed to save file
     */
    public async saveFile(saveFileRequest: SaveFileRequest): Promise<SaveFileResponse> {
        try {
            this.iLoggerService.debug('S3FileService::saveFile - Upload file to S3');
            const s3 = this.getS3Client();
            const params = {
                Body: saveFileRequest.fileContent,
                Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                Key: saveFileRequest.fileName,
            };
            const uploadResult = await s3.upload(params).promise();
            const saveFileResponse: SaveFileResponse = {
                fileName: uploadResult.Key,
            };
            this.iLoggerService.debug('S3FileService::saveFile - Upload file to S3 Result', uploadResult);
            return saveFileResponse;
        } catch (error) {
            this.iLoggerService.debug('Error - S3FileService::saveFile - Error while uploading file', error);
            throw new ServiceException([], ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
        }
    }

    /**

     * @description Get File
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file
     * @throws ServiceException if failed to get file
     */
    public async getFile(getFileRequest: GetFileRequest): Promise<any> {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                Key: getFileRequest.fileName,
            };
            const getResult = await s3.getObject(params).promise();
            return getResult.Body;
        } catch (error) {
            this.iLoggerService.error('Error - S3FileService::getFile - Error while getting file', error);
            throw new ServiceException([], ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
        }
    }

    /**

     * @description Get File URL
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file url
     * @throws ServiceException if failed to get file url
     */
    public async getFileUrl(getFileRequest: GetFileRequest): Promise<string> {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                Expires: 60 * 5,
                Key: getFileRequest.fileName,
            };
            const signedUrl = s3.getSignedUrl('getObject', params);
            return signedUrl;
        } catch (error) {
            this.iLoggerService.error('Error - S3FileService::getFileUrl - Error while getting file URL', error);
            throw new ServiceException([], ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
        }
    }

    /**

     * @description Get File Stream
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file
     * @throws ServiceException if failed to get file stream
     */
    public getFileStream(getFileRequest: GetFileRequest): any {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                Key: getFileRequest.fileName,
            };
            return s3.getObject(params).createReadStream();
        } catch (error) {
            this.iLoggerService.error('Error - S3FileService::getFile - Error while getting file', error);
            throw new ServiceException([], ErrorCodes.ERR_API_UPLOAD_RESOURCE, 500);
        }
    }

    /**
     *
     * @description Delete File
     * @param deleteFileRequest {DeleteFileRequest} - DeleteFileRequest object
     * @returns file
     * @throws ServiceException if failed to delete file
     */
    public async deleteFile(deleteFileRequest: DeleteFileRequest): Promise<any> {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket: this.appVariables.awsConfiguration.resourceBucketName,
                Key: deleteFileRequest.fileName,
            };
            const deleteResponse = await s3.deleteObject(params).promise();
            return deleteResponse;
        } catch (error) {
            this.iLoggerService.error('Error - S3FileService::deleteFile - Error while deleting file', error);
            throw new ServiceException([], ErrorCodes.ERR_API_DELETE_RESOURCE, 500);
        }
    }

    private getS3Client(): S3 {
        if (!this.s3Client) {
            this.s3Client = new S3();
        }
        return this.s3Client;
    }

}
