import {  Project, ProjectWiseResource, ProjectWiseResourceBillable, ResourceDetails, ResourceProjectDetails, ResourceProjectDetailsInfo } from '../../types/entity';
import { DashboardDataResponse, Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description Project Service interface
 */
export interface IProjectService {

   /**
    * @author <Rohit.L>
    * @description gets all projects lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all project's details
    * @throws ServiceException if failed to retrieve projects
    */
   getProjectList(listQueryRequest: ListQueryRequest): Promise<Response<Project[]>>;

   getResourceDetailsList(listQueryRequest: ListQueryRequest): Promise<ResourceProjectDetails[]>;
   
   getResourceDetailsListById(resourceId: string): Promise<ResourceProjectDetailsInfo>;

   getResourceById_Matrix(resourceId: string): Promise<Response<ResourceDetails>>
   
   /**
   * @author <Rohit.L>
   * @description API add new project
   * @param project  {Project} - Project object
   * @returns Response <Project>
   * @throws ServiceException if failed to Project
   */
   createProject(createProjectRequest: Project): Promise<Response<Project>>;

   /**
   * @author <Rohit.L>
   * @description gets project  details by id
   * @param projectId {string} - primary key id
   * @returns Response projects details by its id
   * @throws ServiceException if failed to retrieve project details
   */
   getProjectById(projectId: string): Promise<Response<Project>>;

   /**
   * @author <Rohit.L>
   * @description updates projects details
   * @param project  {Project} - to update project information
   * @returns updated project information
   * @throws ServiceException if failed to update project details
   */
   updateProject(updateProjectRequest: Project, projectId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete project details
   * @param id {string} - primary key id
   * @returns delete project information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteProject(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get project by project
    * @param key {string} - project
    * @returns Response <Project>
    * @throws ServiceException if failed to get Project
    */
   getProjectByEmail(name: string): Promise<Response<Project>>;

   /**
    * @author <Rohit.L>
    * @description gets Dashboard Data
    * @param req {Request} - Express Request - 
    * @param res {Response} - Express Response - Dashboard details
    * @returns  DashboardResponse object is returned
    */
   getDashboardData(): Promise<DashboardDataResponse>;

   getProjectWiseResourceDetailsList(listQueryRequest: ListQueryRequest): Promise<ProjectWiseResource[]> ;

   getProjectWiseResourceBillableDetailsList(listQueryRequest: ListQueryRequest): Promise<ProjectWiseResourceBillable[]>;

}
