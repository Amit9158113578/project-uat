import {  Department } from '../../types/entity';
import { Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description Department Service interface
 */
export interface IDepartmentService {

   /**
    * @author <Rohit.L>
    * @description gets all departments lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all department's details
    * @throws ServiceException if failed to retrieve departments
    */
   getDepartmentList(listQueryRequest: ListQueryRequest): Promise<Response<Department[]>>;

   /**
   * @author <Rohit.L>
   * @description API add new department
   * @param department  {Department} - Department object
   * @returns Response <Department>
   * @throws ServiceException if failed to Department
   */
   createDepartment(createDepartmentRequest: Department): Promise<Response<Department>>;

   /**
   * @author <Rohit.L>
   * @description gets department  details by id
   * @param departmentId {string} - primary key id
   * @returns Response departments details by its id
   * @throws ServiceException if failed to retrieve department details
   */
   getDepartmentById(departmentId: string): Promise<Response<Department>>;

   /**
   * @author <Rohit.L>
   * @description updates departments details
   * @param department  {Department} - to update department information
   * @returns updated department information
   * @throws ServiceException if failed to update department details
   */
   updateDepartment(updateDepartmentRequest: Department, departmentId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete department details
   * @param id {string} - primary key id
   * @returns delete department information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteDepartment(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get department by department
    * @param key {string} - department
    * @returns Response <Department>
    * @throws ServiceException if failed to get Department
    */
   getDepartmentByName(name: string): Promise<Response<Department>>;

}
