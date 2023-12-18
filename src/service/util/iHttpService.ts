
/**

 * @description HTTP service interface

 */
export interface IHttpService {

    post<T = any>(request: HttpRequest): Promise<HttpResponse<T>>;

    get<T = any>(request: HttpRequest): Promise<HttpResponse<T>>;

    put<T = any>(request: HttpRequest): Promise<HttpResponse<T>>;

    delete<T = any>(request: HttpRequest): Promise<HttpResponse<T>>;
}

export interface HttpRequest {
    baseURL?: string;
    url: string;
    headers?: any;
    params?: any;
    data?: any;
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
    timeout?: number;
    responseType?: 'arraybuffer';
}

export interface HttpResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}
