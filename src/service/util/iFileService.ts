import { SaveFileResponse } from '../../types/reponse';
import { SaveFileRequest, GetFileRequest, DeleteFileRequest } from '../../types/request';

/**

 * @description File service interface

 */
export interface IFileService {

    /**

     * @description Save File
     * @param saveFileRequest {SaveFileRequest} - SaveFileRequest object
     * @returns SaveFileResponse
     * @throws ServiceException if failed to save file
     */
    saveFile(saveFileRequest: SaveFileRequest): Promise<SaveFileResponse>;

    /**

     * @description Get File
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file
     * @throws ServiceException if failed to get file
     */
    getFile(getFileRequest: GetFileRequest): Promise<any>;


    /**

     * @description Get File URL
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file url
     * @throws ServiceException if failed to get file url
     */
    getFileUrl(getFileRequest: GetFileRequest): Promise<string>;

    /**

     * @description Get File Stream
     * @param getFileRequest {GetFileRequest} - GetFileRequest object
     * @returns file stream
     * @throws ServiceException if failed to get file stream
     */
    getFileStream(getFileRequest: GetFileRequest): any;

    /**
     *
     * @description Delete File
     * @param deleteFileRequest {DeleteFileRequest} - DeleteFileRequest object
     * @returns file
     * @throws ServiceException if failed to delete file
     */
    deleteFile(deleteFileRequest: DeleteFileRequest): Promise<any>;

}
