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
exports.RoleService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
/**
 * @author <Rohit.L>
 * @description Role service implementation
 */
let RoleService = class RoleService {
    /**
     * @author <Rohit.L>
     * @description gets all roles lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all role's details
     * @throws ServiceException if failed to retrieve roles
     */
    getRoleList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('RoleService::getRoleList - RuralDestinationsList', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
                };
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('RoleService::getRoleList - queryResult', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleService::getRoleList - Error while retrieving role list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
     * @author <Rohit L.>
     * @description Get role by role
     * @param email {string} - role
     * @returns Response <Role>
     * @throws ServiceException if failed to get Role
    */
    getRoleByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRole = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryRole);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No Role with email '${email}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new role
     * @param role  {Role} - Role object
     * @returns Response <Role>
     * @throws ServiceException if failed to Role
    */
    createRole(createRoleRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('RoleService::createRole - add new role record', createRoleRequest);
            const queryRole = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_NAME,
                        op: 'eq',
                        value: createRoleRequest.name,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
            };
            const roleResponse = yield this.iDataService.findEntityByQuery(queryRole);
            if (roleResponse.success && roleResponse.data) {
                this.iLoggerService.debug('RoleService::createRole - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createRoleRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets role  details by id
  * @param roleId {string} - primary email id
  * @returns Response roles details by its id
  * @throws ServiceException if failed to retrieve role details
  */
    getRoleById(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('RoleService::getRoleById - Find role by role id', roleId);
                const findRoleById = {
                    id: roleId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
                };
                const queryResult = yield this.iDataService.findEntityById(findRoleById);
                this.iLoggerService.debug('RoleService::getRoleById - Find roles by role id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - RoleService::getRoleById - Error while retrieving roles by role id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
  * @author <Rohit.L>
  * @description updates roles details
  * @param role  {Role} - to update role information
  * @returns updated role information
  * @throws ServiceException if failed to update role details
  */
    updateRole(updateRoleRequest, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: roleId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
                    values: updateRoleRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - RoleService::updateRole - Error while updating role by role id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete role details
  * @param id {string} - primary email id
  * @returns delete role information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_ROLES,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleService::deleteRole - Error while deleting role record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], RoleService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], RoleService.prototype, "iDataService", void 0);
RoleService = __decorate([
    (0, inversify_1.injectable)()
], RoleService);
exports.RoleService = RoleService;
