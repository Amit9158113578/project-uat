import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { Department } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { IDepartmentService } from '../IDepartmentService';

/**
 * @author <Rohit.L>
 * @description Department service implementation
 */
@injectable()
export class DepartmentService implements IDepartmentService {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;

    /**
     * @author <Rohit.L>
     * @description gets all departments lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all department's details
     * @throws ServiceException if failed to retrieve departments
     */
    public async getDepartmentList(listQueryRequest: ListQueryRequest): Promise<Response<Department[]>> {
        try {
            this.iLoggerService.log('DepartmentService::getDepartmentList - RuralDestinationsList', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_DEPARTMENTS,
            };
            const response = await this.iDataService.findManyByQuery<Department>(query);
            this.iLoggerService.log('DepartmentService::getDepartmentList - queryResult', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - DepartmentService::getDepartmentList - Error while retrieving department list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
     * @author <Rohit L.>
     * @description Get department by department
     * @param name {string} - department
     * @returns Response <Department>
     * @throws ServiceException if failed to get Department
    */
    public async getDepartmentByName(name: string): Promise<Response<Department>> {
        const queryDepartment: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_NAME,
                    op: 'eq',
                    value: name,
                }
            ],
            tableName: DBConstants.DB_TABLE_DEPARTMENTS,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<Department>(queryDepartment);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No Department with name '${name}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new department
     * @param department  {Department} - Department object
     * @returns Response <Department>
     * @throws ServiceException if failed to Department
    */
    public async createDepartment(createDepartmentRequest: Department): Promise<Response<Department>> {
        this.iLoggerService.log('DepartmentService::createDepartment - add new department record', createDepartmentRequest);
        const queryDepartment: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_NAME,
                    op: 'eq',
                    value: createDepartmentRequest.name,
                }
            ],
            tableName: DBConstants.DB_TABLE_DEPARTMENTS,
        };
        const departmentResponse = await this.iDataService.findEntityByQuery<Department>(queryDepartment);
        if (departmentResponse.success && departmentResponse.data) {
            this.iLoggerService.debug('DepartmentService::createDepartment - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<Department> = {
            entity: createDepartmentRequest,
            tableName: DBConstants.DB_TABLE_DEPARTMENTS,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets department  details by id
  * @param departmentId {string} - primary email id
  * @returns Response departments details by its id
  * @throws ServiceException if failed to retrieve department details
  */
    public async getDepartmentById(departmentId: string): Promise<Response<Department>> {
        try {
            this.iLoggerService.log('DepartmentService::getDepartmentById - Find department by department id', departmentId);
            const findDepartmentById: FindEntityByIdRequest = {
                id: departmentId,
                tableName: DBConstants.DB_TABLE_DEPARTMENTS,
            };
            const queryResult = await this.iDataService.findEntityById<Department>(findDepartmentById);
            this.iLoggerService.debug('DepartmentService::getDepartmentById - Find departments by department id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - DepartmentService::getDepartmentById - Error while retrieving departments by department id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
  * @author <Rohit.L>
  * @description updates departments details
  * @param department  {Department} - to update department information
  * @returns updated department information
  * @throws ServiceException if failed to update department details
  */
    public async updateDepartment(updateDepartmentRequest: Department, departmentId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: departmentId,
                tableName: DBConstants.DB_TABLE_DEPARTMENTS,
                values: updateDepartmentRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - DepartmentService::updateDepartment - Error while updating department by department id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete department details
  * @param id {string} - primary email id
  * @returns delete department information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteDepartment(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_DEPARTMENTS,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - DepartmentService::deleteDepartment - Error while deleting department record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }
}
