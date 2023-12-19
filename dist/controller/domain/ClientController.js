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
exports.ClientController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateClientSchema = require('../../schema/client/AddOrUpdateClientSchema');
let ClientController = class ClientController extends baseController_1.BaseController {
    constructor() {
        super();
        /**
         * @author <Rohit.L>
         * @description API - Get Invoice's list
         * @param req {Request} - Express Request - invoice list
         * @param res {Response} - Express Response - success result - invoice list by oragnization id
         * @returns 200 if invoice's list is returned
         * @throws InvalidRequestException if request is invalid
         */
        this.getClientsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ClientController::getClientList - retrieves Client list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iClientService.getClientList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('ClientController::getClientList - Error while retrieving Client list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createClient
        * @param req {Request} - Express Request -{Client}
        * @param res {Response} - Express Response - success
        * @returns Successfully if Client added
        * @throws ServiceException if failed to add Client
        */
        this.createClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createClientRequest = req.body;
                this.iLoggerService.debug('ClientController::createClient -  createClientRequest', createClientRequest);
                this.validateRequest(createClientRequest, AddOrUpdateClientSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iClientService.createClient(createClientRequest);
                this.iLoggerService.log('ClientController::createClient - response', response.data);
                this.sendResponse(201, 'Client created');
            }
            catch (error) {
                this.iLoggerService.error('Error - ClientController::createClient - Error while crate Client request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Client by ID
        * @param req {Request} - Express Request - clientId
        * @param res {Response} - Express Response - Client details
        * @returns  ClientResponse object is returned
        * @throws InvalidRequestException if Client id is invalid
        */
        this.getClientById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = req.params.id;
                this.iLoggerService.debug('ClientController::getClientById - clientId', clientId);
                const ClientResult = yield this.iClientService.getClientById(clientId);
                if (ClientResult.success) {
                    this.sendResponse(200, ClientResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ClientController::getClientById - Error while retrieving Client');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateClient
       * @param req {Request} - Express Request -{Client}
       * @param res {Response} - Express Response - success
       * @returns Successfully if Client updated
       * @throws ServiceException if failed to update Client
       */
        this.updateClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateClientRequest = req.body;
                const clientId = req.params.id;
                this.iLoggerService.debug('ClientController::updateClient -  updateClientRequest', updateClientRequest);
                this.validateRequest(updateClientRequest, AddOrUpdateClientSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iClientService.updateClient(updateClientRequest, clientId);
                this.iLoggerService.log('ClientController::updateClient - response', response.data);
                this.sendResponse(201, 'Client Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - ClientController::updateClient - Error while update Client request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteClient
        * @param req {Request} - Express Request - clientId
        * @param res {Response} - Express Response - Client details
        * @returns  ClientResponse object is returned
        * @throws InvalidRequestException if Client id is invalid
        */
        this.deleteClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = req.params.id;
                this.iLoggerService.debug('ClientController::deleteClient - clientId', clientId);
                const response = yield this.iClientService.deleteClient(clientId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ClientController::deleteClient - Error while delete Client');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_CLIENTS}`, this.createClient);
        this.router.post(`${urlConstants_1.URLConstants.URL_CLIENTS}/list`, this.getClientsList);
        this.router.get(`${urlConstants_1.URLConstants.URL_CLIENTS}/:id`, this.getClientById);
        this.router.put(`${urlConstants_1.URLConstants.URL_CLIENTS}/:id`, this.updateClient);
        this.router.delete(`${urlConstants_1.URLConstants.URL_CLIENTS}/:id`, this.deleteClient);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ClientController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.ClientService),
    __metadata("design:type", Object)
], ClientController.prototype, "iClientService", void 0);
ClientController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ClientController);
exports.ClientController = ClientController;
