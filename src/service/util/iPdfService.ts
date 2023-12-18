import { ReadStream } from 'fs';

/**

 * @description PDF service interface

 */
export interface IPDFService {

    /**

     * @description generate PDF file
     * @param templatePath {string} - template path
     * @param templateData {any} - template data
     * @returns ReadStream
     * @throws ServiceException if failed to generate PDF
     */
    generatePdf(templatePath: string, templateData: any): Promise<ReadStream>;

}
