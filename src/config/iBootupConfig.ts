import { IMiddleware } from '../service/util/iMiddleware';

/**

 * @description Bootup parameters

 */
export interface IBootupConfig {

    controllers?: symbol[];

    port?: number;

    staticPaths?: string[];

    middlewares?: IMiddleware[];

    publicRoutes?: string[];

    allowedOrigins?: string[];

    allowedMethods?: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
}
