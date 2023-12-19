"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
const dateUtils_1 = require("../../../util/dateUtils");
/**
 * @author <Rohit.L>
 * @description Project service implementation
 */
let ProjectService = class ProjectService {
    /**
     * @author <Rohit.L>
     * @description gets all projects lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all project's details
     * @throws ServiceException if failed to retrieve projects
     */
    getProjectList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectService::getProjectList - listQueryRequest', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                };
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('ProjectService::getProjectList - queryResult', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectService::getProjectList - Error while retrieving project list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getResourceDetailsList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ResourceProjectDetailsArray = [];
                this.iLoggerService.log('ProjectService::getProjectList - listQueryRequest', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                };
                const projectDetailList = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('ProjectService::getProjectList - queryResult', projectDetailList);
                projectDetailList.data.forEach((project) => __awaiter(this, void 0, void 0, function* () {
                    var projectCost = 0;
                    var projectUtilization = 0;
                    project.resources.forEach((resource) => {
                        projectCost = projectCost + resource.cost;
                        projectUtilization = projectUtilization + resource.utilization;
                    });
                    const resourceProject = {
                        id: project.id,
                        projectName: project.client.name,
                        cost: projectCost,
                        utilization: 0
                    };
                    ResourceProjectDetailsArray.push(resourceProject);
                }));
                return ResourceProjectDetailsArray;
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectService::getProjectList - Error while retrieving project list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getProjectWiseResourceDetailsList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectWiseResourceList = [];
                this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - listQueryRequest', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                };
                const projectDetailList = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - queryResult', projectDetailList);
                for (const project of projectDetailList.data) {
                    const formattedProjectResource = [];
                    for (let index = 0; index < project.resources.length; index++) {
                        const resource = project.resources[index];
                        resource.startDate = dateUtils_1.DateUtils.formatDate(resource.startDate);
                        resource.endDate = dateUtils_1.DateUtils.formatDate(resource.endDate);
                        let resourceDetails;
                        try {
                            resourceDetails = yield this.getResourceById_Matrix(resource.resourceId);
                        }
                        catch (_a) {
                        }
                        resource.resourceName = resourceDetails.data ? resourceDetails.data.fullname : 'NA';
                        formattedProjectResource.push(resource);
                    }
                    const projectWiseResource = {
                        client: project.client.name,
                        resources: formattedProjectResource,
                        title: project.title
                    };
                    projectWiseResourceList.push(projectWiseResource);
                }
                return projectWiseResourceList;
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectService::getProjectWiseResourceDetailsList - Error while retrieving project list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getProjectWiseResourceBillableDetailsList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectWiseResourceList = [];
                this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - listQueryRequest', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                };
                const projectDetailList = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('ProjectService::getProjectWiseResourceDetailsList - queryResult', projectDetailList);
                for (const project of projectDetailList.data) {
                    for (let index = 0; index < project.resources.length; index++) {
                        const resource = project.resources[index];
                        const startDate = new Date(resource.startDate); // Convert millis to Date object
                        const endDate = new Date(resource.endDate); // Convert millis to Date object
                        let resourceDetails;
                        try {
                            resourceDetails = yield this.getResourceById_Matrix(resource.resourceId);
                        }
                        catch (_a) {
                            // Handle error
                        }
                        const resourceName = resourceDetails.data ? resourceDetails.data.fullname : 'NA';
                        const bu = resourceDetails.data ? resourceDetails.data.department : 'NA';
                        const billableDetailsData = [];
                        while (startDate <= endDate) {
                            const label = dateUtils_1.DateUtils.getMMMYYYY(startDate);
                            const billable = resource.utilization;
                            billableDetailsData.push({ label, billable });
                            startDate.setMonth(startDate.getMonth() + 1);
                        }
                        const projectWiseResource = {
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
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectService::getProjectWiseResourceDetailsList - Error while retrieving project list', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
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
    getResourceDetailsListById(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ResourceProjectDetailsByIDArray = [];
                this.iLoggerService.log('ProjectService::getResourceDetailsListById - ', resourceId);
                const listQueryRequest = {
                    conditions: [],
                };
                const projectList = yield this.getProjectList(listQueryRequest);
                this.iLoggerService.log('ProjectService::getResourceDetailsListById getProjectList - ', projectList.data);
                var resourceNamedetails = yield this.getResourceById_Matrix(resourceId);
                var resourceName = resourceNamedetails.data.fullname;
                this.iLoggerService.log('ProjectService::this.iresourceService.getResourceById_Matrix - ', resourceId);
                (yield projectList).data.forEach((project) => __awaiter(this, void 0, void 0, function* () {
                    (yield project.resources).forEach((resource) => __awaiter(this, void 0, void 0, function* () {
                        if (resourceId == resource.resourceId) {
                            const projectDetail = {
                                projectName: project.client.name,
                                cost: resource.cost,
                                utilization: resource.utilization,
                                startDate: project.startDate,
                                endDate: project.endDate,
                                actualStartDate: project.actualStartDate,
                                actualEndDate: project.actualEndDate,
                            };
                            ResourceProjectDetailsByIDArray.push(projectDetail);
                            this.iLoggerService.log('ProjectService::projectDetail - ', projectDetail);
                        }
                    }));
                }));
                const responseResourceDetails = {
                    resourceName: resourceName,
                    resourceProjectDetails: ResourceProjectDetailsByIDArray
                };
                this.iLoggerService.log('ProjectService::getResourceDetailsListById data length : ', ResourceProjectDetailsByIDArray.length);
                return responseResourceDetails;
            }
            catch (error) {
                this.iLoggerService.log('Error - ProjectService::getResourceDetailsListById - Error while retrieving details ' + error.toString());
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    getResourceById_Matrix(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceService::getResourceById - Find resource by resource id', resourceId);
                const findResourceById = {
                    id: resourceId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
                };
                const queryResult = yield this.iDataService.findEntityById(findResourceById);
                this.iLoggerService.debug('ResourceService::getResourceById - Find resources by resource id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - ResourceService::getResourceById - Error while retrieving resources by resource id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
     * @author <Rohit L.>
     * @description Get project by project
     * @param email {string} - project
     * @returns Response <Project>
     * @throws ServiceException if failed to get Project
    */
    getProjectByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryProject = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryProject);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No Project with email '${email}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new project
     * @param project  {Project} - Project object
     * @returns Response <Project>
     * @throws ServiceException if failed to Project
    */
    createProject(createProjectRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('ProjectService::createProject - add new project record', createProjectRequest);
            const queryProject = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_TITLE,
                        op: 'eq',
                        value: createProjectRequest.title,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
            };
            const projectResponse = yield this.iDataService.findEntityByQuery(queryProject);
            if (projectResponse.success && projectResponse.data) {
                this.iLoggerService.debug('ProjectService::createProject - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createProjectRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets project  details by id
  * @param projectId {string} - primary email id
  * @returns Response projects details by its id
  * @throws ServiceException if failed to retrieve project details
  */
    getProjectById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectService::getProjectById - Find project by project id', projectId);
                const findProjectById = {
                    id: projectId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                };
                const queryResult = yield this.iDataService.findEntityById(findProjectById);
                this.iLoggerService.debug('ProjectService::getProjectById - Find projects by project id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - ProjectService::getProjectById - Error while retrieving projects by project id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
  * @author <Rohit.L>
  * @description updates projects details
  * @param project  {Project} - to update project information
  * @returns updated project information
  * @throws ServiceException if failed to update project details
  */
    updateProject(updateProjectRequest, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: projectId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                    values: updateProjectRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - ProjectService::updateProject - Error while updating project by project id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete project details
  * @param id {string} - primary email id
  * @returns delete project information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_PROJECTS,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectService::deleteProject - Error while deleting project record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
   * @author <Rohit.L>
   * @description gets Dashboard Data
   * @param req {Request} - Express Request -
   * @param res {Response} - Express Response - Dashboard details
   * @returns  DashboardResponse object is returned
   */
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pendingProspectData = [];
                const upcomingMilestones = [];
                const projectHealthData = [];
                const activeProjectData = [];
                const completedProjectData = [];
                const upcomingDeliverableData = [];
                const currentDate = new Date();
                const dashboardDataResponse = {
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
                const listQueryRequest = {
                    conditions: [],
                };
                const response = yield this.getProjectList(listQueryRequest);
                response.data.forEach((project) => __awaiter(this, void 0, void 0, function* () {
                    if (project.state && project.state == 'approved') {
                        const activeProjects = {
                            client: project.client.name,
                            cost: project.cost,
                            project: project.title,
                            startDate: project.startDate,
                            endDate: project.endDate,
                            actualStartDate: project.actualStartDate,
                            actualEndDate: project.actualEndDate,
                            id: project.id,
                        };
                        activeProjectData.push(activeProjects);
                        const greenDeliveriable = [];
                        const amberDeliveriable = [];
                        const redDeliveriable = [];
                        dashboardDataResponse.activeProject += 1;
                        dashboardDataResponse.activeCost += project.cost;
                        if (project.milestones && project.milestones.length > 0) {
                            project.milestones.forEach((milestone) => __awaiter(this, void 0, void 0, function* () {
                                if (typeof milestone.targetDate === 'string') {
                                    const targetDate = new Date(milestone.targetDate);
                                    if (targetDate.getTime() > currentDate.getTime()) {
                                        const upcomingMilestone = {
                                            client: project.client.name,
                                            cost: project.cost,
                                            date: milestone.targetDate,
                                            name: milestone.name,
                                            project: project.title,
                                            progress: milestone.progress,
                                            id: project.id,
                                        };
                                        upcomingMilestones.push(upcomingMilestone);
                                    }
                                }
                                else {
                                    console.log('Invalid targetDate:', milestone.targetDate);
                                }
                                if (milestone.deliverables && milestone.deliverables.length > 0) {
                                    milestone.deliverables.forEach((milestoneDeliverable) => __awaiter(this, void 0, void 0, function* () {
                                        const id = milestoneDeliverable;
                                        if (id) {
                                            const deliObj = project.deliverables.filter((projectDeliverable) => projectDeliverable.id == id);
                                            if (deliObj[0].status != 'INACTIVE') {
                                                if (typeof deliObj[0].deliveryDate === 'string') {
                                                    const deliveryDateFormatted = new Date(deliObj[0].deliveryDate);
                                                    const deliveryDate = deliveryDateFormatted.getTime();
                                                    const currentDateInMillis = currentDate.getTime();
                                                    const difference_In_Time = deliveryDate - currentDateInMillis;
                                                    if (deliveryDate > currentDateInMillis) {
                                                        const upcomingDeliverable = {
                                                            client: project.client.name,
                                                            project: project.title,
                                                            name: deliObj[0].name,
                                                            status: deliObj[0].status,
                                                            deliveryDate: deliObj[0].deliveryDate,
                                                            startDate: deliObj[0].startDate,
                                                            endDate: deliObj[0].endDate,
                                                            progress: deliObj[0].progress,
                                                            id: project.id,
                                                        };
                                                        upcomingDeliverableData.push(upcomingDeliverable);
                                                        greenDeliveriable.push(deliObj);
                                                    }
                                                    else if (difference_In_Time < 15) {
                                                        amberDeliveriable.push(deliObj);
                                                    }
                                                    else {
                                                        redDeliveriable.push(deliObj);
                                                    }
                                                }
                                                else {
                                                    console.log('Invalid deliveryDate:', deliObj[0].deliveryDate);
                                                }
                                            }
                                        }
                                    }));
                                }
                            }));
                        }
                        if (redDeliveriable && redDeliveriable.length > 0) {
                            project.status = 'RED';
                        }
                        else if (amberDeliveriable && amberDeliveriable.length > 0) {
                            project.status = 'AMBER';
                        }
                        else {
                            project.status = 'GREEN';
                        }
                        const projectHealth = {
                            client: project.client.name,
                            endDate: project.endDate,
                            project: project.title,
                            startDate: project.startDate,
                            status: project.status,
                            actualStartDate: project.actualStartDate,
                            actualEndDate: project.actualEndDate,
                            id: project.id,
                        };
                        projectHealthData.push(projectHealth);
                    }
                    else if (project.state && project.state != 'completed') {
                        dashboardDataResponse.prospect += 1;
                        dashboardDataResponse.pipelineProspectCost += project.cost;
                        const pendingProspect = {
                            client: project.client.name,
                            cost: project.cost,
                            project: project.title,
                            startDate: project.startDate,
                            endDate: project.endDate,
                            proposalDate: project.proposedDate,
                            id: project.id,
                        };
                        pendingProspectData.push(pendingProspect);
                    }
                    else if (project.state && project.state == 'completed') {
                        dashboardDataResponse.completed += 1;
                        dashboardDataResponse.completedProjectCost += project.cost;
                        const completedProjects = {
                            client: project.client.name,
                            cost: project.cost,
                            project: project.title,
                            startDate: project.startDate,
                            endDate: project.endDate,
                            actualStartDate: project.actualStartDate,
                            actualEndDate: project.actualEndDate,
                            id: project.id,
                        };
                        completedProjectData.push(completedProjects);
                    }
                }));
                return dashboardDataResponse;
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectService::deleteProject - Error while deleting project record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ProjectService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], ProjectService.prototype, "iDataService", void 0);
ProjectService = __decorate([
    (0, inversify_1.injectable)()
], ProjectService);
exports.ProjectService = ProjectService;
