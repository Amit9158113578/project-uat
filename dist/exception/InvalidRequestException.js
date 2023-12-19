"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestException = void 0;
/**

 * @description Invalid Request Exception

 */
class InvalidRequestException extends Error {
    constructor(errors, errorCode, statusCode) {
        super(errorCode);
        this.errors = errors;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
exports.InvalidRequestException = InvalidRequestException;
