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
exports.ResourceService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
/**
 * @author <Rohit.L>
 * @description Resource service implementation
 */
let ResourceService = class ResourceService {
    /**
     * @author <Rohit.L>
     * @description gets all resources lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all resource's details
     * @throws ServiceException if failed to retrieve resources
     */
    getResourceList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceService::getResourceList - RuralDestinationsList', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
                };
                this.iLoggerService.log('ResourceService::getResourceList Query Value : ', query);
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('ResourceService::getResourceList - queryResult', response.data);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceService::getResourceList - Error while retrieving resource list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getResourcesMatrixList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceService::getResourcesMatrixList - ', listQueryRequest);
                const totalResourceResponse = yield this.getResourceList(listQueryRequest);
                const projectDetailList = yield this.iProjectService.getProjectList(listQueryRequest);
                var toalResourceCount = totalResourceResponse.data.length;
                var totalBilliable = 0;
                projectDetailList.data.forEach((project) => __awaiter(this, void 0, void 0, function* () {
                    project.resources.forEach((resource) => __awaiter(this, void 0, void 0, function* () {
                        totalBilliable = totalBilliable + resource.utilization;
                    }));
                }));
                var toalReosourceOnBentch = toalResourceCount - totalBilliable;
                const responseMatrix = {
                    totalResources: totalResourceResponse.data.length,
                    resourcesBilliable: totalBilliable,
                    resourcesOnBentch: toalReosourceOnBentch
                };
                this.iLoggerService.log('ResourceService::getResourceList - queryResult', "Error ");
                return responseMatrix;
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceService::getResourceList - Error while retrieving resource list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getBilliableResources(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const billiableDetailMap = new Map();
                const responseMatrixArray = [];
                // this.iLoggerService.log('ResourceService::getBilliableResources - ', listQueryRequest);
                const projectDetailList = yield this.iProjectService.getProjectList(listQueryRequest);
                projectDetailList.data.forEach((project) => __awaiter(this, void 0, void 0, function* () {
                    project.resources.forEach((resource) => __awaiter(this, void 0, void 0, function* () {
                        if (billiableDetailMap.has(resource.resourceId)) {
                            var billDetails = billiableDetailMap.get(resource.resourceId);
                            const updatedCost = billDetails.cost + resource.cost;
                            const updatedUtilization = billDetails.utilization + resource.utilization;
                            const resourceDetails = {
                                cost: updatedCost,
                                utilization: updatedUtilization,
                            };
                            billiableDetailMap.set(resource.resourceId, resourceDetails);
                            this.iLoggerService.log('if Billiable details of every resource- ', resourceDetails.cost + " along with utilization : " + resourceDetails.utilization);
                        }
                        else {
                            const updatedCost = resource.cost;
                            const updatedUtilization = resource.utilization;
                            const resourceDetails = {
                                cost: updatedCost,
                                utilization: updatedUtilization,
                            };
                            billiableDetailMap.set(resource.resourceId, resourceDetails);
                            this.iLoggerService.log('else Billiable details of every resource- ', resourceDetails.cost + " along with utilization : " + resourceDetails.utilization);
                        }
                    }));
                }));
                this.iLoggerService.log('ResourceService::billiableDetailMap  length : ', billiableDetailMap.size);
                const mapEntries = Array.from(billiableDetailMap.entries());
                for (let i = 0; i < mapEntries.length; i++) {
                    const [key, value] = mapEntries[i];
                    var resourceD = yield this.getResourceById_Matrix(key);
                    const responseMatrix = {
                        resourceId: key,
                        resourceName: resourceD.data.fullname,
                        cost: value.cost,
                        utilization: value.utilization
                    };
                    responseMatrixArray.push(responseMatrix);
                    this.iLoggerService.log('inside for loop with Key : ', key + " and values : " + value.cost + " and utilization : " + value.utilization);
                }
                this.iLoggerService.log('ResourceService::getBilliableResources data length : ', responseMatrixArray.length);
                return responseMatrixArray;
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceService::getBilliableResources - Error while retrieving billiable resource :');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getResourcesByDepartment(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.getResourceList(listQueryRequest);
                const departmentMap = {};
                const getResourceDetails = (resource) => __awaiter(this, void 0, void 0, function* () {
                    if (resource.department) {
                        if (!departmentMap[resource.department]) {
                            departmentMap[resource.department] = {
                                designation: '',
                                department: resource.department,
                                buHead: '',
                                resourceDetails: [],
                            };
                        }
                        const resourceDetailsResponse = yield this.getResourceById_Matrix(resource.id);
                        const resourceDetails = resourceDetailsResponse.data;
                        const resourceDetail = {
                            employeeCode: resourceDetails.employeeCode,
                            fullname: resourceDetails.fullname,
                            email: resourceDetails.email,
                            department: resourceDetails.department || '',
                            jobTitle: resourceDetails.jobTitle,
                            joiningDate: new Date(resourceDetails.joiningDate),
                            costPerDay: resourceDetails.costPerDay,
                            status: resourceDetails.status,
                            createdDate: new Date(resourceDetails.createdDate),
                            modifiedDate: new Date(resourceDetails.modifiedDate),
                            createdBy: resourceDetails.createdBy,
                            modifiedBy: resourceDetails.modifiedBy,
                            id: resourceDetails.id,
                            resourceProjectDetails: [],
                        };
                        // const projectList = (await this.iProjectService.getProjectList(listQueryRequest)).data.filter();
                        const approvedProjects = (yield this.iProjectService.getProjectList(listQueryRequest)).data.filter((project) => project.state === 'approved' || project.state === 'completed');
                        const projectResourcePromises = approvedProjects.map((project) => __awaiter(this, void 0, void 0, function* () {
                            const projectResources = yield project.resources;
                            const matchingProjectResources = projectResources.filter(pr => pr.resourceId === resourceDetail.id);
                            matchingProjectResources.forEach(projectResource => {
                                if (projectResource) {
                                    const projectDetail = {
                                        projectTitle: project.title,
                                        projectName: project.client.name,
                                        cost: projectResource.cost,
                                        utilization: projectResource.utilization,
                                        startDate: projectResource.startDate,
                                        endDate: projectResource.endDate,
                                        actualStartDate: project.actualStartDate,
                                        actualEndDate: project.actualEndDate,
                                    };
                                    resourceDetail.resourceProjectDetails.push(projectDetail);
                                }
                            });
                        }));
                        yield Promise.all(projectResourcePromises);
                        if (resource.jobTitle === 'BU Head') {
                            departmentMap[resource.department].designation = 'BU Head';
                            departmentMap[resource.department].buHead = resource.fullname;
                        }
                        departmentMap[resource.department].resourceDetails.push(resourceDetail);
                    }
                });
                yield Promise.all(responseData.data.map(getResourceDetails));
                const benchDetails = Object.values(departmentMap);
                return benchDetails;
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceService::getResourcesByDepartment - Error while retrieving Resources By Department:', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getMngResourceList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeResourceData = yield this.getResourceList(listQueryRequest);
                // const completeProjectData = await this.iProjectService.getProjectList(listQueryRequest);
                const completeProjectData = (yield this.iProjectService.getProjectList(listQueryRequest)).data.filter((project) => project.state === 'approved' || project.state === 'completed');
                const projectsByResourceId = new Map();
                completeProjectData.forEach(project => {
                    project.resources.forEach(resource => {
                        const projectDetail = {
                            projectName: project.title,
                            client: project.client.name,
                            cost: resource.cost,
                            utilization: resource.utilization,
                            startDate: resource.startDate,
                            endDate: resource.endDate,
                            actualStartDate: project.actualStartDate,
                            actualEndDate: project.actualEndDate,
                        };
                        if (!projectsByResourceId.has(resource.resourceId)) {
                            projectsByResourceId.set(resource.resourceId, []);
                        }
                        projectsByResourceId.get(resource.resourceId).push(projectDetail);
                    });
                });
                const resourceMngList = completeResourceData.data.map(resource => {
                    const resourceMng = {
                        employeeCode: resource.employeeCode,
                        fullname: resource.fullname,
                        email: resource.email,
                        status: resource.status,
                        jobTitle: resource.jobTitle,
                        joiningDate: new Date(resource.joiningDate),
                        costPerDay: resource.costPerDay,
                        createdDate: new Date(resource.createdDate),
                        modifiedDate: new Date(resource.modifiedDate),
                        createdBy: resource.createdBy,
                        modifiedBy: resource.modifiedBy,
                        department: resource.department,
                        id: resource.id,
                        resourcesdetails: projectsByResourceId.get(resource.id) || [],
                    };
                    return resourceMng;
                });
                return resourceMngList;
            }
            catch (error) {
                this.iLoggerService.error('Error - Your error message here', error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    getBenchResourcesList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let benchDetails = [];
                let listQueryRequest = {};
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                var responseMatrix = yield this.getBilliableResources(listQueryRequest);
                this.iLoggerService.log('ResourceService::BenchResourcesDataList - queryResult', responseMatrix);
                // console.log('responseMatrix', responseMatrix);
                var resourceDetailsList = yield this.getResourceList(listQueryRequest);
                this.iLoggerService.debug('ResourceService::getResourceById - resourceDetailsList', resourceDetailsList);
                // console.log('resourceDetailsList', resourceDetailsList.data);
                benchDetails = yield resourceDetailsList.data.filter((item1) => !responseMatrix.some((item2) => item2.resourceId === item1.id));
                // console.log('benchDetails', benchDetails);
                return benchDetails;
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceService::getNewResources - Error while retrieving new resources:');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
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
     * @description Get resource by resource
     * @param email {string} - resource
     * @returns Response <Resource>
     * @throws ServiceException if failed to get Resource
    */
    getResourceByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResource = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryResource);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No Resource with email '${email}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new resource
     * @param resource  {Resource} - Resource object
     * @returns Response <Resource>
     * @throws ServiceException if failed to Resource
    */
    createResource(createResourceRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('ResourceService::createResource - add new resource record', createResourceRequest);
            const queryResource = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: createResourceRequest.email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
            };
            const resourceResponse = yield this.iDataService.findEntityByQuery(queryResource);
            if (resourceResponse.success && resourceResponse.data) {
                this.iLoggerService.debug('ResourceService::createResource - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createResourceRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets resource  details by id
  * @param resourceId {string} - primary email id
  * @returns Response resources details by its id
  * @throws ServiceException if failed to retrieve resource details
  */
    getResourceById(resourceId) {
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
  * @author <Rohit.L>
  * @description updates resources details
  * @param resource  {Resource} - to update resource information
  * @returns updated resource information
  * @throws ServiceException if failed to update resource details
  */
    updateResource(updateResourceRequest, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: resourceId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
                    values: updateResourceRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - ResourceService::updateResource - Error while updating resource by resource id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete resource details
  * @param id {string} - primary email id
  * @returns delete resource information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteResource(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_RESOURCES,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceService::deleteResource - Error while deleting resource record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ResourceService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], ResourceService.prototype, "iDataService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.ProjectService),
    __metadata("design:type", Object)
], ResourceService.prototype, "iProjectService", void 0);
ResourceService = __decorate([
    (0, inversify_1.injectable)()
], ResourceService);
exports.ResourceService = ResourceService;
