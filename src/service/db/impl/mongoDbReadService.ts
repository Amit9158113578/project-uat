import { Response } from '../../../types/reponse';
import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ILoggerService } from '../../util/iLoggerService';
import { FindEntityByIdRequest, Query, AggregationRequest, FindAndModifyRequest } from '../../../types/queryRequest';
import { IDatabaseClient } from '../iDatabaseClient';
import { Db, ObjectID, FilterQuery } from 'mongodb';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';
import { QueryTranslator } from './queryTranslator';
import { FieldNames, DBConstants } from '../../../constants/dbConstants';

/**
 * 

 * @description Mongo DB read operations implementation.
 */
@injectable()
export class MongoDbReadService {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbClient)
    private iDatabaseClient: IDatabaseClient;

    /**

     * @description This method will return a collection document which is matching with the provided Collection Doc ID
     * @returns Response<T>
     * @param findEntityByIdRequest {findEntityByIdRequest}
     */
    public async findOneById<T>(findEntityByIdRequest: FindEntityByIdRequest): Promise<Response<T>> {
        const response: Response<T> = { success: false };
        this.iLoggerService.debug('MongoDbReadService::findOneById - Find Entity By ID', findEntityByIdRequest);
        try {
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            let entity = await dbConnection.collection(findEntityByIdRequest.tableName).findOne<T>({
                _id: new ObjectID(findEntityByIdRequest.id)
            });
            response.success = entity ? true : false;
            response.data = entity;
            this.changeFieldName<T>([entity]);
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbReadService::findOneById', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
        }
        return response;
    }

    /**

     * @param findByIdsRequest {findEntityByIdRequest[]}
     */
    public async findManyByIds(findByIdsRequest: FindEntityByIdRequest[]): Promise<Response<Array<any>>> {
        return new Promise<Response<Array<any>>>(async (resolve, reject) => {
            const response: Response<Array<any>> = { success: false, data: [] };
            this.iLoggerService.debug('MongoDbReadService::findManyByIds - Find entities by IDs', findByIdsRequest);
            let promiseArray: Array<Promise<Response<any>>> = [];
            findByIdsRequest.forEach(findEntityByIdRequest => {
                promiseArray.push(this.findOneById(findEntityByIdRequest));
            });
            Promise.all(promiseArray).then(results => {
                results.forEach(result => {
                    response.data.push(result.data);
                });
                response.success = response.data.length > 0 ? true : false;
                resolve(response);
            }).catch(error => {
                this.iLoggerService.error('Error - MongoDbReadService::findManyByIds', error);
                reject(error);
            });
        });
    }

    /**

     * @param query {Query}
     */
    public async findManyByQuery<T>(query: Query): Promise<Response<Array<T>>> {
        this.iLoggerService.debug('MongoDbReadService::findManyByQuery - Start', query);
        let response = await this.executeQuery<T>(query);
        return response;
    }

    /**

     * @param query {Query}
     */
    public async findOneByQuery<T>(query: Query): Promise<Response<T>> {
        const response: Response<T> = { success: false };
        this.iLoggerService.debug('MongoDbReadService::findOneByQuery - Find doc by driteria', query);
        try {
            const filterQuery: FilterQuery<T> = QueryTranslator.convertQueryToNoSqlQuery<T>(query);
            this.iLoggerService.debug('MongoDbReadService::findOneByQuery - Filter query', JSON.stringify(filterQuery));
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            let document = await dbConnection.collection(query.tableName).findOne(filterQuery);
            response.data = document;
            response.success = document ? true : false;
            this.changeFieldName<T>([document]);
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbReadService::findOneByQuery', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
        }
        return response;
    }

    /**

     * Aggregate function
     * @param aggregationRequest {AggregationRequest}
     */
    public async aggregation(aggregationRequest: AggregationRequest): Promise<Response<any>> {
        const response: Response<any> = { success: false };
        this.iLoggerService.debug('MongoDbReadService::aggregation - Aggregate data', aggregationRequest);
        try {
            const filterQuery: FilterQuery<any> = QueryTranslator.convertQueryToNoSqlQuery<any>(aggregationRequest.query);
            this.iLoggerService.debug('MongoDbReadService::aggregation - Filter query', JSON.stringify(filterQuery));
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            const aggregate = [];
            aggregate.push({
                '$match': filterQuery,
            });
            if (aggregationRequest.$count) {
                aggregate.push({
                    '$count': aggregationRequest.$count
                });
            }
            if (aggregationRequest.$group) {
                const expression = {};
                aggregationRequest.$group.fields.forEach(field => {
                    expression[field] = `$${field}`;
                });
                aggregate.push({
                    '$group': {
                        _id: expression,
                        ...aggregationRequest.$group.output,
                    }
                });
            }
            let aggregationResult = await dbConnection.collection(aggregationRequest.query.tableName).aggregate(aggregate).toArray();
            this.iLoggerService.debug('MongoDbReadService::aggregation Result', aggregationResult);
            response.data = aggregationResult;
            response.success = aggregationResult ? true : false;
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbReadService::aggregation', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
        }
        return response;
    }

    /**

     * @param findAndUpdateRequest {FindAndModifyRequest}
     */
    public async findAndModify<T>(findAndUpdateRequest: FindAndModifyRequest): Promise<Response<T>> {
        const response: Response<T> = { success: false };
        this.iLoggerService.debug('MongoDbReadService::findAndModify - Find and modify document', findAndUpdateRequest);
        try {
            const filterQuery: FilterQuery<T> = QueryTranslator.convertQueryToNoSqlQuery<T>(findAndUpdateRequest.query);
            this.iLoggerService.debug('MongoDbReadService::findAndModify - Filter query', JSON.stringify(filterQuery));
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            let document = await dbConnection.collection(findAndUpdateRequest.query.tableName).findOneAndUpdate(filterQuery,
                findAndUpdateRequest.update);
            response.data = document.value;
            response.success = document.value ? true : false;
            this.changeFieldName<T>([document.value]);
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbReadService::findAndModify', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
        }
        return response;
    }

    /**

     * @param query {Query}
     */
    private async executeQuery<T>(query: Query): Promise<Response<Array<T>>> {
        const response: Response<Array<T>> = { success: false };
        this.iLoggerService.debug('MongoDbReadService::executeQuery - Execute query by criteria', query);
        try {
            const filterQuery: FilterQuery<T> = QueryTranslator.convertQueryToNoSqlQuery<T>(query);
            this.iLoggerService.debug('MongoDbReadService::executeQuery - Filter query', filterQuery);
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            const cursor = dbConnection.collection(query.tableName).find(filterQuery);
            if (query.outputProperties) {
                const projection = {};
                for (let index = 0; index < query.outputProperties.length; index++) {
                    const fieldName = query.outputProperties[index];
                    projection[fieldName] = 1;
                }
                cursor.project(projection);
            }
            if (query.order) {
                cursor.sort(query.order);
            }
            const limit = query.limit ? query.limit : DBConstants.DB_QUERY_RESULT_LIMIT;
            cursor.limit(limit);
            if (query.start) {
                cursor.skip(query.start);
            }
            if (query.start === 0) {
                const countResponse = await this.aggregation({
                    $count: 'totalCount',
                    query: query,
                });
                response.totalCount = countResponse.data[0] ? countResponse.data[0].totalCount : 0;
            }
            let documents = await cursor.toArray();
            if (!documents) {
                documents = [];
            }
            response.data = documents;
            response.success = documents.length > 0 ? true : false;
            this.changeFieldName<T>(documents);
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbReadService::executeQuery', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
        }
        return response;
    }

    private changeFieldName<T>(entities: Array<T>) {
        entities.forEach(entity => {
            if (entity) {
                const value = entity['_id'] + '';
                entity[FieldNames.FIELD_ID] = value;
                delete entity['_id'];
            }
        });
    }

}
