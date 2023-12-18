import {  Category } from '../../types/entity';
import { Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description Category Service interface
 */
export interface ICategoryService {

   /**
    * @author <Rohit.L>
    * @description gets all categorys lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all category's details
    * @throws ServiceException if failed to retrieve categorys
    */
   getCategoryList(listQueryRequest: ListQueryRequest): Promise<Response<Category[]>>;

   /**
   * @author <Rohit.L>
   * @description API add new category
   * @param category  {Category} - Category object
   * @returns Response <Category>
   * @throws ServiceException if failed to Category
   */
   createCategory(createCategoryRequest: Category): Promise<Response<Category>>;

   /**
   * @author <Rohit.L>
   * @description gets category  details by id
   * @param categoryId {string} - primary key id
   * @returns Response categorys details by its id
   * @throws ServiceException if failed to retrieve category details
   */
   getCategoryById(categoryId: string): Promise<Response<Category>>;

   /**
   * @author <Rohit.L>
   * @description updates categorys details
   * @param category  {Category} - to update category information
   * @returns updated category information
   * @throws ServiceException if failed to update category details
   */
   updateCategory(updateCategoryRequest: Category, categoryId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete category details
   * @param id {string} - primary key id
   * @returns delete category information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteCategory(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get category by category
    * @param key {string} - category
    * @returns Response <Category>
    * @throws ServiceException if failed to get Category
    */
   getCategoryByEmail(name: string): Promise<Response<Category>>;

}
