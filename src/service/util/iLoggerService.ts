/**

 * @description Logger service interface

 */
export interface ILoggerService {

    log(message?: any, ...optionalParams: any[]): void;

    debug(message?: any, ...optionalParams: any[]): void;

    warn(message?: any, ...optionalParams: any[]): void;

    error(message?: any, ...optionalParams: any[]): void;
}
