import { ILoggerService } from '../iLoggerService';
import { injectable } from 'inversify';
import * as bunyan from 'bunyan';
import { CommonConstants } from '../../../constants/commonConstants';
import { CommonUtils } from '../../../util/commonUtils';

/**

 * @description Logger service implementation

 */
@injectable()
export class LoggerService implements ILoggerService {

    private logger: any;

    // constructor() {
    //     this.logger = bunyan.createLogger({
    //         name: CommonConstants.APP_NAME,
    //         level: 'debug',
    //         streams: [
    //             {
    //                 type: 'file',
    //                 path: 'D:/MTG/log/file.log', // Specify the desired file path here
    //                 level: 'debug'
    //             }
    //         ]
    //     });
    // }

    constructor() {
        this.logger = bunyan.createLogger({ name: CommonConstants.APP_NAME, level: 'debug' });
    }


    public log(message?: any, ...optionalParams: any[]): void {
        this.logMessage('debug', message, optionalParams);
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        this.logMessage('debug', message, optionalParams);
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        this.logMessage('warn', message, optionalParams);
    }

    public error(message?: any, ...optionalParams: any[]): void {
        this.logMessage('error', message, optionalParams);
    }

    private logMessage(level: string, message: any, params) {
        if (!CommonUtils.isEmpty(params)) {
            this.logger[level](message, params);
        } else {
            this.logger[level](message);
        }
    }

}
