import { IDatabaseClient } from '../iDatabaseClient';
import { MongoClient, Db } from 'mongodb';
import { injectable, inject } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ILoggerService } from '../../util/iLoggerService';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';
import { CommonConstants } from '../../../constants/commonConstants';

/**
 * 

 * @description Mongo DB Client.
 */
@injectable()
export class MongoDbClient implements IDatabaseClient {


    /**
     * Mongo DB Client
     */
    private dbClient: MongoClient;
    /**
     * Mongo DB Client URL. This gets set through enviroment variable DB_URL
     */

    /**
     * Logger service
     */
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;



    /**

     * @description connects to Mongo DB if MongoClient is disconnected or not initilized
     * @returns MongoClient
     * @async
     */
    private async connect(): Promise<MongoClient> {
        if (!this.dbClient || !this.dbClient.isConnected()) {
            this.iLoggerService.debug('MongoDbClient::connect - Connect Mongo DB Client ');
            this.dbClient = new MongoClient(CommonConstants.DBCONFIGURATIONURL, {
                auth: {
                    password: CommonConstants.DBCONFIGURATIONPASSWORD,
                    user: CommonConstants.DBCONFIGURATIONUSERNAME,
                },
                useUnifiedTopology: true, // Pass the useUnifiedTopology option
            });
            await this.dbClient.connect();
            this.iLoggerService.debug('MongoDbClient::connect - Mongo DB Client Connected ');
        }
        return this.dbClient;
    }

    /**

     * @description This method will connet to DB if MongoClient is not connected or initialized and Db object of the provided namespace
     * @param namespace DB namespace name. This parameter is an optional if not provided then
     * DBConstants.DB_NAMESPACE_MTG will be used. e.g medtransgo
     * @throws ServiceException if unable to connect to DB
     * @returns {Db} Mongo Db object
     * @async
     */
    public async getConnection(): Promise<Db> {
        try {
            this.iLoggerService.debug('MongoDbClient::getConnection - Get Mongo DB Connection ');
            let connection = await this.connect();
            return connection.db();
        } catch (error) {
            this.iLoggerService.error('MongoDbClient::getConnection - Error getting DB connection', error);
            throw new ServiceException([error], ErrorCodes.ERR_SERVICE_DB_CONNECTION, 500);
        }
    }

}
