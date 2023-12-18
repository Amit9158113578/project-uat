import { IMapService } from '../iMapService';
import { GetDistanceRequest } from '../../../types/request';
import { GetDistanceResponse } from '../../../types/reponse';

import { Client } from '@googlemaps/google-maps-services-js';
import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ILoggerService } from '../iLoggerService';
import { AppVariables } from '../../../config/appVariables';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';

/**

 * @description Google Map service implementation

 */
@injectable()
export class GoogleMapService implements IMapService {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.AppVariables)
    private appVariables: AppVariables;


    /**

     * @description gets distance between origin and destination
     * @param getDistanceRequest {GetDistanceRequest} - GetDistanceRequest object
     * @returns GetDistanceResponse
     * @throws ServiceException if failed to get distance
     */
    public async getDistance(getDistanceRequest: GetDistanceRequest): Promise<GetDistanceResponse[]> {
        try {
            this.iLoggerService.debug('GoogleMapService:getDistance- Request to find distance', JSON.stringify(getDistanceRequest));
            const googleClient = this.getGoogleClient();
            const response: GetDistanceResponse[] = [];
            const distanceResponse = await googleClient.distancematrix({
                params: {
                    destinations: getDistanceRequest.destinations,
                    key: this.appVariables.googleConfiguration.apiKey,
                    origins: getDistanceRequest.origins,
                    units: 'imperial' as any,
                }
            });
            if (distanceResponse.data.status === 'OK') {
                distanceResponse.data.rows.forEach(row => {
                    row.elements.forEach(result => {
                        response.push(result);
                    });
                });
            } else {
                throw new ServiceException([], ErrorCodes.ERR_GOOGLE_FAILED_FIND_DISTANCE, 500);
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    private getGoogleClient(): Client {
        const client = new Client({});
        return client;
    }

}
