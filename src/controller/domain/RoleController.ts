import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { IRoleService } from '../../service/domain/IRoleService';
import { Role } from '../../types/entity';

// schema
const AddOrUpdateRoleSchema = require('../../schema/role/AddOrUpdateRoleSchema');

@injectable()
export class RoleController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.RoleService)
    private iRoleService: IRoleService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_ROLES}`, this.createRole);
        this.router.post(`${URLConstants.URL_ROLES}/list`, this.getRolesList);
        this.router.get(`${URLConstants.URL_ROLES}/:id`, this.getRoleById);
        this.router.put(`${URLConstants.URL_ROLES}/:id`, this.updateRole);
        this.router.delete(`${URLConstants.URL_ROLES}/:id`, this.deleteRole);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getRolesList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('RoleController::getRoleList - retrieves Role list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iRoleService.getRoleList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('RoleController::getRoleList - Error while retrieving Role list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createRole
    * @param req {Request} - Express Request -{Role}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Role added
    * @throws ServiceException if failed to add Role
    */
    private createRole = async (req: Request, res: Response) => {
        try {
            const createRoleRequest: Role = req.body;
            this.iLoggerService.debug('RoleController::createRole -  createRoleRequest', createRoleRequest);
            this.validateRequest(createRoleRequest, AddOrUpdateRoleSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iRoleService.createRole(createRoleRequest);
            this.iLoggerService.log('RoleController::createRole - response', response.data);
            this.sendResponse(201, 'Role created');
        } catch (error) {
            this.iLoggerService.error('Error - RoleController::createRole - Error while crate Role request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets Role by ID
    * @param req {Request} - Express Request - roleId
    * @param res {Response} - Express Response - Role details
    * @returns  RoleResponse object is returned
    * @throws InvalidRequestException if Role id is invalid
    */
    private getRoleById = async (req: Request, res: Response) => {
        try {
            const roleId: string = req.params.id;
            this.iLoggerService.debug('RoleController::getRoleById - roleId', roleId);
            const RoleResult = await this.iRoleService.getRoleById(roleId);
            if (RoleResult.success) {
                this.sendResponse(200, RoleResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - RoleController::getRoleById - Error while retrieving Role');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateRole
   * @param req {Request} - Express Request -{Role}
   * @param res {Response} - Express Response - success
   * @returns Successfully if Role updated
   * @throws ServiceException if failed to update Role
   */
    private updateRole = async (req: Request, res: Response) => {
        try {
            const updateRoleRequest: Role = req.body;
            const roleId = req.params.id;
            this.iLoggerService.debug('RoleController::updateRole -  updateRoleRequest', updateRoleRequest);
            // this.validateRequest(updateRoleRequest, AddOrUpdateRoleSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iRoleService.updateRole(updateRoleRequest, roleId);
            this.iLoggerService.log('RoleController::updateRole - response', response.data);
            this.sendResponse(201, 'Role Updated');
        } catch (error) {
            this.iLoggerService.error('Error - RoleController::updateRole - Error while update Role request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteRole
    * @param req {Request} - Express Request - roleId
    * @param res {Response} - Express Response - Role details
    * @returns  RoleResponse object is returned
    * @throws InvalidRequestException if Role id is invalid
    */
    private deleteRole = async (req: Request, res: Response) => {
        try {
            const roleId: string = req.params.id;
            this.iLoggerService.debug('RoleController::deleteRole - roleId', roleId);
            const response = await this.iRoleService.deleteRole(roleId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - RoleController::deleteRole - Error while delete Role');
            this.sendError(error);
        }
    }
}
