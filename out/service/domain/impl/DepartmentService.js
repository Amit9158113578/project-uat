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
exports.DepartmentService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
/**
 * @author <Rohit.L>
 * @description Department service implementation
 */
let DepartmentService = class DepartmentService {
    /**
     * @author <Rohit.L>
     * @description gets all departments lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all department's details
     * @throws ServiceException if failed to retrieve departments
     */
    getDepartmentList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('DepartmentService::getDepartmentList - RuralDestinationsList', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
                };
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('DepartmentService::getDepartmentList - queryResult', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - DepartmentService::getDepartmentList - Error while retrieving department list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
     * @author <Rohit L.>
     * @description Get department by department
     * @param name {string} - department
     * @returns Response <Department>
     * @throws ServiceException if failed to get Department
    */
    getDepartmentByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryDepartment = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_NAME,
                        op: 'eq',
                        value: name,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryDepartment);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No Department with name '${name}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new department
     * @param department  {Department} - Department object
     * @returns Response <Department>
     * @throws ServiceException if failed to Department
    */
    createDepartment(createDepartmentRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('DepartmentService::createDepartment - add new department record', createDepartmentRequest);
            const queryDepartment = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_NAME,
                        op: 'eq',
                        value: createDepartmentRequest.name,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
            };
            const departmentResponse = yield this.iDataService.findEntityByQuery(queryDepartment);
            if (departmentResponse.success && departmentResponse.data) {
                this.iLoggerService.debug('DepartmentService::createDepartment - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createDepartmentRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets department  details by id
  * @param departmentId {string} - primary email id
  * @returns Response departments details by its id
  * @throws ServiceException if failed to retrieve department details
  */
    getDepartmentById(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('DepartmentService::getDepartmentById - Find department by department id', departmentId);
                const findDepartmentById = {
                    id: departmentId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
                };
                const queryResult = yield this.iDataService.findEntityById(findDepartmentById);
                this.iLoggerService.debug('DepartmentService::getDepartmentById - Find departments by department id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - DepartmentService::getDepartmentById - Error while retrieving departments by department id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
  * @author <Rohit.L>
  * @description updates departments details
  * @param department  {Department} - to update department information
  * @returns updated department information
  * @throws ServiceException if failed to update department details
  */
    updateDepartment(updateDepartmentRequest, departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: departmentId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
                    values: updateDepartmentRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - DepartmentService::updateDepartment - Error while updating department by department id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete department details
  * @param id {string} - primary email id
  * @returns delete department information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_DEPARTMENTS,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - DepartmentService::deleteDepartment - Error while deleting department record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], DepartmentService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], DepartmentService.prototype, "iDataService", void 0);
DepartmentService = __decorate([
    (0, inversify_1.injectable)()
], DepartmentService);
exports.DepartmentService = DepartmentService;
