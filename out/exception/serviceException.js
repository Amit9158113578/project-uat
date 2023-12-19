"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceException = void 0;
/**

 * @description Service Exception

 */
class ServiceException extends Error {
    constructor(errors, errorCode, statusCode) {
        super(errorCode);
        this.errors = errors;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
exports.ServiceException = ServiceException;
