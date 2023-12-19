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
exports.MongoDbReadService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const mongodb_1 = require("mongodb");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
const queryTranslator_1 = require("./queryTranslator");
const dbConstants_1 = require("../../../constants/dbConstants");
/**
 *

 * @description Mongo DB read operations implementation.
 */
let MongoDbReadService = class MongoDbReadService {
    /**

     * @description This method will return a collection document which is matching with the provided Collection Doc ID
     * @returns Response<T>
     * @param findEntityByIdRequest {findEntityByIdRequest}
     */
    findOneById(findEntityByIdRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbReadService::findOneById - Find Entity By ID', findEntityByIdRequest);
            try {
                let dbConnection = yield this.iDatabaseClient.getConnection();
                let entity = yield dbConnection.collection(findEntityByIdRequest.tableName).findOne({
                    _id: new mongodb_1.ObjectID(findEntityByIdRequest.id)
                });
                response.success = entity ? true : false;
                response.data = entity;
                this.changeFieldName([entity]);
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbReadService::findOneById', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
            }
            return response;
        });
    }
    /**

     * @param findByIdsRequest {findEntityByIdRequest[]}
     */
    findManyByIds(findByIdsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const response = { success: false, data: [] };
                this.iLoggerService.debug('MongoDbReadService::findManyByIds - Find entities by IDs', findByIdsRequest);
                let promiseArray = [];
                findByIdsRequest.forEach(findEntityByIdRequest => {
                    promiseArray.push(this.findOneById(findEntityByIdRequest));
                });
                Promise.all(promiseArray).then(results => {
                    results.forEach(result => {
                        response.data.push(result.data);
                    });
                    response.success = response.data.length > 0 ? true : false;
                    resolve(response);
                }).catch(error => {
                    this.iLoggerService.error('Error - MongoDbReadService::findManyByIds', error);
                    reject(error);
                });
            }));
        });
    }
    /**

     * @param query {Query}
     */
    findManyByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('MongoDbReadService::findManyByQuery - Start', query);
            let response = yield this.executeQuery(query);
            return response;
        });
    }
    /**

     * @param query {Query}
     */
    findOneByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbReadService::findOneByQuery - Find doc by driteria', query);
            try {
                const filterQuery = queryTranslator_1.QueryTranslator.convertQueryToNoSqlQuery(query);
                this.iLoggerService.debug('MongoDbReadService::findOneByQuery - Filter query', JSON.stringify(filterQuery));
                let dbConnection = yield this.iDatabaseClient.getConnection();
                let document = yield dbConnection.collection(query.tableName).findOne(filterQuery);
                response.data = document;
                response.success = document ? true : false;
                this.changeFieldName([document]);
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbReadService::findOneByQuery', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
            }
            return response;
        });
    }
    /**

     * Aggregate function
     * @param aggregationRequest {AggregationRequest}
     */
    aggregation(aggregationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbReadService::aggregation - Aggregate data', aggregationRequest);
            try {
                const filterQuery = queryTranslator_1.QueryTranslator.convertQueryToNoSqlQuery(aggregationRequest.query);
                this.iLoggerService.debug('MongoDbReadService::aggregation - Filter query', JSON.stringify(filterQuery));
                let dbConnection = yield this.iDatabaseClient.getConnection();
                const aggregate = [];
                aggregate.push({
                    '$match': filterQuery,
                });
                if (aggregationRequest.$count) {
                    aggregate.push({
                        '$count': aggregationRequest.$count
                    });
                }
                if (aggregationRequest.$group) {
                    const expression = {};
                    aggregationRequest.$group.fields.forEach(field => {
                        expression[field] = `$${field}`;
                    });
                    aggregate.push({
                        '$group': Object.assign({ _id: expression }, aggregationRequest.$group.output)
                    });
                }
                let aggregationResult = yield dbConnection.collection(aggregationRequest.query.tableName).aggregate(aggregate).toArray();
                this.iLoggerService.debug('MongoDbReadService::aggregation Result', aggregationResult);
                response.data = aggregationResult;
                response.success = aggregationResult ? true : false;
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbReadService::aggregation', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
            }
            return response;
        });
    }
    /**

     * @param findAndUpdateRequest {FindAndModifyRequest}
     */
    findAndModify(findAndUpdateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbReadService::findAndModify - Find and modify document', findAndUpdateRequest);
            try {
                const filterQuery = queryTranslator_1.QueryTranslator.convertQueryToNoSqlQuery(findAndUpdateRequest.query);
                this.iLoggerService.debug('MongoDbReadService::findAndModify - Filter query', JSON.stringify(filterQuery));
                let dbConnection = yield this.iDatabaseClient.getConnection();
                let document = yield dbConnection.collection(findAndUpdateRequest.query.tableName).findOneAndUpdate(filterQuery, findAndUpdateRequest.update);
                response.data = document.value;
                response.success = document.value ? true : false;
                this.changeFieldName([document.value]);
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbReadService::findAndModify', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
            }
            return response;
        });
    }
    /**

     * @param query {Query}
     */
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbReadService::executeQuery - Execute query by criteria', query);
            try {
                const filterQuery = queryTranslator_1.QueryTranslator.convertQueryToNoSqlQuery(query);
                this.iLoggerService.debug('MongoDbReadService::executeQuery - Filter query', filterQuery);
                let dbConnection = yield this.iDatabaseClient.getConnection();
                const cursor = dbConnection.collection(query.tableName).find(filterQuery);
                if (query.outputProperties) {
                    const projection = {};
                    for (let index = 0; index < query.outputProperties.length; index++) {
                        const fieldName = query.outputProperties[index];
                        projection[fieldName] = 1;
                    }
                    cursor.project(projection);
                }
                if (query.order) {
                    cursor.sort(query.order);
                }
                const limit = query.limit ? query.limit : dbConstants_1.DBConstants.DB_QUERY_RESULT_LIMIT;
                cursor.limit(limit);
                if (query.start) {
                    cursor.skip(query.start);
                }
                if (query.start === 0) {
                    const countResponse = yield this.aggregation({
                        $count: 'totalCount',
                        query: query,
                    });
                    response.totalCount = countResponse.data[0] ? countResponse.data[0].totalCount : 0;
                }
                let documents = yield cursor.toArray();
                if (!documents) {
                    documents = [];
                }
                response.data = documents;
                response.success = documents.length > 0 ? true : false;
                this.changeFieldName(documents);
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbReadService::executeQuery', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_READ_EXCEPTION, 500);
            }
            return response;
        });
    }
    changeFieldName(entities) {
        entities.forEach(entity => {
            if (entity) {
                const value = entity['_id'] + '';
                entity[dbConstants_1.FieldNames.FIELD_ID] = value;
                delete entity['_id'];
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], MongoDbReadService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbClient),
    __metadata("design:type", Object)
], MongoDbReadService.prototype, "iDatabaseClient", void 0);
MongoDbReadService = __decorate([
    (0, inversify_1.injectable)()
], MongoDbReadService);
exports.MongoDbReadService = MongoDbReadService;
