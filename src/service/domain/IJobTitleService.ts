import {  JobTitle } from '../../types/entity';
import { Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description JobTitle Service interface
 */
export interface IJobTitleService {

   /**
    * @author <Rohit.L>
    * @description gets all jobTitles lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all jobTitle's details
    * @throws ServiceException if failed to retrieve jobTitles
    */
   getJobTitleList(listQueryRequest: ListQueryRequest): Promise<Response<JobTitle[]>>;

   /**
   * @author <Rohit.L>
   * @description API add new jobTitle
   * @param jobTitle  {JobTitle} - JobTitle object
   * @returns Response <JobTitle>
   * @throws ServiceException if failed to JobTitle
   */
   createJobTitle(createJobTitleRequest: JobTitle): Promise<Response<JobTitle>>;

   /**
   * @author <Rohit.L>
   * @description gets jobTitle  details by id
   * @param jobTitleId {string} - primary key id
   * @returns Response jobTitles details by its id
   * @throws ServiceException if failed to retrieve jobTitle details
   */
   getJobTitleById(jobTitleId: string): Promise<Response<JobTitle>>;

   /**
   * @author <Rohit.L>
   * @description updates jobTitles details
   * @param jobTitle  {JobTitle} - to update jobTitle information
   * @returns updated jobTitle information
   * @throws ServiceException if failed to update jobTitle details
   */
   updateJobTitle(updateJobTitleRequest: JobTitle, jobTitleId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete jobTitle details
   * @param id {string} - primary key id
   * @returns delete jobTitle information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteJobTitle(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get jobTitle by jobTitle
    * @param key {string} - jobTitle
    * @returns Response <JobTitle>
    * @throws ServiceException if failed to get JobTitle
    */
   getJobTitleByEmail(name: string): Promise<Response<JobTitle>>;

}
