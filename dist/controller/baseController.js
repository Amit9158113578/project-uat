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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const validationUtils_1 = require("../util/validationUtils");
const commonUtils_1 = require("../util/commonUtils");
const InvalidRequestException_1 = require("../exception/InvalidRequestException");
const requestContext_1 = require("../config/requestContext");
const baseIdentifiers_1 = require("../config/baseIdentifiers");
const serviceException_1 = require("../exception/serviceException");
const commonConstants_1 = require("../constants/commonConstants");
const maskUtils_1 = require("../util/maskUtils");
/**

 * @description Base Controller

 */
let BaseController = class BaseController {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    getRoutes() {
        return this.router;
    }
    validateRequest(object, schema, errorCode) {
        let validationResult = validationUtils_1.ValidationUtils.validate(object, schema);
        if (!commonUtils_1.CommonUtils.isEmpty(validationResult)) {
            throw new InvalidRequestException_1.InvalidRequestException(validationResult, errorCode, 400);
        }
        return true;
    }
    getSessionInfo() {
        return this.requestContext.getSessionInfo();
    }
    sendError(error) {
        let apiResponse = { success: false };
        if (error instanceof InvalidRequestException_1.InvalidRequestException || error instanceof serviceException_1.ServiceException) {
            let requestError = error;
            apiResponse.errorCode = requestError.errorCode;
            apiResponse.errors = requestError.errors;
            this.requestContext.getResponse().status(requestError.statusCode);
        }
        else {
            apiResponse.errorCode = error;
            this.requestContext.getResponse().status(500);
        }
        this.requestContext.getResponse().send(apiResponse);
    }
    sendResponse(statusCode, responseBody, totalCount) {
        const output = this.requestContext.getRequest()[commonConstants_1.CommonConstants.OUTPUT_NAME];
        if (output && responseBody && output.fields && output.fields !== '*') {
            responseBody = commonUtils_1.CommonUtils.maskJson(responseBody, output.fields);
        }
        if (output && output.maskSensitiveData) {
            responseBody = maskUtils_1.MaskUtils.mask(responseBody, output.sensitiveFields);
        }
        const apiResponse = { success: true, data: responseBody, totalCount: totalCount };
        this.requestContext.getResponse().status(statusCode);
        this.requestContext.getResponse().send(apiResponse);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.RequestContext),
    __metadata("design:type", requestContext_1.RequestContext)
], BaseController.prototype, "requestContext", void 0);
BaseController = __decorate([
    (0, inversify_1.injectable)()
], BaseController);
exports.BaseController = BaseController;
