import { injectable, inject } from 'inversify';
import { PersistEntityRequest, UpdateEntityRequest, DeleteEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ILoggerService } from '../../util/iLoggerService';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { IDatabaseClient } from '../iDatabaseClient';
import { Db, FilterQuery, ObjectID } from 'mongodb';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';
import { FieldNames } from '../../../constants/dbConstants';
import { MongoDbReadService } from './mongoDbReadService';
import { DateUtils } from '../../../util/dateUtils';
import { RequestContext } from '../../../config/requestContext';


/**
 * 

 * @description Mongo DB write service.
 */

@injectable()
export class MongoDbWriteService {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbClient)
    private iDatabaseClient: IDatabaseClient;

    @inject(BaseIdentifiers.MongoReadService)
    private mongoDbReadService: MongoDbReadService;

    @inject(BaseIdentifiers.RequestContext)
    private requestContext: RequestContext;


    public async persistEntity<T>(persistEntityRequest: PersistEntityRequest<T>): Promise<Response<T>> {
        const response: Response<T> = { success: false };
        this.iLoggerService.debug('MongoDbWriteService::persistEntity - Persist entity', persistEntityRequest);
        const sessionInfo = this.requestContext.getSessionInfo();
        try {
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            persistEntityRequest.entity[FieldNames.FIELD_CREATED_ON] = DateUtils.getCurrentTimeInMillis();
            persistEntityRequest.entity[FieldNames.FIELD_LAST_MODIFIED_ON] = DateUtils.getCurrentTimeInMillis();
            persistEntityRequest.entity[FieldNames.FIELD_CREATED_BY] = sessionInfo.userId;
            persistEntityRequest.entity[FieldNames.FIELD_LAST_MODIFIED_BY] = sessionInfo.userId;
            let persistResult = await dbConnection.collection(persistEntityRequest.tableName).insertOne(persistEntityRequest.entity);
            if (persistResult.insertedId && persistResult.insertedCount > 0) {
                response.success = true;
                persistEntityRequest.entity[FieldNames.FIELD_ID] = persistResult.insertedId + '';
                response.data = persistEntityRequest.entity;
            } else {
                throw 'Failed to persist document';
            }
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbWriteService::persistEntity', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_WRITE_EXCEPTION, 500);
        }
        return response;
    }

    public async updateEntity(updateEntityRequest: UpdateEntityRequest): Promise<Response<Number>> {
        const response: Response<Number> = { success: false };
        this.iLoggerService.debug('MongoDbWriteService::updateEntity - Update entity', updateEntityRequest);
        const sessionInfo = this.requestContext.getSessionInfo();
        try {
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            let loggedInUserId;
            updateEntityRequest.values[FieldNames.FIELD_LAST_MODIFIED_ON] = DateUtils.getCurrentTimeInMillis();
            if (updateEntityRequest.tableName == 'users') {
                loggedInUserId = updateEntityRequest.id;
            } else{
                loggedInUserId = sessionInfo.userId;
            }
            updateEntityRequest.values[FieldNames.FIELD_LAST_MODIFIED_BY] = loggedInUserId;
            const idQuery: FilterQuery<any> = { _id: new ObjectID(updateEntityRequest.id) };
            let updateResult = await dbConnection.collection(updateEntityRequest.tableName)
                .updateOne(idQuery, { $set: updateEntityRequest.values });
            if (updateResult.result.nModified && updateResult.result.nModified > 0) {
                response.success = true;
                response.data = updateResult.result.nModified;
            } else {
                throw 'Failed to update document';
            }
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbWriteService::persistEntity', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_WRITE_EXCEPTION, 500);
        }
        return response;
    }

    public async deleteEntityById<T>(deleteEntityRequest: DeleteEntityRequest): Promise<Response<T>> {
        const response: Response<T> = { success: false };
        this.iLoggerService.debug('MongoDbWriteService::deleteEntityById - Delete entity', deleteEntityRequest);
        try {
            let dbConnection: Db = await this.iDatabaseClient.getConnection();
            let entity = await this.mongoDbReadService.findOneById<T>({
                id: deleteEntityRequest.id,
                tableName: deleteEntityRequest.tableName
            });
            const idQuery: FilterQuery<any> = { _id: new ObjectID(deleteEntityRequest.id) };
            let deleteResult = await dbConnection.collection(deleteEntityRequest.tableName).deleteOne(idQuery);
            if (deleteResult.result.ok === 1) {
                response.success = true;
                response.data = entity.data;
            }
        } catch (error) {
            this.iLoggerService.error('Error - MongoDbWriteService::deleteEntityById', error);
            throw new ServiceException([error], ErrorCodes.ERR_DB_WRITE_EXCEPTION, 500);
        }
        return response;
    }
}

