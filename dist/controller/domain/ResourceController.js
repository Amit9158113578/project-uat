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
exports.ResourceController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateResourceSchema = require('../../schema/resource/AddOrUpdateResourceSchema');
let ResourceController = class ResourceController extends baseController_1.BaseController {
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
        this.getResourcesList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceController::getResourceList - retrieves Resource list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iResourceService.getResourceList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
                this.sendError(error);
            }
        });
        /**
         * @author <Rohit.L>
         * @description API - Get Invoice's list
         * @param req {Request} - Express Request - invoice list
         * @param res {Response} - Express Response - success result - invoice list by oragnization id
         * @returns 200 if invoice's list is returned
         * @throws InvalidRequestException if request is invalid
         */
        this.getResourcesByDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceController::getResourceList - retrieves Resource list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iResourceService.getResourcesByDepartment(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createResource
        * @param req {Request} - Express Request -{Resource}
        * @param res {Response} - Express Response - success
        * @returns Successfully if Resource added
        * @throws ServiceException if failed to add Resource
        */
        this.createResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createResourceRequest = req.body;
                this.iLoggerService.debug('ResourceController::createResource -  createResourceRequest', createResourceRequest);
                this.validateRequest(createResourceRequest, AddOrUpdateResourceSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iResourceService.createResource(createResourceRequest);
                this.iLoggerService.log('ResourceController::createResource - response', response.data);
                this.sendResponse(201, 'Resource created');
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceController::createResource - Error while crate Resource request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Resource by ID
        * @param req {Request} - Express Request - resourceId
        * @param res {Response} - Express Response - Resource details
        * @returns  ResourceResponse object is returned
        * @throws InvalidRequestException if Resource id is invalid
        */
        this.getResourceById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceId = req.params.id;
                this.iLoggerService.debug('ResourceController::getResourceById - resourceId', resourceId);
                const ResourceResult = yield this.iResourceService.getResourceById(resourceId);
                if (ResourceResult.success) {
                    this.sendResponse(200, ResourceResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceController::getResourceById - Error while retrieving Resource');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateResource
       * @param req {Request} - Express Request -{Resource}
       * @param res {Response} - Express Response - success
       * @returns Successfully if Resource updated
       * @throws ServiceException if failed to update Resource
       */
        this.updateResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateResourceRequest = req.body;
                const resourceId = req.params.id;
                this.iLoggerService.debug('ResourceController::updateResource -  updateResourceRequest', updateResourceRequest);
                this.validateRequest(updateResourceRequest, AddOrUpdateResourceSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iResourceService.updateResource(updateResourceRequest, resourceId);
                this.iLoggerService.log('ResourceController::updateResource - response', response.data);
                this.sendResponse(201, 'Resource Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceController::updateResource - Error while update Resource request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteResource
        * @param req {Request} - Express Request - resourceId
        * @param res {Response} - Express Response - Resource details
        * @returns  ResourceResponse object is returned
        * @throws InvalidRequestException if Resource id is invalid
        */
        this.deleteResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceId = req.params.id;
                this.iLoggerService.debug('ResourceController::deleteResource - resourceId', resourceId);
                const response = yield this.iResourceService.deleteResource(resourceId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceController::deleteResource - Error while delete Resource');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES}`, this.createResource);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES}/list`, this.getResourcesList);
        this.router.get(`${urlConstants_1.URLConstants.URL_RESOURCES}/:id`, this.getResourceById);
        this.router.put(`${urlConstants_1.URLConstants.URL_RESOURCES}/:id`, this.updateResource);
        this.router.delete(`${urlConstants_1.URLConstants.URL_RESOURCES}/:id`, this.deleteResource);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES}/byDepartment`, this.getResourcesByDepartment);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ResourceController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.ResourceService),
    __metadata("design:type", Object)
], ResourceController.prototype, "iResourceService", void 0);
ResourceController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ResourceController);
exports.ResourceController = ResourceController;
