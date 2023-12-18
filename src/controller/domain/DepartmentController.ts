import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { IDepartmentService } from '../../service/domain/IDepartmentService';
import { Department } from '../../types/entity';

// schema
const AddOrUpdateDepartmentSchema = require('../../schema/department/AddOrUpdateDepartmentSchema');

@injectable()
export class DepartmentController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.DepartmentService)
    private iDepartmentService: IDepartmentService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_DEPARTMENTS}`, this.createDepartment);
        this.router.post(`${URLConstants.URL_DEPARTMENTS}/list`, this.getDepartmentsList);
        this.router.get(`${URLConstants.URL_DEPARTMENTS}/:id`, this.getDepartmentById);
        this.router.put(`${URLConstants.URL_DEPARTMENTS}/:id`, this.updateDepartment);
        this.router.delete(`${URLConstants.URL_DEPARTMENTS}/:id`, this.deleteDepartment);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getDepartmentsList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('DepartmentController::getDepartmentList - retrieves Department list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iDepartmentService.getDepartmentList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('DepartmentController::getDepartmentList - Error while retrieving Department list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createDepartment
    * @param req {Request} - Express Request -{Department}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Department added
    * @throws ServiceException if failed to add Department
    */
    private createDepartment = async (req: Request, res: Response) => {
        try {
            const createDepartmentRequest: Department = req.body;
            this.iLoggerService.debug('DepartmentController::createDepartment -  createDepartmentRequest', createDepartmentRequest);
            this.validateRequest(createDepartmentRequest, AddOrUpdateDepartmentSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iDepartmentService.createDepartment(createDepartmentRequest);
            this.iLoggerService.log('DepartmentController::createDepartment - response', response.data);
            this.sendResponse(201, 'Department created');
        } catch (error) {
            this.iLoggerService.error('Error - DepartmentController::createDepartment - Error while crate Department request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets Department by ID
    * @param req {Request} - Express Request - departmentId
    * @param res {Response} - Express Response - Department details
    * @returns  DepartmentResponse object is returned
    * @throws InvalidRequestException if Department id is invalid
    */
    private getDepartmentById = async (req: Request, res: Response) => {
        try {
            const departmentId: string = req.params.id;
            this.iLoggerService.debug('DepartmentController::getDepartmentById - departmentId', departmentId);
            const DepartmentResult = await this.iDepartmentService.getDepartmentById(departmentId);
            if (DepartmentResult.success) {
                this.sendResponse(200, DepartmentResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - DepartmentController::getDepartmentById - Error while retrieving Department');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateDepartment
   * @param req {Request} - Express Request -{Department}
   * @param res {Response} - Express Response - success
   * @returns Successfully if Department updated
   * @throws ServiceException if failed to update Department
   */
    private updateDepartment = async (req: Request, res: Response) => {
        try {
            const updateDepartmentRequest: Department = req.body;
            const departmentId = req.params.id;
            this.iLoggerService.debug('DepartmentController::updateDepartment -  updateDepartmentRequest', updateDepartmentRequest);
            this.validateRequest(updateDepartmentRequest, AddOrUpdateDepartmentSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iDepartmentService.updateDepartment(updateDepartmentRequest, departmentId);
            this.iLoggerService.log('DepartmentController::updateDepartment - response', response.data);
            this.sendResponse(201, 'Department Updated');
        } catch (error) {
            this.iLoggerService.error('Error - DepartmentController::updateDepartment - Error while update Department request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteDepartment
    * @param req {Request} - Express Request - departmentId
    * @param res {Response} - Express Response - Department details
    * @returns  DepartmentResponse object is returned
    * @throws InvalidRequestException if Department id is invalid
    */
    private deleteDepartment = async (req: Request, res: Response) => {
        try {
            const departmentId: string = req.params.id;
            this.iLoggerService.debug('DepartmentController::deleteDepartment - departmentId', departmentId);
            const response = await this.iDepartmentService.deleteDepartment(departmentId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - DepartmentController::deleteDepartment - Error while delete Department');
            this.sendError(error);
        }
    }
}
