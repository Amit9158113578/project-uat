import { IDatabaseService } from '../iDatabaseService';
import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { MongoDbReadService } from './mongoDbReadService';
import {
    PersistEntityRequest, UpdateEntityRequest, DeleteEntityRequest,
    FindEntityByIdRequest, Query, FindAndModifyRequest, AggregationRequest
} from '../../../types/queryRequest';
import { MongoDbWriteService } from './mongoDbWriteService';
import { Response } from '../../../types/reponse';
import { ILoggerService } from '../../util/iLoggerService';

/**
 * 

 * @description Mongo DB implementation of IDatabaseService.
 */
@injectable()
export class MongoDbService implements IDatabaseService {

    @inject(BaseIdentifiers.MongoReadService)
    private mongoDbReadService: MongoDbReadService;

    @inject(BaseIdentifiers.MongoWriteService)
    private mongoDbWriteService: MongoDbWriteService;

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;


    public async persistEntity<T>(persistEntityRequest: PersistEntityRequest<T>): Promise<Response<T>> {
        const result = await this.mongoDbWriteService.persistEntity(persistEntityRequest);
        return result;
    }

    public async updateEntity(updateEntityRequest: UpdateEntityRequest): Promise<Response<Number>> {
        const result = await this.mongoDbWriteService.updateEntity(updateEntityRequest);
        return result;
    }

    public async deleteEntityById<T>(deleteEntityRequest: DeleteEntityRequest): Promise<Response<T>> {
        const result = await this.mongoDbWriteService.deleteEntityById<T>(deleteEntityRequest);
        return result;
    }

    public async findEntityById<T>(findEntityById: FindEntityByIdRequest): Promise<Response<T>> {
        const result = await this.mongoDbReadService.findOneById<T>(findEntityById);
        this.iLoggerService.debug('MongoDbReadService::findEntityById - Result', result);
        return result;
    }

    public async findEntityByQuery<T>(query: Query): Promise<Response<T>> {
        this.iLoggerService.debug('MongoDbReadService::findEntityByQuery - query', query);
        const result = await this.mongoDbReadService.findOneByQuery<T>(query);
        this.iLoggerService.debug('MongoDbReadService::findEntityByQuery - Result', result);
        return result;
    }

    public async findManyByQuery<T>(query: Query): Promise<Response<Array<T>>> {
        const result = await this.mongoDbReadService.findManyByQuery<T>(query);
        return result;
    }


    /**

     * @async Async method
     * @param findAndUpdateRequest {FindAndModifyRequest} - FindAndModifyRequest object
     * @description finds & modify request
     * @throws ServiceException if error ocurred while querying an entity
     * @returns {T} entity
     */
    public async findAndModify<T>(findAndUpdateRequest: FindAndModifyRequest): Promise<Response<T>> {
        const result = await this.mongoDbReadService.findAndModify<T>(findAndUpdateRequest);
        return result;
    }

    /**

     * @async Async method get aggregation
     * @param aggregationRequest {AggregationRequest} - FindAndModifyRequest object
     * @description get aggregation by query
     * @throws ServiceException if error ocurred while querying aggregation
     * @returns {T} entity
     */
    public async aggregation(aggregationRequest: AggregationRequest): Promise<Response<any[]>> {
        const result = await this.mongoDbReadService.aggregation(aggregationRequest);
        return result;
    }

}
