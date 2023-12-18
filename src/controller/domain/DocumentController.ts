import { BaseController } from '../baseController';
import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { ILoggerService } from '../../service/util/iLoggerService';
import { URLConstants } from '../../constants/urlConstants';
import { Request, Response } from 'express';
import { CommonUtils } from '../../util/commonUtils';
import { SaveFileRequest } from '../../types/request';
import { UploadedFile } from 'express-fileupload';
import { ApiResponse } from '../../types/apiResponse';
import { SaveFileResponse } from '../../types/reponse';
import * as path from 'path';



/**
    * @description Document Controller
*/
@injectable()
export class DocumentController extends BaseController {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;


    constructor() {
        super();
        this.router.post(`${URLConstants.URL_DOCUMENT}`, this.uploadDocument);
        this.router.get(`${URLConstants.URL_DOCUMENT}`, this.getDocument);
    }

    /**
    * @description API - Upload Image
    * @param req {Request} - Express Request - image
    * @param res {Response} - Express Response - success result
    * @returns 201 if resource is uploaded
    * @throws InvalidRequestException if request is invalid
    */
    private uploadDocument = async (req: Request, res: Response) => {
        try {
            const uploadedFile = req.files.file as UploadedFile;
            const projectTitle = req.body.projectTitle; 
            this.iLoggerService.log('DocumentController::uploadDocument - uploadedFile', uploadedFile);
            const saveFileRequest: SaveFileRequest = {
                fileContent: uploadedFile.data,
                fileName: `${CommonUtils.generateUniqueID()}_${uploadedFile.name}`,
            };
            const filePath = await CommonUtils.saveFile(saveFileRequest.fileName, saveFileRequest.fileContent, projectTitle);
            const saveFileResponse: SaveFileResponse = {
                fileName: filePath,
            };
            const apiResponse: ApiResponse<SaveFileResponse> = { success: true, data: saveFileResponse };
            res.status(201);
            res.send(apiResponse);
        } catch (error) {
            this.iLoggerService.error('Error - DocumentController::uploadDocument - Error while uploading resource');
            this.sendError(error);
        }
    }

    /**
 * @description API - Get File
 * @param req {Request} - Express Request - file path
 * @param res {Response} - Express Response - file content or error response
 * @returns 200 with file content if the file exists, error response otherwise
 * @throws InvalidRequestException if request is invalid
 */
    private getDocument = async (req: Request, res: Response) => {
        try {
            const sessionInfo = this.getSessionInfo();
            console.log('sessionInfo', sessionInfo)
            const filePath = req.query.filePath as string;
            const fileContent =  await CommonUtils.getFile(filePath);
            const fileName = path.basename(filePath);
            this.iLoggerService.log('DocumentController::getDocument - fileName', fileName);
            if (fileContent) {
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.setHeader('Content-Length', fileContent.length);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.status(200)
                res.send(Buffer.from(fileContent));
            } else {
                res.status(404).send('File not found');
            }
        } catch (error) {
            this.iLoggerService.error('Error - DocumentController::getFile - Error while retrieving the file');
            this.sendError(error);
        }
    }


}
