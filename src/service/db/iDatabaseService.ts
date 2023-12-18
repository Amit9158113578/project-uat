import { Response } from '../../types/reponse';
import {
    Query, UpdateEntityRequest, PersistEntityRequest,
    FindEntityByIdRequest, DeleteEntityRequest, FindAndModifyRequest, AggregationRequest
} from '../../types/queryRequest';

/**
 * 

 * @description Interface for database operations.
 */
export interface IDatabaseService {

    /**

     * @async Async method
     * @param persistEntityRequest {PersistEntityRequest} - PersistEntityRequest object
     * @description persists an entity into Database
     * @example iDatabaseService.persistEntity<User>({tableName: 'User', entity: {firstName: 'Test', lastName: 'Test'}})
     * @throws ServiceException if error ocurred while persisting the entity
     * @returns {PersistEntityResponse} persistEntityResponse
     */
    persistEntity<T>(persistEntityRequest: PersistEntityRequest<T>): Promise<Response<T>>;

    /**

     * @async Async method
     * @param updateEntityRequest {UpdateEntityRequest} - UpdateEntityRequest object
     * @description updates an entity
     * @returns no of rows updated
     * @throws ServiceException if error ocurred while updating the entity
     * @returns {UpdateEntityRequest} updateEntityRequest
     */
    updateEntity(updateEntityRequest: UpdateEntityRequest): Promise<Response<Number>>;

    /**

     * @async Async method
     * @param deleteEntityRequest {DeleteEntityRequest} - DeleteEntityRequest object
     * @description deletes entity by ID
     * @throws ServiceException if error ocurred while deleting an entity
     * @returns {T} deleted entity
     */
    deleteEntityById<T>(deleteEntityRequest: DeleteEntityRequest): Promise<Response<T>>;

    /**

     * @async Async method
     * @param findEntityById {FindEntityByIdRequest} - FindEntityByIdRequest object
     * @description finds entity by ID
     * @throws ServiceException if error ocurred while querying an entity
     * @returns {T} entity
     */
    findEntityById<T>(findEntityById: FindEntityByIdRequest): Promise<Response<T>>;

    /**

     * @async Async method
     * @param query {Query} - Query object
     * @description finds an entity by query
     * @throws ServiceException if error ocurred while querying an entity
     * @returns {T} entity. response.success = true if result data found
     */
    findEntityByQuery<T>(query: Query): Promise<Response<T>>;

    /**

     * @async Async method
     * @param query {Query} - Query object
     * @description finds entities by query
     * @throws ServiceException if error ocurred while querying an entity
     * @returns {T[]} entities
     */
    findManyByQuery<T>(query: Query): Promise<Response<Array<T>>>;

    /**

     * @async Async method
     * @param findAndUpdateRequest {FindAndModifyRequest} - FindAndModifyRequest object
     * @description finds & modify request
     * @throws ServiceException if error ocurred while querying an entity
     * @returns {T} entity
     */
    findAndModify<T>(findAndUpdateRequest: FindAndModifyRequest): Promise<Response<T>>;

    /**

     * @async Async method get aggregation
     * @param aggregationRequest {AggregationRequest} - FindAndModifyRequest object
     * @description get aggregation by query
     * @throws ServiceException if error ocurred while querying aggregation
     * @returns {T} entity
     */
    aggregation(aggregationRequest: AggregationRequest): Promise<Response<any[]>>;

}
