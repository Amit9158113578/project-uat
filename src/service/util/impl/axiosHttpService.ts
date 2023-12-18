import { HttpRequest, HttpResponse, IHttpService } from '../iHttpService';
import axios from 'axios';
import { injectable } from 'inversify';


/**

 * @description Axios HTTP service implementation

 */
@injectable()
export class AxiosHttpService implements IHttpService {
    public async post<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        request.method = 'POST';
        return this.executeHttpCall<T>(request);
    }

    public async get<T = any>(request: HttpRequest): Promise<HttpResponse<T>> {
        request.method = 'GET';
        return this.executeHttpCall<T>(request);
    }

    public async put<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        request.method = 'PUT';
        return this.executeHttpCall<T>(request);
    }

    public async delete<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        request.method = 'DELETE';
        return this.executeHttpCall<T>(request);
    }

    private async executeHttpCall<T = any>(request: HttpRequest) {
        const response = await axios.request<T>(request);
        return response;
    }
}
