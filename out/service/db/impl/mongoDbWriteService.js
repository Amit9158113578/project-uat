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
exports.MongoDbWriteService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const mongodb_1 = require("mongodb");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
const dbConstants_1 = require("../../../constants/dbConstants");
const mongoDbReadService_1 = require("./mongoDbReadService");
const dateUtils_1 = require("../../../util/dateUtils");
const requestContext_1 = require("../../../config/requestContext");
/**
 *

 * @description Mongo DB write service.
 */
let MongoDbWriteService = class MongoDbWriteService {
    persistEntity(persistEntityRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbWriteService::persistEntity - Persist entity', persistEntityRequest);
            const sessionInfo = this.requestContext.getSessionInfo();
            try {
                let dbConnection = yield this.iDatabaseClient.getConnection();
                persistEntityRequest.entity[dbConstants_1.FieldNames.FIELD_CREATED_ON] = dateUtils_1.DateUtils.getCurrentTimeInMillis();
                persistEntityRequest.entity[dbConstants_1.FieldNames.FIELD_LAST_MODIFIED_ON] = dateUtils_1.DateUtils.getCurrentTimeInMillis();
                persistEntityRequest.entity[dbConstants_1.FieldNames.FIELD_CREATED_BY] = sessionInfo.userId;
                persistEntityRequest.entity[dbConstants_1.FieldNames.FIELD_LAST_MODIFIED_BY] = sessionInfo.userId;
                let persistResult = yield dbConnection.collection(persistEntityRequest.tableName).insertOne(persistEntityRequest.entity);
                if (persistResult.insertedId && persistResult.insertedCount > 0) {
                    response.success = true;
                    persistEntityRequest.entity[dbConstants_1.FieldNames.FIELD_ID] = persistResult.insertedId + '';
                    response.data = persistEntityRequest.entity;
                }
                else {
                    throw 'Failed to persist document';
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbWriteService::persistEntity', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_WRITE_EXCEPTION, 500);
            }
            return response;
        });
    }
    updateEntity(updateEntityRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbWriteService::updateEntity - Update entity', updateEntityRequest);
            const sessionInfo = this.requestContext.getSessionInfo();
            try {
                let dbConnection = yield this.iDatabaseClient.getConnection();
                let loggedInUserId;
                updateEntityRequest.values[dbConstants_1.FieldNames.FIELD_LAST_MODIFIED_ON] = dateUtils_1.DateUtils.getCurrentTimeInMillis();
                if (updateEntityRequest.tableName == 'users') {
                    loggedInUserId = updateEntityRequest.id;
                }
                else {
                    loggedInUserId = sessionInfo.userId;
                }
                updateEntityRequest.values[dbConstants_1.FieldNames.FIELD_LAST_MODIFIED_BY] = loggedInUserId;
                const idQuery = { _id: new mongodb_1.ObjectID(updateEntityRequest.id) };
                let updateResult = yield dbConnection.collection(updateEntityRequest.tableName)
                    .updateOne(idQuery, { $set: updateEntityRequest.values });
                if (updateResult.result.nModified && updateResult.result.nModified > 0) {
                    response.success = true;
                    response.data = updateResult.result.nModified;
                }
                else {
                    throw 'Failed to update document';
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbWriteService::persistEntity', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_WRITE_EXCEPTION, 500);
            }
            return response;
        });
    }
    deleteEntityById(deleteEntityRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            this.iLoggerService.debug('MongoDbWriteService::deleteEntityById - Delete entity', deleteEntityRequest);
            try {
                let dbConnection = yield this.iDatabaseClient.getConnection();
                let entity = yield this.mongoDbReadService.findOneById({
                    id: deleteEntityRequest.id,
                    tableName: deleteEntityRequest.tableName
                });
                const idQuery = { _id: new mongodb_1.ObjectID(deleteEntityRequest.id) };
                let deleteResult = yield dbConnection.collection(deleteEntityRequest.tableName).deleteOne(idQuery);
                if (deleteResult.result.ok === 1) {
                    response.success = true;
                    response.data = entity.data;
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - MongoDbWriteService::deleteEntityById', error);
                throw new serviceException_1.ServiceException([error], errorCodes_1.ErrorCodes.ERR_DB_WRITE_EXCEPTION, 500);
            }
            return response;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], MongoDbWriteService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DbClient),
    __metadata("design:type", Object)
], MongoDbWriteService.prototype, "iDatabaseClient", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.MongoReadService),
    __metadata("design:type", mongoDbReadService_1.MongoDbReadService)
], MongoDbWriteService.prototype, "mongoDbReadService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.RequestContext),
    __metadata("design:type", requestContext_1.RequestContext)
], MongoDbWriteService.prototype, "requestContext", void 0);
MongoDbWriteService = __decorate([
    (0, inversify_1.injectable)()
], MongoDbWriteService);
exports.MongoDbWriteService = MongoDbWriteService;
