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

// schema
const AddOrUpdateResourceSchema = require('../../schema/resource/AddOrUpdateResourceSchema');

@injectable()
export class ResourceController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.ResourceService)
    private iResourceService: IResourceService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_RESOURCES}`, this.createResource);
        this.router.post(`${URLConstants.URL_RESOURCES}/list`, this.getResourcesList);
        this.router.get(`${URLConstants.URL_RESOURCES}/:id`, this.getResourceById);
        this.router.put(`${URLConstants.URL_RESOURCES}/:id`, this.updateResource);
        this.router.delete(`${URLConstants.URL_RESOURCES}/:id`, this.deleteResource);
        this.router.post(`${URLConstants.URL_RESOURCES}/byDepartment`, this.getResourcesByDepartment);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getResourcesList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ResourceController::getResourceList - retrieves Resource list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iResourceService.getResourceList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
            this.sendError(error);
        }
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

    /**
    * @author <Rohit.L>
    * @description createResource
    * @param req {Request} - Express Request -{Resource}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Resource added
    * @throws ServiceException if failed to add Resource
    */
    private createResource = async (req: Request, res: Response) => {
        try {
            const createResourceRequest: Resource = req.body;
            this.iLoggerService.debug('ResourceController::createResource -  createResourceRequest', createResourceRequest);
            this.validateRequest(createResourceRequest, AddOrUpdateResourceSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iResourceService.createResource(createResourceRequest);
            this.iLoggerService.log('ResourceController::createResource - response', response.data);
            this.sendResponse(201, 'Resource created');
        } catch (error) {
            this.iLoggerService.error('Error - ResourceController::createResource - Error while crate Resource request');
            this.sendError(error);
        }
    }

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
