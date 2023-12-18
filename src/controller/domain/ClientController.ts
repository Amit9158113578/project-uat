import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { IClientService } from '../../service/domain/IClientService';
import { Client } from '../../types/entity';

// schema
const AddOrUpdateClientSchema = require('../../schema/client/AddOrUpdateClientSchema');

@injectable()
export class ClientController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.ClientService)
    private iClientService: IClientService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_CLIENTS}`, this.createClient);
        this.router.post(`${URLConstants.URL_CLIENTS}/list`, this.getClientsList);
        this.router.get(`${URLConstants.URL_CLIENTS}/:id`, this.getClientById);
        this.router.put(`${URLConstants.URL_CLIENTS}/:id`, this.updateClient);
        this.router.delete(`${URLConstants.URL_CLIENTS}/:id`, this.deleteClient);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getClientsList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('ClientController::getClientList - retrieves Client list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iClientService.getClientList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('ClientController::getClientList - Error while retrieving Client list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createClient
    * @param req {Request} - Express Request -{Client}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Client added
    * @throws ServiceException if failed to add Client
    */
    private createClient = async (req: Request, res: Response) => {
        try {
            const createClientRequest: Client = req.body;
            this.iLoggerService.debug('ClientController::createClient -  createClientRequest', createClientRequest);
            this.validateRequest(createClientRequest, AddOrUpdateClientSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iClientService.createClient(createClientRequest);
            this.iLoggerService.log('ClientController::createClient - response', response.data);
            this.sendResponse(201, 'Client created');
        } catch (error) {
            this.iLoggerService.error('Error - ClientController::createClient - Error while crate Client request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets Client by ID
    * @param req {Request} - Express Request - clientId
    * @param res {Response} - Express Response - Client details
    * @returns  ClientResponse object is returned
    * @throws InvalidRequestException if Client id is invalid
    */
    private getClientById = async (req: Request, res: Response) => {
        try {
            const clientId: string = req.params.id;
            this.iLoggerService.debug('ClientController::getClientById - clientId', clientId);
            const ClientResult = await this.iClientService.getClientById(clientId);
            if (ClientResult.success) {
                this.sendResponse(200, ClientResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ClientController::getClientById - Error while retrieving Client');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateClient
   * @param req {Request} - Express Request -{Client}
   * @param res {Response} - Express Response - success
   * @returns Successfully if Client updated
   * @throws ServiceException if failed to update Client
   */
    private updateClient = async (req: Request, res: Response) => {
        try {
            const updateClientRequest: Client = req.body;
            const clientId = req.params.id;
            this.iLoggerService.debug('ClientController::updateClient -  updateClientRequest', updateClientRequest);
            this.validateRequest(updateClientRequest, AddOrUpdateClientSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iClientService.updateClient(updateClientRequest, clientId);
            this.iLoggerService.log('ClientController::updateClient - response', response.data);
            this.sendResponse(201, 'Client Updated');
        } catch (error) {
            this.iLoggerService.error('Error - ClientController::updateClient - Error while update Client request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteClient
    * @param req {Request} - Express Request - clientId
    * @param res {Response} - Express Response - Client details
    * @returns  ClientResponse object is returned
    * @throws InvalidRequestException if Client id is invalid
    */
    private deleteClient = async (req: Request, res: Response) => {
        try {
            const clientId: string = req.params.id;
            this.iLoggerService.debug('ClientController::deleteClient - clientId', clientId);
            const response = await this.iClientService.deleteClient(clientId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - ClientController::deleteClient - Error while delete Client');
            this.sendError(error);
        }
    }
}
