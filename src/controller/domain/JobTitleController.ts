import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { IJobTitleService } from '../../service/domain/IJobTitleService';
import { JobTitle } from '../../types/entity';

// schema
const AddOrUpdateJobTitleSchema = require('../../schema/jobTitle/AddOrUpdateJobTitleSchema');

@injectable()
export class JobTitleController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.JobTitleService)
    private iJobTitleService: IJobTitleService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_JOBTITLES}`, this.createJobTitle);
        this.router.post(`${URLConstants.URL_JOBTITLES}/list`, this.getJobTitlesList);
        this.router.get(`${URLConstants.URL_JOBTITLES}/:id`, this.getJobTitleById);
        this.router.put(`${URLConstants.URL_JOBTITLES}/:id`, this.updateJobTitle);
        this.router.delete(`${URLConstants.URL_JOBTITLES}/:id`, this.deleteJobTitle);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getJobTitlesList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('JobTitleController::getJobTitleList - retrieves JobTitle list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iJobTitleService.getJobTitleList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('JobTitleController::getJobTitleList - Error while retrieving JobTitle list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createJobTitle
    * @param req {Request} - Express Request -{JobTitle}
    * @param res {Response} - Express Response - success
    * @returns Successfully if JobTitle added
    * @throws ServiceException if failed to add JobTitle
    */
    private createJobTitle = async (req: Request, res: Response) => {
        try {
            const createJobTitleRequest: JobTitle = req.body;
            this.iLoggerService.debug('JobTitleController::createJobTitle -  createJobTitleRequest', createJobTitleRequest);
            this.validateRequest(createJobTitleRequest, AddOrUpdateJobTitleSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iJobTitleService.createJobTitle(createJobTitleRequest);
            this.iLoggerService.log('JobTitleController::createJobTitle - response', response.data);
            this.sendResponse(201, 'JobTitle created');
        } catch (error) {
            this.iLoggerService.error('Error - JobTitleController::createJobTitle - Error while crate JobTitle request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets JobTitle by ID
    * @param req {Request} - Express Request - JobTitleId
    * @param res {Response} - Express Response - JobTitle details
    * @returns  JobTitleResponse object is returned
    * @throws InvalidRequestException if JobTitle id is invalid
    */
    private getJobTitleById = async (req: Request, res: Response) => {
        try {
            const JobTitleId: string = req.params.id;
            this.iLoggerService.debug('JobTitleController::getJobTitleById - JobTitleId', JobTitleId);
            const JobTitleResult = await this.iJobTitleService.getJobTitleById(JobTitleId);
            if (JobTitleResult.success) {
                this.sendResponse(200, JobTitleResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - JobTitleController::getJobTitleById - Error while retrieving JobTitle');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateJobTitle
   * @param req {Request} - Express Request -{JobTitle}
   * @param res {Response} - Express Response - success
   * @returns Successfully if JobTitle updated
   * @throws ServiceException if failed to update JobTitle
   */
    private updateJobTitle = async (req: Request, res: Response) => {
        try {
            const updateJobTitleRequest: JobTitle = req.body;
            const JobTitleId = req.params.id;
            this.iLoggerService.debug('JobTitleController::updateJobTitle -  updateJobTitleRequest', updateJobTitleRequest);
            // this.validateRequest(updateJobTitleRequest, AddOrUpdateJobTitleSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iJobTitleService.updateJobTitle(updateJobTitleRequest, JobTitleId);
            this.iLoggerService.log('JobTitleController::updateJobTitle - response', response.data);
            this.sendResponse(201, 'JobTitle Updated');
        } catch (error) {
            this.iLoggerService.error('Error - JobTitleController::updateJobTitle - Error while update JobTitle request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteJobTitle
    * @param req {Request} - Express Request - JobTitleId
    * @param res {Response} - Express Response - JobTitle details
    * @returns  JobTitleResponse object is returned
    * @throws InvalidRequestException if JobTitle id is invalid
    */
    private deleteJobTitle = async (req: Request, res: Response) => {
        try {
            const JobTitleId: string = req.params.id;
            this.iLoggerService.debug('JobTitleController::deleteJobTitle - JobTitleId', JobTitleId);
            const response = await this.iJobTitleService.deleteJobTitle(JobTitleId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - JobTitleController::deleteJobTitle - Error while delete JobTitle');
            this.sendError(error);
        }
    }
}
