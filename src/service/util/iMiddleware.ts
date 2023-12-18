import { Request, Response, NextFunction } from 'express';

/**

 * @description Middleware interface

 */
export interface IMiddleware {
    (req: Request, res: Response, next: NextFunction): void;
}
