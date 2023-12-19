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
exports.ClientService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
/**
 * @author <Rohit.L>
 * @description Client service implementation
 */
let ClientService = class ClientService {
    /**
     * @author <Rohit.L>
     * @description gets all clients lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all client's details
     * @throws ServiceException if failed to retrieve clients
     */
    getClientList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ClientService::getClientList - RuralDestinationsList', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
                };
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('ClientService::getClientList - queryResult', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - ClientService::getClientList - Error while retrieving client list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
     * @author <Rohit L.>
     * @description Get client by client
     * @param email {string} - client
     * @returns Response <Client>
     * @throws ServiceException if failed to get Client
    */
    getClientByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryClient = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryClient);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No Client with email '${email}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new client
     * @param client  {Client} - Client object
     * @returns Response <Client>
     * @throws ServiceException if failed to Client
    */
    createClient(createClientRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('ClientService::createClient - add new client record', createClientRequest);
            const queryClient = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_NAME,
                        op: 'eq',
                        value: createClientRequest.name,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
            };
            const clientResponse = yield this.iDataService.findEntityByQuery(queryClient);
            if (clientResponse.success && clientResponse.data) {
                this.iLoggerService.debug('ClientService::createClient - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createClientRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets client  details by id
  * @param clientId {string} - primary email id
  * @returns Response clients details by its id
  * @throws ServiceException if failed to retrieve client details
  */
    getClientById(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ClientService::getClientById - Find client by client id', clientId);
                const findClientById = {
                    id: clientId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
                };
                const queryResult = yield this.iDataService.findEntityById(findClientById);
                this.iLoggerService.debug('ClientService::getClientById - Find clients by client id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - ClientService::getClientById - Error while retrieving clients by client id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
  * @author <Rohit.L>
  * @description updates clients details
  * @param client  {Client} - to update client information
  * @returns updated client information
  * @throws ServiceException if failed to update client details
  */
    updateClient(updateClientRequest, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: clientId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
                    values: updateClientRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - ClientService::updateClient - Error while updating client by client id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete client details
  * @param id {string} - primary email id
  * @returns delete client information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CLIENTS,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - ClientService::deleteClient - Error while deleting client record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ClientService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], ClientService.prototype, "iDataService", void 0);
ClientService = __decorate([
    (0, inversify_1.injectable)()
], ClientService);
exports.ClientService = ClientService;
