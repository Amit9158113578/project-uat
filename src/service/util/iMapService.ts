import { GetDistanceResponse } from '../../types/reponse';
import { GetDistanceRequest } from '../../types/request';

/**

 * @description Map service interface

 */
export interface IMapService {

    /**

     * @description gets distance between origin and destination
     * @param getDistanceRequest {GetDistanceRequest} - GetDistanceRequest object
     * @returns GetDistanceResponse array
     * @throws ServiceException if failed to get distance
     */
    getDistance(getDistanceRequest: GetDistanceRequest): Promise<GetDistanceResponse[]>;

}
