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
exports.MongoDbService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const mongoDbReadService_1 = require("./mongoDbReadService");
const mongoDbWriteService_1 = require("./mongoDbWriteService");
/**
 *

 * @description Mongo DB implementation of IDatabaseService.
 */
let MongoDbService = class MongoDbService {
    persistEntity(persistEntityRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbWriteService.persistEntity(persistEntityRequest);
            return result;
        });
    }
    updateEntity(updateEntityRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbWriteService.updateEntity(updateEntityRequest);
            return result;
        });
    }
    deleteEntityById(deleteEntityRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbWriteService.deleteEntityById(deleteEntityRequest);
            return result;
        });
    }
    findEntityById(findEntityById) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbReadService.findOneById(findEntityById);
            this.iLoggerService.debug('MongoDbReadService::findEntityById - Result', result);
            return result;
        });
    }
    findEntityByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.iLoggerService.debug('MongoDbReadService::findEntityByQuery - query', query);
            const result = yield this.mongoDbReadService.findOneByQuery(query);
            this.iLoggerService.debug('MongoDbReadService::findEntityByQuery - Result', result);
            return result;
        });
    }
    findManyByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbReadService.findManyByQuery(query);
            return result;
        });
    }
    /**

     * @async Async method
     * @param findAndUpdateRequest {FindAndModifyRequest} - FindAndModifyRequest object
     * @description finds & modify request
     * @throws ServiceException if error ocurred while querying an entity
     * @returns {T} entity
     */
    findAndModify(findAndUpdateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbReadService.findAndModify(findAndUpdateRequest);
            return result;
        });
    }
    /**

     * @async Async method get aggregation
     * @param aggregationRequest {AggregationRequest} - FindAndModifyRequest object
     * @description get aggregation by query
     * @throws ServiceException if error ocurred while querying aggregation
     * @returns {T} entity
     */
    aggregation(aggregationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.mongoDbReadService.aggregation(aggregationRequest);
            return result;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.MongoReadService),
    __metadata("design:type", mongoDbReadService_1.MongoDbReadService)
], MongoDbService.prototype, "mongoDbReadService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.MongoWriteService),
    __metadata("design:type", mongoDbWriteService_1.MongoDbWriteService)
], MongoDbService.prototype, "mongoDbWriteService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], MongoDbService.prototype, "iLoggerService", void 0);
MongoDbService = __decorate([
    (0, inversify_1.injectable)()
], MongoDbService);
exports.MongoDbService = MongoDbService;
