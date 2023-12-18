import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { Client } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { IClientService } from '../IClientService';

/**
 * @author <Rohit.L>
 * @description Client service implementation
 */
@injectable()
export class ClientService implements IClientService {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;

    /**
     * @author <Rohit.L>
     * @description gets all clients lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all client's details
     * @throws ServiceException if failed to retrieve clients
     */
    public async getClientList(listQueryRequest: ListQueryRequest): Promise<Response<Client[]>> {
        try {
            this.iLoggerService.log('ClientService::getClientList - RuralDestinationsList', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_CLIENTS,
            };
            const response = await this.iDataService.findManyByQuery<Client>(query);
            this.iLoggerService.log('ClientService::getClientList - queryResult', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - ClientService::getClientList - Error while retrieving client list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
     * @author <Rohit L.>
     * @description Get client by client
     * @param email {string} - client
     * @returns Response <Client>
     * @throws ServiceException if failed to get Client
    */
    public async getClientByEmail(email: string): Promise<Response<Client>> {
        const queryClient: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email,
                }
            ],
            tableName: DBConstants.DB_TABLE_CLIENTS,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<Client>(queryClient);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No Client with email '${email}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new client
     * @param client  {Client} - Client object
     * @returns Response <Client>
     * @throws ServiceException if failed to Client
    */
    public async createClient(createClientRequest: Client): Promise<Response<Client>> {
        this.iLoggerService.log('ClientService::createClient - add new client record', createClientRequest);
        const queryClient: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_NAME,
                    op: 'eq',
                    value: createClientRequest.name,
                }
            ],
            tableName: DBConstants.DB_TABLE_CLIENTS,
        };
        const clientResponse = await this.iDataService.findEntityByQuery<Client>(queryClient);
        if (clientResponse.success && clientResponse.data) {
            this.iLoggerService.debug('ClientService::createClient - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<Client> = {
            entity: createClientRequest,
            tableName: DBConstants.DB_TABLE_CLIENTS,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets client  details by id
  * @param clientId {string} - primary email id
  * @returns Response clients details by its id
  * @throws ServiceException if failed to retrieve client details
  */
    public async getClientById(clientId: string): Promise<Response<Client>> {
        try {
            this.iLoggerService.log('ClientService::getClientById - Find client by client id', clientId);
            const findClientById: FindEntityByIdRequest = {
                id: clientId,
                tableName: DBConstants.DB_TABLE_CLIENTS,
            };
            const queryResult = await this.iDataService.findEntityById<Client>(findClientById);
            this.iLoggerService.debug('ClientService::getClientById - Find clients by client id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - ClientService::getClientById - Error while retrieving clients by client id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
  * @author <Rohit.L>
  * @description updates clients details
  * @param client  {Client} - to update client information
  * @returns updated client information
  * @throws ServiceException if failed to update client details
  */
    public async updateClient(updateClientRequest: Client, clientId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: clientId,
                tableName: DBConstants.DB_TABLE_CLIENTS,
                values: updateClientRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - ClientService::updateClient - Error while updating client by client id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete client details
  * @param id {string} - primary email id
  * @returns delete client information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteClient(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_CLIENTS,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - ClientService::deleteClient - Error while deleting client record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }
}
