import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILoggerService } from '../service/util/iLoggerService';
import { BaseIdentifiers } from '../config/baseIdentifiers';
import { RequestContext } from '../config/requestContext';

/**

 * @description HTTP Request Context Midleware

 */
@injectable()
export class RequestContextMiddleware {


    public constructor(@inject(BaseIdentifiers.LoggerService) private iLoggerService: ILoggerService,
        @inject(BaseIdentifiers.RequestContext) private requestContext: RequestContext) {
    }

    public invoke = async (req: Request, res: Response, next: NextFunction) => {
        this.iLoggerService.debug('RequestContextMiddleware :: invoke');
        this.requestContext.setHeaders(req.headers);
        this.requestContext.setRequest(req);
        this.requestContext.setResponse(res);
        next();
    }
}
