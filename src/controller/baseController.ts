import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { SessionInfo } from '../types/sessionInfo';
import { ValidationUtils } from '../util/validationUtils';
import { CommonUtils } from '../util/commonUtils';
import { InvalidRequestException } from '../exception/InvalidRequestException';
import { ApiResponse } from '../types/apiResponse';
import { RequestContext } from '../config/requestContext';
import { BaseIdentifiers } from '../config/baseIdentifiers';
import { ServiceException } from '../exception/serviceException';
import { CommonConstants } from '../constants/commonConstants';
import { MaskUtils } from '../util/maskUtils';

/**

 * @description Base Controller

 */
@injectable()
export class BaseController {

    protected router: Router = Router();

    @inject(BaseIdentifiers.RequestContext)
    private requestContext: RequestContext;

    public getRoutes(): Router {
        return this.router;
    }

    protected validateRequest(object: any, schema: any, errorCode: string): boolean {
        let validationResult = ValidationUtils.validate(object, schema);
        if (!CommonUtils.isEmpty(validationResult)) {
            throw new InvalidRequestException(validationResult, errorCode, 400);
        }
        return true;
    }

    protected getSessionInfo(): SessionInfo {
        return this.requestContext.getSessionInfo();
    }

    protected sendError(error: any) {
        let apiResponse: ApiResponse<any> = { success: false };
        if (error instanceof InvalidRequestException || error instanceof ServiceException) {
            let requestError: InvalidRequestException = error;
            apiResponse.errorCode = requestError.errorCode;
            apiResponse.errors = requestError.errors;
            this.requestContext.getResponse().status(requestError.statusCode);
        } else {
            apiResponse.errorCode = error;
            this.requestContext.getResponse().status(500);
        }
        this.requestContext.getResponse().send(apiResponse);
    }

    protected sendResponse(statusCode: number, responseBody?: any, totalCount?: number) {
        const output = this.requestContext.getRequest()[CommonConstants.OUTPUT_NAME];
        if (output && responseBody && output.fields && output.fields !== '*') {
            responseBody = CommonUtils.maskJson(responseBody, output.fields);
        }
        if (output && output.maskSensitiveData) {
            responseBody = MaskUtils.mask(responseBody, output.sensitiveFields);
        }
        const apiResponse: ApiResponse<any> = { success: true, data: responseBody, totalCount: totalCount };
        this.requestContext.getResponse().status(statusCode);
        this.requestContext.getResponse().send(apiResponse);
    }
}
