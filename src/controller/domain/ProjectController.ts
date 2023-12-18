import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { IProjectService } from '../../service/domain/IProjectService';
import { Project } from '../../types/entity';

// schema
// const AddOrUpdateProjectSchema = require('../../schema/project/AddOrUpdateProjectSchema');

@injectable()
export class ProjectController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.ProjectService)
    private iProjectService: IProjectService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_PROJECTS}`, this.createProject);
        this.router.post(`${URLConstants.URL_PROJECTS}/list`, this.getProjectsList);
        this.router.get(`${URLConstants.URL_PROJECTS}/:id`, this.getProjectById);
        this.router.put(`${URLConstants.URL_PROJECTS}/:id`, this.updateProject);
        this.router.delete(`${URLConstants.URL_PROJECTS}/:id`, this.deleteProject);
        this.router.post(`${URLConstants.URL_PROJECTS}/dashboards`, this.getDashboardData);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getProjectsList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ProjectController::getProjectList - retrieves Project list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iProjectService.getProjectList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('ProjectController::getProjectList - Error while retrieving Project list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createProject
    * @param req {Request} - Express Request -{Project}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Project added
    * @throws ServiceException if failed to add Project
    */
    private createProject = async (req: Request, res: Response) => {
        try {
            const createProjectRequest: Project = req.body;
            this.iLoggerService.debug('ProjectController::createProject -  createProjectRequest', createProjectRequest);
            // this.validateRequest(createProjectRequest, AddOrUpdateProjectSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iProjectService.createProject(createProjectRequest);
            this.iLoggerService.log('ProjectController::createProject - response', response.data);
            this.sendResponse(201, 'Project created');
        } catch (error) {
            this.iLoggerService.error('Error - ProjectController::createProject - Error while crate Project request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets Project by ID
    * @param req {Request} - Express Request - projectId
    * @param res {Response} - Express Response - Project details
    * @returns  ProjectResponse object is returned
    * @throws InvalidRequestException if Project id is invalid
    */
    private getProjectById = async (req: Request, res: Response) => {
        try {
            const projectId: string = req.params.id;
            this.iLoggerService.debug('ProjectController::getProjectById - projectId', projectId);
            const ProjectResult = await this.iProjectService.getProjectById(projectId);
            if (ProjectResult.success) {
                this.sendResponse(200, ProjectResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ProjectController::getProjectById - Error while retrieving Project');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateProject
   * @param req {Request} - Express Request -{Project}
   * @param res {Response} - Express Response - success
   * @returns Successfully if Project updated
   * @throws ServiceException if failed to update Project
   */
    private updateProject = async (req: Request, res: Response) => {
        try {
            const updateProjectRequest: Project = req.body;
            const projectId = req.params.id;
            this.iLoggerService.debug('ProjectController::updateProject -  updateProjectRequest', updateProjectRequest);
            // this.validateRequest(updateProjectRequest, AddOrUpdateProjectSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iProjectService.updateProject(updateProjectRequest, projectId);
            this.iLoggerService.log('ProjectController::updateProject - response', response.data);
            this.sendResponse(201, 'Project Updated');
        } catch (error) {
            this.iLoggerService.error('Error - ProjectController::updateProject - Error while update Project request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteProject
    * @param req {Request} - Express Request - projectId
    * @param res {Response} - Express Response - Project details
    * @returns  ProjectResponse object is returned
    * @throws InvalidRequestException if Project id is invalid
    */
    private deleteProject = async (req: Request, res: Response) => {
        try {
            const projectId: string = req.params.id;
            this.iLoggerService.debug('ProjectController::deleteProject - projectId', projectId);
            const response = await this.iProjectService.deleteProject(projectId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ProjectController::deleteProject - Error while delete Project');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets Dashboard Data
    * @param req {Request} - Express Request - 
    * @param res {Response} - Express Response - Dashboard details
    * @returns  DashboardResponse object is returned
    */
    private getDashboardData = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.debug('ProjectController::getDashboardData');
            const ProjectResult = await this.iProjectService.getDashboardData();
            if (ProjectResult) {
                this.sendResponse(200, ProjectResult);
            } 
        } catch (error) {
            this.iLoggerService.error('Error - ProjectController::getDashboardData - Error while retrieving Project');
            this.sendError(error);
        }
    }
}
