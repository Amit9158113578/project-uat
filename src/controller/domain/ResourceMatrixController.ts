import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { IResourceService } from '../../service/domain/IResourceService';
import { Resource } from '../../types/entity';
import { IProjectService } from '../../service/domain/IProjectService';

// schema
const AddOrUpdateResourceSchema = require('../../schema/resource/AddOrUpdateResourceSchema');

@injectable()
export class ResourceMatrixController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.ResourceService)
    private iResourceService: IResourceService;

    @inject(BaseIdentifiers.ProjectService)
    private iProjectService: IProjectService;

    constructor() {
        super();
        // this.router.post(`${URLConstants.URL_RESOURCES}/matrixResourceList`, this.getResourcesList);
        this.router.post(`${URLConstants.URL_RESOURCES_MATRIX}/resourceBilliable`, this.getBilliableResources);
        this.router.get(`${URLConstants.URL_RESOURCES_MATRIX}/:id`, this.getResourceById);
        this.router.put(`${URLConstants.URL_RESOURCES_MATRIX}/:id`, this.updateResource);
        this.router.delete(`${URLConstants.URL_RESOURCES_MATRIX}/:id`, this.deleteResource);
        this.router.post(`${URLConstants.URL_RESOURCES_MATRIX}/matrix`, this.getResourcesMatrixList);
        this.router.post(`${URLConstants.URL_PROJECTS}/resourceDetails`, this.getResourceDetailsList);
        this.router.post(`${URLConstants.URL_PROJECTS}/projWiseResource`, this.getProjectWiseResourceDetailsList);
        this.router.post(`${URLConstants.URL_PROJECTS}/projWiseBillable`, this.getProjectWiseResourceBillableDetailsList);
        this.router.get(`${URLConstants.URL_RESOURCES_MATRIX}/:id`, this.getResourceById);
        this.router.post(`${URLConstants.URL_RESOURCES_MATRIX}/resById/:resourceId`, this.getResourceDetailsListById);
        this.router.post(`${URLConstants.URL_RESOURCES_MATRIX}/benchList`, this.getBenchResourcesList);
        this.router.post(`${URLConstants.URL_RESOURCES_MATRIX}/byDepartment`, this.getResourcesByDepartment);
        this.router.post(`${URLConstants.URL_PROJECTS}/resourceMngDetails`, this.getResourceMngList);

    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */

    private getResourcesByDepartment = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ResourceController::getResourceList - retrieves Resource list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iResourceService.getResourcesByDepartment(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
            this.sendError(error);
        }
    }

    private getResourceDetailsList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ProjectController::getProjectList - retrieves Project list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iProjectService.getResourceDetailsList(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ProjectController::getProjectList - Error while retrieving Project list', 400);
            this.sendError(error);
        }
    }


    private getProjectWiseResourceDetailsList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ProjectController::getProjectWiseResourceDetailsList - retrieves Project list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iProjectService.getProjectWiseResourceDetailsList(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ProjectController::getProjectWiseResourceDetailsList - Error while retrieving Project list', 400);
            this.sendError(error);
        }
    }

    private getProjectWiseResourceBillableDetailsList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ProjectController::getProjectWiseResourceBillableDetailsList - retrieves Project list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iProjectService.getProjectWiseResourceBillableDetailsList(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ProjectController::getProjectWiseResourceBillableDetailsList - Error while retrieving Project list', 400);
            this.sendError(error);
        }
    }


    private getResourceMngList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ProjectController::getProjectList - retrieves Project list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iResourceService.getMngResourceList(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ProjectController::getProjectList - Error while retrieving Project list', 400);
            this.sendError(error);
        }
    }
    
    private getBenchResourcesList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ResourceController::getResourceList - retrieves Resource list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iResourceService.getBenchResourcesList(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
            this.sendError(error);
        }
    }

    private getResourceDetailsListById = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ProjectController::getResourceDetailsListById - retrieves Project list');
            const resourceId: string = req.params.resourceId;
            this.iLoggerService.debug('ResourceId value from Request:'+ resourceId.toString);
            const ResourceResult = await this.iProjectService.getResourceDetailsListById(resourceId);
            if (ResourceResult) {
                this.sendResponse(200, ResourceResult);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ResourceController::getResourceById - Error while retrieving Resource'+error.toString());
            this.sendError(error);
        }
    }

    private getBilliableResources = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ResourceMatrixController::getBilliableResources - retrieves Billiable Resource: ');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iResourceService.getBilliableResources(listQueryRequest);
            this.sendResponse(200, response);
        } catch (error) {
            this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
            this.sendError(error);
        }
    }

    private getResourcesMatrixList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ResourceController::getResourceMatrixList - retrieves ResourceMatrixList list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            // const response = await this.iResourceService.getResourceList(listQueryRequest);
            const response = await this.iResourceService.getResourcesMatrixList(listQueryRequest);
            console.log("Logging for resource matrix : ");
            this.sendResponse(200, response);
            // this.sendResponse(200, "ok", 200);
        } catch (error) {
            this.iLoggerService.error('getResourceMatrixList::getResourceMatrixList - Error while retrieving Resource list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createResource
    * @param req {Request} - Express Request -{Resource}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Resource added
    * @throws ServiceException if failed to add Resource
    */
    // private createResource = async (req: Request, res: Response) => {
    //     try {
    //         const createResourceRequest: Resource = req.body;
    //         this.iLoggerService.debug('ResourceController::createResource -  createResourceRequest', createResourceRequest);
    //         this.validateRequest(createResourceRequest, AddOrUpdateResourceSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
    //         const response = await this.iResourceService.createResource(createResourceRequest);
    //         this.iLoggerService.log('ResourceController::createResource - response', response.data);
    //         this.sendResponse(201, 'Resource created');
    //     } catch (error) {
    //         this.iLoggerService.error('Error - ResourceController::createResource - Error while crate Resource request');
    //         this.sendError(error);
    //     }
    // }

    /**
    * @author <Rohit.L>
    * @description gets Resource by ID
    * @param req {Request} - Express Request - resourceId
    * @param res {Response} - Express Response - Resource details
    * @returns  ResourceResponse object is returned
    * @throws InvalidRequestException if Resource id is invalid
    */
    private getResourceById = async (req: Request, res: Response) => {
        try {
            const resourceId: string = req.params.id;
            this.iLoggerService.debug('ResourceController::getResourceById - resourceId', resourceId);
            const ResourceResult = await this.iResourceService.getResourceById(resourceId);
            if (ResourceResult.success) {
                this.sendResponse(200, ResourceResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ResourceController::getResourceById - Error while retrieving Resource');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateResource
   * @param req {Request} - Express Request -{Resource}
   * @param res {Response} - Express Response - success
   * @returns Successfully if Resource updated
   * @throws ServiceException if failed to update Resource
   */
    private updateResource = async (req: Request, res: Response) => {
        try {
            const updateResourceRequest: Resource = req.body;
            const resourceId = req.params.id;
            this.iLoggerService.debug('ResourceController::updateResource -  updateResourceRequest', updateResourceRequest);
            this.validateRequest(updateResourceRequest, AddOrUpdateResourceSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iResourceService.updateResource(updateResourceRequest, resourceId);
            this.iLoggerService.log('ResourceController::updateResource - response', response.data);
            this.sendResponse(201, 'Resource Updated');
        } catch (error) {
            this.iLoggerService.error('Error - ResourceController::updateResource - Error while update Resource request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteResource
    * @param req {Request} - Express Request - resourceId
    * @param res {Response} - Express Response - Resource details
    * @returns  ResourceResponse object is returned
    * @throws InvalidRequestException if Resource id is invalid
    */
    private deleteResource = async (req: Request, res: Response) => {
        try {
            const resourceId: string = req.params.id;
            this.iLoggerService.debug('ResourceController::deleteResource - resourceId', resourceId);
            const response = await this.iResourceService.deleteResource(resourceId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ResourceController::deleteResource - Error while delete Resource');
            this.sendError(error);
        }
    }
}
