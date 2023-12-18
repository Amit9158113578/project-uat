import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { PendingProspect, Project, ProjectHealth, UpcomingMilestone, ActiveProjects, UpcomingDeliverablesData, ResourceProjectDetails, ProjectResourceUtilazation, ResourceDetails, ResourceProjectDetailsInfo, CompletedProject, ProjectWiseResource, ProjectResource, ProjectWiseResourceBillable, BillableDetails } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { DashboardDataResponse, Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { IProjectService } from '../IProjectService';
import { DateUtils } from '../../../util/dateUtils';

/**
 * @author <Rohit.L>
 * @description Project service implementation
 */
@injectable()
export class ProjectService implements IProjectService {

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;


    /**
     * @author <Rohit.L>
     * @description gets all projects lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all project's details
     * @throws ServiceException if failed to retrieve projects
     */
    public async getProjectList(listQueryRequest: ListQueryRequest): Promise<Response<Project[]>> {
        try {
            this.iLoggerService.log('ProjectService::getProjectList - listQueryRequest', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_PROJECTS,
            };
            const response = await this.iDataService.findManyByQuery<Project>(query);
            this.iLoggerService.log('ProjectService::getProjectList - queryResult', response);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - ProjectService::getProjectList - Error while retrieving project list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getResourceDetailsList(listQueryRequest: ListQueryRequest): Promise<ResourceProjectDetails[]> {
        try {

            const ResourceProjectDetailsArray: ResourceProjectDetails[] = [];
            this.iLoggerService.log('ProjectService::getProjectList - listQueryRequest', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_PROJECTS,
            };
            const projectDetailList = await this.iDataService.findManyByQuery<Project>(query);
            this.iLoggerService.log('ProjectService::getProjectList - queryResult', projectDetailList);
            projectDetailList.data.forEach(async (project) => {
                var projectCost = 0;
                var projectUtilization = 0;
                project.resources.forEach((resource) => {
                    projectCost = projectCost + resource.cost;
                    projectUtilization = projectUtilization + resource.utilization;
                });
                const resourceProject: ResourceProjectDetails = {
                    id: project.id,
                    projectName: project.client.name,
                    cost: projectCost,
                    utilization: 0
                }
                ResourceProjectDetailsArray.push(resourceProject);

            });

            return ResourceProjectDetailsArray;
        } catch (error) {
            this.iLoggerService.error('Error - ProjectService::getProjectList - Error while retrieving project list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getProjectWiseResourceDetailsList(listQueryRequest: ListQueryRequest): Promise<ProjectWiseResource[]> {
        try {
            const projectWiseResourceList: ProjectWiseResource[] = [];
            this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - listQueryRequest', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_PROJECTS,
            };
            const projectDetailList = await this.iDataService.findManyByQuery<Project>(query);
            this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - queryResult', projectDetailList);

            for (const project of projectDetailList.data) {
                const formattedProjectResource: ProjectResource[] = [];
                for (let index = 0; index < project.resources.length; index++) {
                    const resource = project.resources[index];
                    resource.startDate = DateUtils.formatDate(resource.startDate) as any;
                    resource.endDate = DateUtils.formatDate(resource.endDate) as any;
                    let resourceDetails: any;
                    try {
                        resourceDetails = await this.getResourceById_Matrix(resource.resourceId);
                    } catch {
                    }
                    resource.resourceName = resourceDetails.data ? resourceDetails.data.fullname : 'NA';
                    formattedProjectResource.push(resource);
                }
                const projectWiseResource: ProjectWiseResource = {
                    client: project.client.name,
                    resources: formattedProjectResource,
                    title: project.title
                }
                projectWiseResourceList.push(projectWiseResource);
            }
            return projectWiseResourceList;
        } catch (error) {
            this.iLoggerService.error('Error - ProjectService::getProjectWiseResourceDetailsList - Error while retrieving project list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getProjectWiseResourceBillableDetailsList(listQueryRequest: ListQueryRequest): Promise<ProjectWiseResourceBillable[]> {
        try {
            const projectWiseResourceList: ProjectWiseResourceBillable[] = [];
            this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - listQueryRequest', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_PROJECTS,
            };
            const projectDetailList = await this.iDataService.findManyByQuery<Project>(query);
            this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - queryResult', projectDetailList);

            for (const project of projectDetailList.data) {
                for (let index = 0; index < project.resources.length; index++) {
                    const resource = project.resources[index];
                    const startDate = new Date(resource.startDate); // Convert millis to Date object
                    const endDate = new Date(resource.endDate); // Convert millis to Date object

                    let resourceDetails: any;
                    try {
                        resourceDetails = await this.getResourceById_Matrix(resource.resourceId);
                    } catch {
                        // Handle error
                    }

                    const resourceName = resourceDetails.data ? resourceDetails.data.fullname : 'NA';
                    const bu = resourceDetails.data ? resourceDetails.data.department : 'NA';

                    const billableDetailsData: BillableDetails[] = [];

                    while (startDate <= endDate) {
                        const label = DateUtils.getMMMYYYY(startDate);
                        const billable = resource.utilization;

                        billableDetailsData.push({ label, billable });

                        startDate.setMonth(startDate.getMonth() + 1);
                    }

                    const projectWiseResource: ProjectWiseResourceBillable = {
                        client: project.client.name,
                        title: project.title,
                        resourceName,
                        bu,
                        billableDetails: billableDetailsData,
                    };

                    projectWiseResourceList.push(projectWiseResource);
                }
            }

            return projectWiseResourceList;
        } catch (error) {
            this.iLoggerService.error('Error - ProjectService::getProjectWiseResourceDetailsList - Error while retrieving project list', error);
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }




    // public async getMngResourceList(listQueryRequest: ListQueryRequest): Promise<ResourceMng[]> {
    //     try {
    //         this.iLoggerService.log('ResourceService::getResourceList - RuralDestinationsList', listQueryRequest);
    //         const query: Query = {
    //             conditions: listQueryRequest.conditions,
    //             limit: listQueryRequest.limit,
    //             order: listQueryRequest.order,
    //             start: listQueryRequest.start,
    //             tableName: DBConstants.DB_TABLE_RESOURCES,
    //         };
    //         this.iLoggerService.log('ResourceService::getResourceList Query Value : ', query);
    //         const response = await this.iDataService.findManyByQuery<ResourceMng>(query);
    //         this.iLoggerService.log('ResourceService::getResourceList - queryResult', response.data);
    //         return response;
    //     } catch (error) {
    //         this.iLoggerService.error('Error - ResourceService::getResourceList - Error while retrieving resource list');
    //         throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
    //     }
    // }


    public async getResourceDetailsListById(resourceId: string): Promise<ResourceProjectDetailsInfo> {
        try {
            const ResourceProjectDetailsByIDArray: ProjectResourceUtilazation[] = [];
            this.iLoggerService.log('ProjectService::getResourceDetailsListById - ', resourceId);
            const listQueryRequest: ListQueryRequest = {
                conditions: [],
            };
            const projectList = await this.getProjectList(listQueryRequest);
            this.iLoggerService.log('ProjectService::getResourceDetailsListById getProjectList - ', projectList.data);
            var resourceNamedetails = await this.getResourceById_Matrix(resourceId);

            var resourceName = resourceNamedetails.data.fullname;
            this.iLoggerService.log('ProjectService::this.iresourceService.getResourceById_Matrix - ', resourceId);
            (await projectList).data.forEach(async (project) => {
                (await project.resources).forEach(async (resource) => {
                    if (resourceId == resource.resourceId) {
                        const projectDetail: ProjectResourceUtilazation = {
                            projectName: project.client.name,
                            cost: resource.cost,
                            utilization: resource.utilization,
                            startDate: project.startDate,
                            endDate: project.endDate,
                            actualStartDate: project.actualStartDate,
                            actualEndDate: project.actualEndDate,
                        }
                        ResourceProjectDetailsByIDArray.push(projectDetail);
                        this.iLoggerService.log('ProjectService::projectDetail - ', projectDetail);
                    }
                })
            });

            const responseResourceDetails: ResourceProjectDetailsInfo = {
                resourceName: resourceName,
                resourceProjectDetails: ResourceProjectDetailsByIDArray
            }
            this.iLoggerService.log('ProjectService::getResourceDetailsListById data length : ', ResourceProjectDetailsByIDArray.length);
            return responseResourceDetails;
        } catch (error) {
            this.iLoggerService.log('Error - ProjectService::getResourceDetailsListById - Error while retrieving details ' + error.toString());
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    public async getResourceById_Matrix(resourceId: string): Promise<Response<ResourceDetails>> {
        try {
            this.iLoggerService.log('ResourceService::getResourceById - Find resource by resource id', resourceId);
            const findResourceById: FindEntityByIdRequest = {
                id: resourceId,
                tableName: DBConstants.DB_TABLE_RESOURCES,
            };
            const queryResult = await this.iDataService.findEntityById<ResourceDetails>(findResourceById);
            this.iLoggerService.debug('ResourceService::getResourceById - Find resources by resource id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - ResourceService::getResourceById - Error while retrieving resources by resource id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
     * @author <Rohit L.>
     * @description Get project by project
     * @param email {string} - project
     * @returns Response <Project>
     * @throws ServiceException if failed to get Project
    */
    public async getProjectByEmail(email: string): Promise<Response<Project>> {
        const queryProject: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email,
                }
            ],
            tableName: DBConstants.DB_TABLE_PROJECTS,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<Project>(queryProject);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No Project with email '${email}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new project
     * @param project  {Project} - Project object
     * @returns Response <Project>
     * @throws ServiceException if failed to Project
    */
    public async createProject(createProjectRequest: Project): Promise<Response<Project>> {
        this.iLoggerService.log('ProjectService::createProject - add new project record', createProjectRequest);
        const queryProject: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_TITLE,
                    op: 'eq',
                    value: createProjectRequest.title,
                }
            ],
            tableName: DBConstants.DB_TABLE_PROJECTS,
        };
        const projectResponse = await this.iDataService.findEntityByQuery<Project>(queryProject);
        if (projectResponse.success && projectResponse.data) {
            this.iLoggerService.debug('ProjectService::createProject - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<Project> = {
            entity: createProjectRequest,
            tableName: DBConstants.DB_TABLE_PROJECTS,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets project  details by id
  * @param projectId {string} - primary email id
  * @returns Response projects details by its id
  * @throws ServiceException if failed to retrieve project details
  */
    public async getProjectById(projectId: string): Promise<Response<Project>> {
        try {
            this.iLoggerService.log('ProjectService::getProjectById - Find project by project id', projectId);
            const findProjectById: FindEntityByIdRequest = {
                id: projectId,
                tableName: DBConstants.DB_TABLE_PROJECTS,
            };
            const queryResult = await this.iDataService.findEntityById<Project>(findProjectById);
            this.iLoggerService.debug('ProjectService::getProjectById - Find projects by project id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - ProjectService::getProjectById - Error while retrieving projects by project id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }

    /**
  * @author <Rohit.L>
  * @description updates projects details
  * @param project  {Project} - to update project information
  * @returns updated project information
  * @throws ServiceException if failed to update project details
  */
    public async updateProject(updateProjectRequest: Project, projectId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: projectId,
                tableName: DBConstants.DB_TABLE_PROJECTS,
                values: updateProjectRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - ProjectService::updateProject - Error while updating project by project id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete project details
  * @param id {string} - primary email id
  * @returns delete project information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteProject(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_PROJECTS,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - ProjectService::deleteProject - Error while deleting project record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }


    /**
   * @author <Rohit.L>
   * @description gets Dashboard Data
   * @param req {Request} - Express Request - 
   * @param res {Response} - Express Response - Dashboard details
   * @returns  DashboardResponse object is returned
   */
    public async getDashboardData(): Promise<DashboardDataResponse> {
        try {
            const pendingProspectData: PendingProspect[] = [];
            const upcomingMilestones: UpcomingMilestone[] = [];
            const projectHealthData: ProjectHealth[] = [];
            const activeProjectData: ActiveProjects[] = [];
            const completedProjectData: CompletedProject[] = [];
            const upcomingDeliverableData: UpcomingDeliverablesData[] = [];
            const currentDate = new Date();

            const dashboardDataResponse: DashboardDataResponse = {
                activeProject: 0,
                activeProjectData: activeProjectData,
                upcomingDeliverableData: upcomingDeliverableData,
                prospect: 0,
                completed: 0,
                completedProjectCost: 0,
                pipelineProspectCost: 0,
                activeCost: 0,
                pendingProspectData,
                completedProjectData,
                upcomingMilestonesData: upcomingMilestones,
                projectHealthData,
            };
            const listQueryRequest: ListQueryRequest = {
                conditions: [],
            };
            const response = await this.getProjectList(listQueryRequest);
            response.data.forEach(async (project) => {
                if (project.state && project.state == 'approved') {
                    const activeProjects: ActiveProjects = {
                        client: project.client.name,
                        cost: project.cost,
                        project: project.title,
                        startDate: project.startDate,
                        endDate: project.endDate,
                        actualStartDate: project.actualStartDate,
                        actualEndDate: project.actualEndDate,
                        id: project.id,
                    }
                    activeProjectData.push(activeProjects);
                    const greenDeliveriable = [];
                    const amberDeliveriable = [];
                    const redDeliveriable = [];
                    dashboardDataResponse.activeProject += 1;
                    dashboardDataResponse.activeCost += project.cost;
                    if (project.milestones && project.milestones.length > 0) {
                        project.milestones.forEach(async (milestone) => {
                            if (typeof milestone.targetDate === 'string') {
                                const targetDate = new Date(milestone.targetDate);
                                if (targetDate.getTime() > currentDate.getTime()) {

                                    const upcomingMilestone: UpcomingMilestone = {
                                        client: project.client.name,
                                        cost: project.cost,
                                        date: milestone.targetDate as any,
                                        name: milestone.name,
                                        project: project.title,
                                        progress: milestone.progress,
                                        id: project.id,
                                    }
                                    upcomingMilestones.push(upcomingMilestone);
                                }
                            } else {
                                console.log('Invalid targetDate:', milestone.targetDate);
                            }
                            if (milestone.deliverables && milestone.deliverables.length > 0) {
                                milestone.deliverables.forEach(async (milestoneDeliverable) => {
                                    const id = milestoneDeliverable as any;
                                    if (id) {
                                        const deliObj = project.deliverables.filter((projectDeliverable) => projectDeliverable.id == id);

                                        if (deliObj[0].status != 'INACTIVE') {
                                            if (typeof deliObj[0].deliveryDate === 'string') {
                                                const deliveryDateFormatted = new Date(deliObj[0].deliveryDate);
                                                const deliveryDate = deliveryDateFormatted.getTime();
                                                const currentDateInMillis = currentDate.getTime();
                                                const difference_In_Time = deliveryDate - currentDateInMillis;
                                                if (deliveryDate > currentDateInMillis) {
                                                    const upcomingDeliverable: UpcomingDeliverablesData = {
                                                        client: project.client.name,
                                                        project: project.title,
                                                        name: deliObj[0].name,
                                                        status: deliObj[0].status,
                                                        deliveryDate: deliObj[0].deliveryDate,
                                                        startDate: deliObj[0].startDate,
                                                        endDate: deliObj[0].endDate,
                                                        progress: deliObj[0].progress,
                                                        id: project.id,
                                                    }
                                                    upcomingDeliverableData.push(upcomingDeliverable);
                                                    greenDeliveriable.push(deliObj);
                                                } else if (difference_In_Time < 15) {
                                                    amberDeliveriable.push(deliObj);
                                                } else {
                                                    redDeliveriable.push(deliObj);
                                                }
                                            } else {
                                                console.log('Invalid deliveryDate:', deliObj[0].deliveryDate);
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                    if (redDeliveriable && redDeliveriable.length > 0) {
                        project.status = 'RED'
                    } else if (amberDeliveriable && amberDeliveriable.length > 0) {
                        project.status = 'AMBER'
                    } else {
                        project.status = 'GREEN'
                    }
                    const projectHealth: ProjectHealth = {
                        client: project.client.name,
                        endDate: project.endDate as any,
                        project: project.title,
                        startDate: project.startDate as any,
                        status: project.status,
                        actualStartDate: project.actualStartDate,
                        actualEndDate: project.actualEndDate,
                        id: project.id,
                    }
                    projectHealthData.push(projectHealth);
                } else if (project.state && project.state != 'completed') {
                    dashboardDataResponse.prospect += 1;
                    dashboardDataResponse.pipelineProspectCost += project.cost;

                    const pendingProspect: PendingProspect = {
                        client: project.client.name,
                        cost: project.cost,
                        project: project.title,
                        startDate: project.startDate as any,
                        endDate: project.endDate as any,
                        proposalDate: project.proposedDate,
                        id: project.id,
                    }
                    pendingProspectData.push(pendingProspect);
                } else if (project.state && project.state == 'completed') {
                    dashboardDataResponse.completed += 1;
                    dashboardDataResponse.completedProjectCost += project.cost;
                    const completedProjects: CompletedProject = {
                        client: project.client.name,
                        cost: project.cost,
                        project: project.title,
                        startDate: project.startDate as any,
                        endDate: project.endDate as any,
                        actualStartDate: project.actualStartDate,
                        actualEndDate: project.actualEndDate,
                        id: project.id,
                    }
                    completedProjectData.push(completedProjects);
                }

            });
            return dashboardDataResponse;
        } catch (error) {
            this.iLoggerService.error('Error - ProjectService::deleteProject - Error while deleting project record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

}
