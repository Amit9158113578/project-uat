import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { DBConstants, FieldNames } from '../../../constants/dbConstants';
import { ErrorCodes } from '../../../constants/errorCodes';
import { InvalidRequestException } from '../../../exception/InvalidRequestException';
import { ServiceException } from '../../../exception/serviceException';
import { BilliableDetails, BilliableResourcesData, BuDetails, Project, ProjectResourcedetails, Resource, ResourceDetails, ResourceMng, ResponseMatrixData } from '../../../types/entity';
import { DeleteEntityRequest, FindEntityByIdRequest, PersistEntityRequest, Query, UpdateEntityRequest } from '../../../types/queryRequest';
import { Response } from '../../../types/reponse';
import { ListQueryRequest } from '../../../types/request';
import { IDatabaseService } from '../../db/iDatabaseService';
import { ILoggerService } from '../../util/iLoggerService';
import { IResourceService } from '../IResourceService';
import { IProjectService } from '../IProjectService';

/**
 * @author <Rohit.L>
 * @description Resource service implementation
 */
@injectable()
export class ResourceService implements IResourceService {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DbService)
    private iDataService: IDatabaseService;

    @inject(BaseIdentifiers.ProjectService)
    private iProjectService: IProjectService;

    /**
     * @author <Rohit.L>
     * @description gets all resources lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all resource's details
     * @throws ServiceException if failed to retrieve resources
     */
    public async getResourceList(listQueryRequest: ListQueryRequest): Promise<Response<Resource[]>> {
        try {
            this.iLoggerService.log('ResourceService::getResourceList - RuralDestinationsList', listQueryRequest);
            const query: Query = {
                conditions: listQueryRequest.conditions,
                limit: listQueryRequest.limit,
                order: listQueryRequest.order,
                start: listQueryRequest.start,
                tableName: DBConstants.DB_TABLE_RESOURCES,
            };
            this.iLoggerService.log('ResourceService::getResourceList Query Value : ', query);
            const response = await this.iDataService.findManyByQuery<Resource>(query);
            this.iLoggerService.log('ResourceService::getResourceList - queryResult', response.data);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - ResourceService::getResourceList - Error while retrieving resource list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getResourcesMatrixList(listQueryRequest: ListQueryRequest): Promise<ResponseMatrixData> {
        try {
            this.iLoggerService.log('ResourceService::getResourcesMatrixList - ', listQueryRequest);
            const totalResourceResponse = await this.getResourceList(listQueryRequest);
            const projectDetailList = await this.iProjectService.getProjectList(listQueryRequest);
            var toalResourceCount = totalResourceResponse.data.length;
            var totalBilliable = 0;
            projectDetailList.data.forEach(async (project) => {
                project.resources.forEach(async (resource) => {
                    totalBilliable = totalBilliable + resource.utilization;
                })
            });
            var toalReosourceOnBentch = toalResourceCount - totalBilliable;
            const responseMatrix: ResponseMatrixData = {
                totalResources: totalResourceResponse.data.length,
                resourcesBilliable: totalBilliable,
                resourcesOnBentch: toalReosourceOnBentch
            }
            this.iLoggerService.log('ResourceService::getResourceList - queryResult', "Error ");
            return responseMatrix;
        } catch (error) {
            this.iLoggerService.error('Error - ResourceService::getResourceList - Error while retrieving resource list');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getBilliableResources(listQueryRequest: ListQueryRequest): Promise<BilliableResourcesData[]> {
        try {
            const billiableDetailMap = new Map<string, BilliableDetails>();
            const responseMatrixArray: BilliableResourcesData[] = [];
            // this.iLoggerService.log('ResourceService::getBilliableResources - ', listQueryRequest);
            const projectDetailList = await this.iProjectService.getProjectList(listQueryRequest);
            projectDetailList.data.forEach(async (project) => {
                project.resources.forEach(async (resource) => {
                    if (billiableDetailMap.has(resource.resourceId)) {
                        var billDetails = billiableDetailMap.get(resource.resourceId);
                        const updatedCost = billDetails.cost + resource.cost;
                        const updatedUtilization = billDetails.utilization + resource.utilization;
                        const resourceDetails: BilliableDetails = {
                            cost: updatedCost,
                            utilization: updatedUtilization,
                        }
                        billiableDetailMap.set(resource.resourceId, resourceDetails);
                        this.iLoggerService.log('if Billiable details of every resource- ', resourceDetails.cost + " along with utilization : " + resourceDetails.utilization);
                    } else {
                        const updatedCost = resource.cost;
                        const updatedUtilization = resource.utilization;
                        const resourceDetails: BilliableDetails = {
                            cost: updatedCost,
                            utilization: updatedUtilization,
                        }
                        billiableDetailMap.set(resource.resourceId, resourceDetails);
                        this.iLoggerService.log('else Billiable details of every resource- ', resourceDetails.cost + " along with utilization : " + resourceDetails.utilization);
                    }
                })
            });
            this.iLoggerService.log('ResourceService::billiableDetailMap  length : ', billiableDetailMap.size);
            const mapEntries = Array.from(billiableDetailMap.entries());

            for (let i = 0; i < mapEntries.length; i++) {
                const [key, value] = mapEntries[i];

                var resourceD = await this.getResourceById_Matrix(key);
                const responseMatrix: BilliableResourcesData = {
                    resourceId: key,
                    resourceName: resourceD.data.fullname,
                    cost: value.cost,
                    utilization: value.utilization

                }
                responseMatrixArray.push(responseMatrix);
                this.iLoggerService.log('inside for loop with Key : ', key + " and values : " + value.cost + " and utilization : " + value.utilization);
            }

            this.iLoggerService.log('ResourceService::getBilliableResources data length : ', responseMatrixArray.length);
            return responseMatrixArray;
        } catch (error) {
            this.iLoggerService.error('Error - ResourceService::getBilliableResources - Error while retrieving billiable resource :');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getResourcesByDepartment(listQueryRequest: ListQueryRequest): Promise<BuDetails[]> {
        try {
            const responseData = await this.getResourceList(listQueryRequest);
            const departmentMap: { [department: string]: BuDetails } = {};

            const getResourceDetails = async (resource) => {
                if (resource.department) {
                    if (!departmentMap[resource.department]) {
                        departmentMap[resource.department] = {
                            designation: '',
                            department: resource.department,
                            buHead: '',
                            resourceDetails: [],
                        };
                    }
                    const resourceDetailsResponse = await this.getResourceById_Matrix(resource.id);
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

                    const approvedProjects = (await this.iProjectService.getProjectList(listQueryRequest)).data.filter(
                        (project: Project) => project.state === 'approved' || project.state === 'completed'
                      );

                    const projectResourcePromises = approvedProjects.map(async (project) => {
                        const projectResources = await project.resources;
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
                    });

                    await Promise.all(projectResourcePromises);

                    if (resource.jobTitle === 'BU Head') {
                        departmentMap[resource.department].designation = 'BU Head';
                        departmentMap[resource.department].buHead = resource.fullname;
                    }

                    departmentMap[resource.department].resourceDetails.push(resourceDetail);
                }
            };
            await Promise.all(responseData.data.map(getResourceDetails));
            const benchDetails = Object.values(departmentMap);
            return benchDetails;
        } catch (error) {
            this.iLoggerService.error('Error - ResourceService::getResourcesByDepartment - Error while retrieving Resources By Department:', error);
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getMngResourceList(listQueryRequest: ListQueryRequest): Promise<ResourceMng[]> {
        try {
            const completeResourceData = await this.getResourceList(listQueryRequest);
            // const completeProjectData = await this.iProjectService.getProjectList(listQueryRequest);
            const completeProjectData = (await this.iProjectService.getProjectList(listQueryRequest)).data.filter(
                (project: Project) => project.state === 'approved' || project.state === 'completed'
              );
            const projectsByResourceId = new Map<string, ProjectResourcedetails[]>();
            completeProjectData.forEach(project => {
                project.resources.forEach(resource => {
                    const projectDetail: ProjectResourcedetails = {
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
                const resourceMng: ResourceMng = {
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
        } catch (error) {
            this.iLoggerService.error('Error - Your error message here', error);
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    public async getBenchResourcesList(listQueryRequest: ListQueryRequest): Promise<Resource[]> {
        try {

            let benchDetails: Resource[] = [];
            let listQueryRequest: ListQueryRequest = {};
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            var responseMatrix = await this.getBilliableResources(listQueryRequest);
            this.iLoggerService.log('ResourceService::BenchResourcesDataList - queryResult', responseMatrix);
            // console.log('responseMatrix', responseMatrix);
            var resourceDetailsList = await this.getResourceList(listQueryRequest);
            this.iLoggerService.debug('ResourceService::getResourceById - resourceDetailsList', resourceDetailsList);
            // console.log('resourceDetailsList', resourceDetailsList.data);
            benchDetails = await resourceDetailsList.data.filter((item1) => !responseMatrix.some((item2) => item2.resourceId === item1.id));
            // console.log('benchDetails', benchDetails);
            return benchDetails;
        } catch (error) {
            this.iLoggerService.error('Error - ResourceService::getNewResources - Error while retrieving new resources:');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
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
     * @description Get resource by resource
     * @param email {string} - resource
     * @returns Response <Resource>
     * @throws ServiceException if failed to get Resource
    */
    public async getResourceByEmail(email: string): Promise<Response<Resource>> {
        const queryResource: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: email,
                }
            ],
            tableName: DBConstants.DB_TABLE_RESOURCES,
        };
        const queryResponse = await this.iDataService.findEntityByQuery<Resource>(queryResource);
        if (queryResponse.success) {
            return queryResponse;
        } else {
            throw new InvalidRequestException([`No Resource with email '${email}' found`], ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
        }
    }

    /**
     * @author <Rohit.L>
     * @description API add new resource
     * @param resource  {Resource} - Resource object
     * @returns Response <Resource>
     * @throws ServiceException if failed to Resource
    */
    public async createResource(createResourceRequest: Resource): Promise<Response<Resource>> {
        this.iLoggerService.log('ResourceService::createResource - add new resource record', createResourceRequest);
        const queryResource: Query = {
            conditions: [
                {
                    fieldName: FieldNames.FIELD_EMAIL,
                    op: 'eq',
                    value: createResourceRequest.email,
                }
            ],
            tableName: DBConstants.DB_TABLE_RESOURCES,
        };
        const resourceResponse = await this.iDataService.findEntityByQuery<Resource>(queryResource);
        if (resourceResponse.success && resourceResponse.data) {
            this.iLoggerService.debug('ResourceService::createResource - already exists');
            throw new InvalidRequestException([], ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
        }
        const persistEntityResult: PersistEntityRequest<Resource> = {
            entity: createResourceRequest,
            tableName: DBConstants.DB_TABLE_RESOURCES,
        };
        const result = await this.iDataService.persistEntity(persistEntityResult);
        return result;
    }

    /**
  * @author <Rohit.L>
  * @description gets resource  details by id
  * @param resourceId {string} - primary email id
  * @returns Response resources details by its id
  * @throws ServiceException if failed to retrieve resource details
  */
    public async getResourceById(resourceId: string): Promise<Response<Resource>> {
        try {
            this.iLoggerService.log('ResourceService::getResourceById - Find resource by resource id', resourceId);
            const findResourceById: FindEntityByIdRequest = {
                id: resourceId,
                tableName: DBConstants.DB_TABLE_RESOURCES,
            };
            const queryResult = await this.iDataService.findEntityById<Resource>(findResourceById);
            this.iLoggerService.debug('ResourceService::getResourceById - Find resources by resource id', queryResult);
            return queryResult;
        } catch (error) {
            this.iLoggerService.log('Error - ResourceService::getResourceById - Error while retrieving resources by resource id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_ID, 500);
        }
    }


    /**
  * @author <Rohit.L>
  * @description updates resources details
  * @param resource  {Resource} - to update resource information
  * @returns updated resource information
  * @throws ServiceException if failed to update resource details
  */
    public async updateResource(updateResourceRequest: Resource, resourceId: string): Promise<Response<Number>> {
        try {
            const updateEntityRequest: UpdateEntityRequest = {
                id: resourceId,
                tableName: DBConstants.DB_TABLE_RESOURCES,
                values: updateResourceRequest,
            };
            const response = await this.iDataService.updateEntity(updateEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.log('Error - ResourceService::updateResource - Error while updating resource by resource id');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }

    /**
  * @author <Rohit.L.>
  * @description delete resource details
  * @param id {string} - primary email id
  * @returns delete resource information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    public async deleteResource(id: string): Promise<Response<Number>> {
        try {
            const deleteEntityRequest: DeleteEntityRequest = {
                id: id,
                tableName: DBConstants.DB_TABLE_RESOURCES,
            };
            const response = await this.iDataService.deleteEntityById<Number>(deleteEntityRequest);
            return response;
        } catch (error) {
            this.iLoggerService.error('Error - ResourceService::deleteResource - Error while deleting resource record.');
            throw new ServiceException([], ErrorCodes.ERR_API_INVALID_REQUEST, 500);
        }
    }
}
