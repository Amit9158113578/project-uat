import { Request, Response } from 'express';
import { injectable } from 'inversify';
import * as httpContext from 'express-http-context';
import { SessionInfo } from '../types/sessionInfo';
import { CommonConstants } from '../constants/commonConstants';

/**

 * @description HTTP request context

 */
@injectable()
export class RequestContext {


    public setHeaders(headers: { [header: string]: string | string[] }): void {
        return httpContext.set('headers', headers);
    }

    public getHeaders(): { [header: string]: string | string[] } {
        return httpContext.get('headers');
    }

    public setRequest(request: Request) {
        return httpContext.set('request', request);
    }

    public setResponse(response: Response) {
        return httpContext.set('response', response);
    }

    public getResponse(): Response {
        return httpContext.get('response');
    }

    public getRequest(): Request {
        return httpContext.get('request');
    }

    public getSessionInfo(): SessionInfo {
        return httpContext.get('request')[CommonConstants.SESSION_INFO_NAME];
    }
}
