import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { Role } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { IRoleService } from '../IRoleService';

/**
 * @author <Rohit.L>
 * @description Role service implementation
 */
@injectable()
export class RoleService implements IRoleService {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;

    /**
     * @author <Rohit.L>
     * @description gets all roles lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all role's details
     * @throws ServiceException if failed to retrieve roles
     */
    public async getRoleList(listQueryRequest: ListQueryRequest): Promise<Response<Role[]>> {
        try {
            this.iLoggerService.log('RoleService::getRoleList - RuralDestinationsList', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_ROLES,
            };
            const response = await this.iDataService.findManyByQuery<Role>(query);
            this.iLoggerService.log('RoleService::getRoleList - queryResult', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - RoleService::getRoleList - Error while retrieving role list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
     * @author <Rohit L.>
     * @description Get role by role
     * @param email {string} - role
     * @returns Response <Role>
     * @throws ServiceException if failed to get Role
    */
    public async getRoleByEmail(email: string): Promise<Response<Role>> {
        const queryRole: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email,
                }
            ],
            tableName: DBConstants.DB_TABLE_ROLES,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<Role>(queryRole);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No Role with email '${email}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new role
     * @param role  {Role} - Role object
     * @returns Response <Role>
     * @throws ServiceException if failed to Role
    */
    public async createRole(createRoleRequest: Role): Promise<Response<Role>> {
        this.iLoggerService.log('RoleService::createRole - add new role record', createRoleRequest);
        const queryRole: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_NAME,
                    op: 'eq',
                    value: createRoleRequest.name,
                }
            ],
            tableName: DBConstants.DB_TABLE_ROLES,
        };
        const roleResponse = await this.iDataService.findEntityByQuery<Role>(queryRole);
        if (roleResponse.success && roleResponse.data) {
            this.iLoggerService.debug('RoleService::createRole - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<Role> = {
            entity: createRoleRequest,
            tableName: DBConstants.DB_TABLE_ROLES,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets role  details by id
  * @param roleId {string} - primary email id
  * @returns Response roles details by its id
  * @throws ServiceException if failed to retrieve role details
  */
    public async getRoleById(roleId: string): Promise<Response<Role>> {
        try {
            this.iLoggerService.log('RoleService::getRoleById - Find role by role id', roleId);
            const findRoleById: FindEntityByIdRequest = {
                id: roleId,
                tableName: DBConstants.DB_TABLE_ROLES,
            };
            const queryResult = await this.iDataService.findEntityById<Role>(findRoleById);
            this.iLoggerService.debug('RoleService::getRoleById - Find roles by role id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - RoleService::getRoleById - Error while retrieving roles by role id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
  * @author <Rohit.L>
  * @description updates roles details
  * @param role  {Role} - to update role information
  * @returns updated role information
  * @throws ServiceException if failed to update role details
  */
    public async updateRole(updateRoleRequest: Role, roleId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: roleId,
                tableName: DBConstants.DB_TABLE_ROLES,
                values: updateRoleRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - RoleService::updateRole - Error while updating role by role id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete role details
  * @param id {string} - primary email id
  * @returns delete role information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteRole(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_ROLES,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - RoleService::deleteRole - Error while deleting role record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }
}
