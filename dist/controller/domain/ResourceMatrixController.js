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
exports.ResourceMatrixController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateResourceSchema = require('../../schema/resource/AddOrUpdateResourceSchema');
let ResourceMatrixController = class ResourceMatrixController extends baseController_1.BaseController {
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
        this.getResourceDetailsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectController::getProjectList - retrieves Project list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iProjectService.getResourceDetailsList(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ProjectController::getProjectList - Error while retrieving Project list', 400);
                this.sendError(error);
            }
        });
        this.getProjectWiseResourceDetailsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectController::getProjectWiseResourceDetailsList - retrieves Project list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iProjectService.getProjectWiseResourceDetailsList(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ProjectController::getProjectWiseResourceDetailsList - Error while retrieving Project list', 400);
                this.sendError(error);
            }
        });
        this.getProjectWiseResourceBillableDetailsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectController::getProjectWiseResourceBillableDetailsList - retrieves Project list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iProjectService.getProjectWiseResourceBillableDetailsList(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ProjectController::getProjectWiseResourceBillableDetailsList - Error while retrieving Project list', 400);
                this.sendError(error);
            }
        });
        this.getResourceMngList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectController::getProjectList - retrieves Project list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iResourceService.getMngResourceList(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ProjectController::getProjectList - Error while retrieving Project list', 400);
                this.sendError(error);
            }
        });
        this.getBenchResourcesList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceController::getResourceList - retrieves Resource list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iResourceService.getBenchResourcesList(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
                this.sendError(error);
            }
        });
        this.getResourceDetailsListById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectController::getResourceDetailsListById - retrieves Project list');
                const resourceId = req.params.resourceId;
                this.iLoggerService.debug('ResourceId value from Request:' + resourceId.toString);
                const ResourceResult = yield this.iProjectService.getResourceDetailsListById(resourceId);
                if (ResourceResult) {
                    this.sendResponse(200, ResourceResult);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ResourceController::getResourceById - Error while retrieving Resource' + error.toString());
                this.sendError(error);
            }
        });
        this.getBilliableResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceMatrixController::getBilliableResources - retrieves Billiable Resource: ');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iResourceService.getBilliableResources(listQueryRequest);
                this.sendResponse(200, response);
            }
            catch (error) {
                this.iLoggerService.error('ResourceController::getResourceList - Error while retrieving Resource list', 400);
                this.sendError(error);
            }
        });
        this.getResourcesMatrixList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ResourceController::getResourceMatrixList - retrieves ResourceMatrixList list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                // const response = await this.iResourceService.getResourceList(listQueryRequest);
                const response = yield this.iResourceService.getResourcesMatrixList(listQueryRequest);
                console.log("Logging for resource matrix : ");
                this.sendResponse(200, response);
                // this.sendResponse(200, "ok", 200);
            }
            catch (error) {
                this.iLoggerService.error('getResourceMatrixList::getResourceMatrixList - Error while retrieving Resource list', 400);
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
        // private createResource = async (req: Request, res: Response) => {
        //     try {
        //         const createResourceRequest: Resource = req.body;
        //         this.iLoggerService.debug('ResourceController::createResource -  createResourceRequest', createResourceRequest);
        //         this.validateRequest(createResourceRequest, AddOrUpdateResourceSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
        //         const response = await this.iResourceService.createResource(createResourceRequest);
        //         this.iLoggerService.log('ResourceController::createResource - response', response.data);
        //         this.sendResponse(201, 'Resource created');
        //     } catch (error) {
        //         this.iLoggerService.error('Error - ResourceController::createResource - Error while crate Resource request');
        //         this.sendError(error);
        //     }
        // }
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
        // this.router.post(`${URLConstants.URL_RESOURCES}/matrixResourceList`, this.getResourcesList);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/resourceBilliable`, this.getBilliableResources);
        this.router.get(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/:id`, this.getResourceById);
        this.router.put(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/:id`, this.updateResource);
        this.router.delete(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/:id`, this.deleteResource);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/matrix`, this.getResourcesMatrixList);
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}/resourceDetails`, this.getResourceDetailsList);
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}/projWiseResource`, this.getProjectWiseResourceDetailsList);
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}/projWiseBillable`, this.getProjectWiseResourceBillableDetailsList);
        this.router.get(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/:id`, this.getResourceById);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/resById/:resourceId`, this.getResourceDetailsListById);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/benchList`, this.getBenchResourcesList);
        this.router.post(`${urlConstants_1.URLConstants.URL_RESOURCES_MATRIX}/byDepartment`, this.getResourcesByDepartment);
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}/resourceMngDetails`, this.getResourceMngList);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ResourceMatrixController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.ResourceService),
    __metadata("design:type", Object)
], ResourceMatrixController.prototype, "iResourceService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.ProjectService),
    __metadata("design:type", Object)
], ResourceMatrixController.prototype, "iProjectService", void 0);
ResourceMatrixController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ResourceMatrixController);
exports.ResourceMatrixController = ResourceMatrixController;
