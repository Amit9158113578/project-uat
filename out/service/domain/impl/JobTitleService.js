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
exports.JobTitleService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
/**
 * @author <Rohit.L>
 * @description JobTitle service implementation
 */
let JobTitleService = class JobTitleService {
    /**
     * @author <Rohit.L>
     * @description gets all jobTitles lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all jobTitle's details
     * @throws ServiceException if failed to retrieve jobTitles
     */
    getJobTitleList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('JobTitleService::getJobTitleList - RuralDestinationsList', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
                };
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('JobTitleService::getJobTitleList - queryResult', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - JobTitleService::getJobTitleList - Error while retrieving jobTitle list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
     * @author <Rohit L.>
     * @description Get jobTitle by jobTitle
     * @param email {string} - jobTitle
     * @returns Response <JobTitle>
     * @throws ServiceException if failed to get JobTitle
    */
    getJobTitleByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryJobTitle = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryJobTitle);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No JobTitle with email '${email}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new jobTitle
     * @param jobTitle  {JobTitle} - JobTitle object
     * @returns Response <JobTitle>
     * @throws ServiceException if failed to JobTitle
    */
    createJobTitle(createJobTitleRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('JobTitleService::createJobTitle - add new jobTitle record', createJobTitleRequest);
            const queryJobTitle = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_NAME,
                        op: 'eq',
                        value: createJobTitleRequest.name,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
            };
            const jobTitleResponse = yield this.iDataService.findEntityByQuery(queryJobTitle);
            if (jobTitleResponse.success && jobTitleResponse.data) {
                this.iLoggerService.debug('JobTitleService::createJobTitle - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createJobTitleRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets jobTitle  details by id
  * @param jobTitleId {string} - primary email id
  * @returns Response jobTitles details by its id
  * @throws ServiceException if failed to retrieve jobTitle details
  */
    getJobTitleById(jobTitleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('JobTitleService::getJobTitleById - Find jobTitle by jobTitle id', jobTitleId);
                const findJobTitleById = {
                    id: jobTitleId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
                };
                const queryResult = yield this.iDataService.findEntityById(findJobTitleById);
                this.iLoggerService.debug('JobTitleService::getJobTitleById - Find jobTitles by jobTitle id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - JobTitleService::getJobTitleById - Error while retrieving jobTitles by jobTitle id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
  * @author <Rohit.L>
  * @description updates jobTitles details
  * @param jobTitle  {JobTitle} - to update jobTitle information
  * @returns updated jobTitle information
  * @throws ServiceException if failed to update jobTitle details
  */
    updateJobTitle(updateJobTitleRequest, jobTitleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: jobTitleId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
                    values: updateJobTitleRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - JobTitleService::updateJobTitle - Error while updating jobTitle by jobTitle id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete jobTitle details
  * @param id {string} - primary email id
  * @returns delete jobTitle information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteJobTitle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_JOBTITLES,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - JobTitleService::deleteJobTitle - Error while deleting jobTitle record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], JobTitleService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], JobTitleService.prototype, "iDataService", void 0);
JobTitleService = __decorate([
    (0, inversify_1.injectable)()
], JobTitleService);
exports.JobTitleService = JobTitleService;
