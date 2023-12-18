import { BilliableResourcesData, BuDetails, Resource, ResourceDetails,ResourceMng,ResponseMatrixData } from '../../types/entity';
import { Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description Resource Service interface
 */
export interface IResourceService {

   /**
    * @author <Rohit.L>
    * @description gets all resources lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all resource's details
    * @throws ServiceException if failed to retrieve resources
    */
   getResourceList(listQueryRequest: ListQueryRequest): Promise<Response<Resource[]>>;

   getResourcesMatrixList(listQueryRequest: ListQueryRequest): Promise<ResponseMatrixData>;

   getBilliableResources(listQueryRequest: ListQueryRequest): Promise<BilliableResourcesData[]>;

   getResourceById_Matrix(resourceId: string): Promise<Response<ResourceDetails>>

   getBenchResourcesList(listQueryRequest: ListQueryRequest): Promise<Resource[]>

   getResourcesByDepartment(listQueryRequest: ListQueryRequest): Promise<BuDetails[]>
   
   getMngResourceList(listQueryRequest: ListQueryRequest): Promise<ResourceMng[]>

   /**
   * @author <Rohit.L>
   * @description API add new resource
   * @param resource  {Resource} - Resource object
   * @returns Response <Resource>
   * @throws ServiceException if failed to Resource
   */
   createResource(createResourceRequest: Resource): Promise<Response<Resource>>;

   /**
   * @author <Rohit.L>
   * @description gets resource  details by id
   * @param resourceId {string} - primary key id
   * @returns Response resources details by its id
   * @throws ServiceException if failed to retrieve resource details
   */
   getResourceById(resourceId: string): Promise<Response<Resource>>;

   /**
   * @author <Rohit.L>
   * @description updates resources details
   * @param resource  {Resource} - to update resource information
   * @returns updated resource information
   * @throws ServiceException if failed to update resource details
   */
   updateResource(updateResourceRequest: Resource, resourceId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete resource details
   * @param id {string} - primary key id
   * @returns delete resource information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteResource(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get resource by resource
    * @param key {string} - resource
    * @returns Response <Resource>
    * @throws ServiceException if failed to get Resource
    */
   getResourceByEmail(name: string): Promise<Response<Resource>>;

}
