import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { JobTitle } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { IJobTitleService } from '../IJobTitleService';

/**
 * @author <Rohit.L>
 * @description JobTitle service implementation
 */
@injectable()
export class JobTitleService implements IJobTitleService {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;

    /**
     * @author <Rohit.L>
     * @description gets all jobTitles lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all jobTitle's details
     * @throws ServiceException if failed to retrieve jobTitles
     */
    public async getJobTitleList(listQueryRequest: ListQueryRequest): Promise<Response<JobTitle[]>> {
        try {
            this.iLoggerService.log('JobTitleService::getJobTitleList - RuralDestinationsList', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_JOBTITLES,
            };
            const response = await this.iDataService.findManyByQuery<JobTitle>(query);
            this.iLoggerService.log('JobTitleService::getJobTitleList - queryResult', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - JobTitleService::getJobTitleList - Error while retrieving jobTitle list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
     * @author <Rohit L.>
     * @description Get jobTitle by jobTitle
     * @param email {string} - jobTitle
     * @returns Response <JobTitle>
     * @throws ServiceException if failed to get JobTitle
    */
    public async getJobTitleByEmail(email: string): Promise<Response<JobTitle>> {
        const queryJobTitle: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email,
                }
            ],
            tableName: DBConstants.DB_TABLE_JOBTITLES,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<JobTitle>(queryJobTitle);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No JobTitle with email '${email}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new jobTitle
     * @param jobTitle  {JobTitle} - JobTitle object
     * @returns Response <JobTitle>
     * @throws ServiceException if failed to JobTitle
    */
    public async createJobTitle(createJobTitleRequest: JobTitle): Promise<Response<JobTitle>> {
        this.iLoggerService.log('JobTitleService::createJobTitle - add new jobTitle record', createJobTitleRequest);
        const queryJobTitle: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_NAME,
                    op: 'eq',
                    value: createJobTitleRequest.name,
                }
            ],
            tableName: DBConstants.DB_TABLE_JOBTITLES,
        };
        const jobTitleResponse = await this.iDataService.findEntityByQuery<JobTitle>(queryJobTitle);
        if (jobTitleResponse.success && jobTitleResponse.data) {
            this.iLoggerService.debug('JobTitleService::createJobTitle - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<JobTitle> = {
            entity: createJobTitleRequest,
            tableName: DBConstants.DB_TABLE_JOBTITLES,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets jobTitle  details by id
  * @param jobTitleId {string} - primary email id
  * @returns Response jobTitles details by its id
  * @throws ServiceException if failed to retrieve jobTitle details
  */
    public async getJobTitleById(jobTitleId: string): Promise<Response<JobTitle>> {
        try {
            this.iLoggerService.log('JobTitleService::getJobTitleById - Find jobTitle by jobTitle id', jobTitleId);
            const findJobTitleById: FindEntityByIdRequest = {
                id: jobTitleId,
                tableName: DBConstants.DB_TABLE_JOBTITLES,
            };
            const queryResult = await this.iDataService.findEntityById<JobTitle>(findJobTitleById);
            this.iLoggerService.debug('JobTitleService::getJobTitleById - Find jobTitles by jobTitle id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - JobTitleService::getJobTitleById - Error while retrieving jobTitles by jobTitle id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
  * @author <Rohit.L>
  * @description updates jobTitles details
  * @param jobTitle  {JobTitle} - to update jobTitle information
  * @returns updated jobTitle information
  * @throws ServiceException if failed to update jobTitle details
  */
    public async updateJobTitle(updateJobTitleRequest: JobTitle, jobTitleId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: jobTitleId,
                tableName: DBConstants.DB_TABLE_JOBTITLES,
                values: updateJobTitleRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - JobTitleService::updateJobTitle - Error while updating jobTitle by jobTitle id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete jobTitle details
  * @param id {string} - primary email id
  * @returns delete jobTitle information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteJobTitle(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_JOBTITLES,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - JobTitleService::deleteJobTitle - Error while deleting jobTitle record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }
}
