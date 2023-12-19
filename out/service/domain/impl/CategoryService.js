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
exports.CategoryService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const dbConstants_1 = require("../../../constants/dbConstants");
const errorCodes_1 = require("../../../constants/errorCodes");
const InvalidRequestException_1 = require("../../../exception/InvalidRequestException");
const serviceException_1 = require("../../../exception/serviceException");
/**
 * @author <Rohit.L>
 * @description Category service implementation
 */
let CategoryService = class CategoryService {
    /**
     * @author <Rohit.L>
     * @description gets all categorys lists
     * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
     * @returns Response all category's details
     * @throws ServiceException if failed to retrieve categorys
     */
    getCategoryList(listQueryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('CategoryService::getCategoryList - RuralDestinationsList', listQueryRequest);
                const query = {
                    conditions: listQueryRequest.conditions,
                    limit: listQueryRequest.limit,
                    order: listQueryRequest.order,
                    start: listQueryRequest.start,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
                };
                const response = yield this.iDataService.findManyByQuery(query);
                this.iLoggerService.log('CategoryService::getCategoryList - queryResult', response);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - CategoryService::getCategoryList - Error while retrieving category list');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
     * @author <Rohit L.>
     * @description Get category by category
     * @param email {string} - category
     * @returns Response <Category>
     * @throws ServiceException if failed to get Category
    */
    getCategoryByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCategory = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_EMAIL,
                        op: 'eq',
                        value: email,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
            };
            const queryResponse = yield this.iDataService.findEntityByQuery(queryCategory);
            if (queryResponse.success) {
                return queryResponse;
            }
            else {
                throw new InvalidRequestException_1.InvalidRequestException([`No Category with email '${email}' found`], errorCodes_1.ErrorCodes.ERR_API_RESOURCE_NOT_FOUND, 400);
            }
        });
    }
    /**
     * @author <Rohit.L>
     * @description API add new category
     * @param category  {Category} - Category object
     * @returns Response <Category>
     * @throws ServiceException if failed to Category
    */
    createCategory(createCategoryRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.log('CategoryService::createCategory - add new category record', createCategoryRequest);
            const queryCategory = {
                conditions: [
                    {
                        fieldName: dbConstants_1.FieldNames.FIELD_NAME,
                        op: 'eq',
                        value: createCategoryRequest.name,
                    }
                ],
                tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
            };
            const categoryResponse = yield this.iDataService.findEntityByQuery(queryCategory);
            if (categoryResponse.success && categoryResponse.data) {
                this.iLoggerService.debug('CategoryService::createCategory - already exists');
                throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_DUPLICATE_RESOURCE, 409);
            }
            const persistEntityResult = {
                entity: createCategoryRequest,
                tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
            };
            const result = yield this.iDataService.persistEntity(persistEntityResult);
            return result;
        });
    }
    /**
  * @author <Rohit.L>
  * @description gets category  details by id
  * @param categoryId {string} - primary email id
  * @returns Response categorys details by its id
  * @throws ServiceException if failed to retrieve category details
  */
    getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('CategoryService::getCategoryById - Find category by category id', categoryId);
                const findCategoryById = {
                    id: categoryId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
                };
                const queryResult = yield this.iDataService.findEntityById(findCategoryById);
                this.iLoggerService.debug('CategoryService::getCategoryById - Find categorys by category id', queryResult);
                return queryResult;
            }
            catch (error) {
                this.iLoggerService.log('Error - CategoryService::getCategoryById - Error while retrieving categorys by category id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 500);
            }
        });
    }
    /**
  * @author <Rohit.L>
  * @description updates categorys details
  * @param category  {Category} - to update category information
  * @returns updated category information
  * @throws ServiceException if failed to update category details
  */
    updateCategory(updateCategoryRequest, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEntityRequest = {
                    id: categoryId,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
                    values: updateCategoryRequest,
                };
                const response = yield this.iDataService.updateEntity(updateEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.log('Error - CategoryService::updateCategory - Error while updating category by category id');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
    /**
  * @author <Rohit.L.>
  * @description delete category details
  * @param id {string} - primary email id
  * @returns delete category information by id
  * @throws ServiceException if failed to delete ruralDestinatio  details
  */
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEntityRequest = {
                    id: id,
                    tableName: dbConstants_1.DBConstants.DB_TABLE_CATEGORY,
                };
                const response = yield this.iDataService.deleteEntityById(deleteEntityRequest);
                return response;
            }
            catch (error) {
                this.iLoggerService.error('Error - CategoryService::deleteCategory - Error while deleting category record.');
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST, 500);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], CategoryService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbService),
    __metadata("design:type", Object)
], CategoryService.prototype, "iDataService", void 0);
CategoryService = __decorate([
    (0, inversify_1.injectable)()
], CategoryService);
exports.CategoryService = CategoryService;
