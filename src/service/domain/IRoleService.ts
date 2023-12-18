import {  Role } from '../../types/entity';
import { Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description Role Service interface
 */
export interface IRoleService {

   /**
    * @author <Rohit.L>
    * @description gets all roles lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all role's details
    * @throws ServiceException if failed to retrieve roles
    */
   getRoleList(listQueryRequest: ListQueryRequest): Promise<Response<Role[]>>;

   /**
   * @author <Rohit.L>
   * @description API add new role
   * @param role  {Role} - Role object
   * @returns Response <Role>
   * @throws ServiceException if failed to Role
   */
   createRole(createRoleRequest: Role): Promise<Response<Role>>;

   /**
   * @author <Rohit.L>
   * @description gets role  details by id
   * @param roleId {string} - primary key id
   * @returns Response roles details by its id
   * @throws ServiceException if failed to retrieve role details
   */
   getRoleById(roleId: string): Promise<Response<Role>>;

   /**
   * @author <Rohit.L>
   * @description updates roles details
   * @param role  {Role} - to update role information
   * @returns updated role information
   * @throws ServiceException if failed to update role details
   */
   updateRole(updateRoleRequest: Role, roleId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete role details
   * @param id {string} - primary key id
   * @returns delete role information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteRole(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get role by role
    * @param key {string} - role
    * @returns Response <Role>
    * @throws ServiceException if failed to get Role
    */
   getRoleByEmail(name: string): Promise<Response<Role>>;

}
