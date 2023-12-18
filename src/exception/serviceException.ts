/**

 * @description Service Exception

 */
export class ServiceException extends Error {

    public errors: Array<any>;
    public errorCode: string;
    public statusCode: number;

    constructor(errors: Array<any>, errorCode: string, statusCode: number) {
        super(errorCode);
        this.errors = errors;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
