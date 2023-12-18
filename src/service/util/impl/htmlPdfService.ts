import { injectable, inject } from 'inversify';
import { IPDFService } from '../iPdfService';
import { ReadStream } from 'fs';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ILoggerService } from '../iLoggerService';
import { CommonUtils } from '../../../util/commonUtils';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';
import * as pdf from 'html-pdf';
import * as path from 'path';
/**

 * @description PDF service interface

 */
@injectable()
export class HtmlPdfService implements IPDFService {


    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    /**

     * @description generate PDF file
     * @param templatePath {string} - template path
     * @param templateData {any} - template data
     * @returns ReadStream
     * @throws ServiceException if failed to generate PDF
     */
    public async generatePdf(templatePath: string, templateData: any): Promise<ReadStream> {
        return new Promise<ReadStream>((resolve, reject) => {
            try {
                const tmpDir = path.join(__dirname, '../tmp');
                this.iLoggerService.debug('HtmlPdfService::generatePdf - Generate PDF from template', templatePath);
                const html = CommonUtils.getHtmlFromTemplate(templatePath, templateData);
                pdf.create(html, {
                    directory: tmpDir,
                    format: 'A3',
                    timeout: 300000,
                }).toStream((error: Error, stream: ReadStream) => {
                    if (error) {
                        this.iLoggerService.error('HtmlPdfService::generatePdf - Error while creating pdf', error);
                        reject(new ServiceException([], ErrorCodes.ERR_PDF_SERVICE_EXCEPTION, 500));
                    } else {
                        resolve(stream);
                    }
                });
            } catch (error) {
                this.iLoggerService.error('HtmlPdfService::generatePdf - Error while creating pdf', error);
                reject(new ServiceException([], ErrorCodes.ERR_PDF_SERVICE_EXCEPTION, 500));
            }
        });
    }

}
