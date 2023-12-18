/**

 * @description Invalid Request Exception

 */
export class InvalidRequestException extends Error {

    public errors: Array<string>;
    public errorCode: string;
    public statusCode: number;

    constructor(errors: Array<string>, errorCode: string, statusCode: number) {
        super(errorCode);
        this.errors = errors;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
