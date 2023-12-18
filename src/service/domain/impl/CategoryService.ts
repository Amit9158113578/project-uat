import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { Category } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { ICategoryService } from '../ICategoryService';

/**
 * @author <Rohit.L>
 * @description Category service implementation
 */
@injectable()
export class CategoryService implements ICategoryService {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;

    /**
     * @author <Rohit.L>
     * @description gets all categorys lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all category's details
     * @throws ServiceException if failed to retrieve categorys
     */
    public async getCategoryList(listQueryRequest: ListQueryRequest): Promise<Response<Category[]>> {
        try {
            this.iLoggerService.log('CategoryService::getCategoryList - RuralDestinationsList', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_CATEGORY,
            };
            const response = await this.iDataService.findManyByQuery<Category>(query);
            this.iLoggerService.log('CategoryService::getCategoryList - queryResult', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - CategoryService::getCategoryList - Error while retrieving category list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
     * @author <Rohit L.>
     * @description Get category by category
     * @param email {string} - category
     * @returns Response <Category>
     * @throws ServiceException if failed to get Category
    */
    public async getCategoryByEmail(email: string): Promise<Response<Category>> {
        const queryCategory: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email,
                }
            ],
            tableName: DBConstants.DB_TABLE_CATEGORY,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<Category>(queryCategory);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No Category with email '${email}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new category
     * @param category  {Category} - Category object
     * @returns Response <Category>
     * @throws ServiceException if failed to Category
    */
    public async createCategory(createCategoryRequest: Category): Promise<Response<Category>> {
        this.iLoggerService.log('CategoryService::createCategory - add new category record', createCategoryRequest);
        const queryCategory: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_NAME,
                    op: 'eq',
                    value: createCategoryRequest.name,
                }
            ],
            tableName: DBConstants.DB_TABLE_CATEGORY,
        };
        const categoryResponse = await this.iDataService.findEntityByQuery<Category>(queryCategory);
        if (categoryResponse.success && categoryResponse.data) {
            this.iLoggerService.debug('CategoryService::createCategory - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<Category> = {
            entity: createCategoryRequest,
            tableName: DBConstants.DB_TABLE_CATEGORY,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets category  details by id
  * @param categoryId {string} - primary email id
  * @returns Response categorys details by its id
  * @throws ServiceException if failed to retrieve category details
  */
    public async getCategoryById(categoryId: string): Promise<Response<Category>> {
        try {
            this.iLoggerService.log('CategoryService::getCategoryById - Find category by category id', categoryId);
            const findCategoryById: FindEntityByIdRequest = {
                id: categoryId,
                tableName: DBConstants.DB_TABLE_CATEGORY,
            };
            const queryResult = await this.iDataService.findEntityById<Category>(findCategoryById);
            this.iLoggerService.debug('CategoryService::getCategoryById - Find categorys by category id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - CategoryService::getCategoryById - Error while retrieving categorys by category id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
  * @author <Rohit.L>
  * @description updates categorys details
  * @param category  {Category} - to update category information
  * @returns updated category information
  * @throws ServiceException if failed to update category details
  */
    public async updateCategory(updateCategoryRequest: Category, categoryId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: categoryId,
                tableName: DBConstants.DB_TABLE_CATEGORY,
                values: updateCategoryRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - CategoryService::updateCategory - Error while updating category by category id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete category details
  * @param id {string} - primary email id
  * @returns delete category information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteCategory(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_CATEGORY,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - CategoryService::deleteCategory - Error while deleting category record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }
}
