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
exports.DepartmentController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateDepartmentSchema = require('../../schema/department/AddOrUpdateDepartmentSchema');
let DepartmentController = class DepartmentController extends baseController_1.BaseController {
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
        this.getDepartmentsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('DepartmentController::getDepartmentList - retrieves Department list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iDepartmentService.getDepartmentList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('DepartmentController::getDepartmentList - Error while retrieving Department list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createDepartment
        * @param req {Request} - Express Request -{Department}
        * @param res {Response} - Express Response - success
        * @returns Successfully if Department added
        * @throws ServiceException if failed to add Department
        */
        this.createDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createDepartmentRequest = req.body;
                this.iLoggerService.debug('DepartmentController::createDepartment -  createDepartmentRequest', createDepartmentRequest);
                this.validateRequest(createDepartmentRequest, AddOrUpdateDepartmentSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iDepartmentService.createDepartment(createDepartmentRequest);
                this.iLoggerService.log('DepartmentController::createDepartment - response', response.data);
                this.sendResponse(201, 'Department created');
            }
            catch (error) {
                this.iLoggerService.error('Error - DepartmentController::createDepartment - Error while crate Department request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Department by ID
        * @param req {Request} - Express Request - departmentId
        * @param res {Response} - Express Response - Department details
        * @returns  DepartmentResponse object is returned
        * @throws InvalidRequestException if Department id is invalid
        */
        this.getDepartmentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentId = req.params.id;
                this.iLoggerService.debug('DepartmentController::getDepartmentById - departmentId', departmentId);
                const DepartmentResult = yield this.iDepartmentService.getDepartmentById(departmentId);
                if (DepartmentResult.success) {
                    this.sendResponse(200, DepartmentResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - DepartmentController::getDepartmentById - Error while retrieving Department');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateDepartment
       * @param req {Request} - Express Request -{Department}
       * @param res {Response} - Express Response - success
       * @returns Successfully if Department updated
       * @throws ServiceException if failed to update Department
       */
        this.updateDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateDepartmentRequest = req.body;
                const departmentId = req.params.id;
                this.iLoggerService.debug('DepartmentController::updateDepartment -  updateDepartmentRequest', updateDepartmentRequest);
                this.validateRequest(updateDepartmentRequest, AddOrUpdateDepartmentSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iDepartmentService.updateDepartment(updateDepartmentRequest, departmentId);
                this.iLoggerService.log('DepartmentController::updateDepartment - response', response.data);
                this.sendResponse(201, 'Department Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - DepartmentController::updateDepartment - Error while update Department request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteDepartment
        * @param req {Request} - Express Request - departmentId
        * @param res {Response} - Express Response - Department details
        * @returns  DepartmentResponse object is returned
        * @throws InvalidRequestException if Department id is invalid
        */
        this.deleteDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentId = req.params.id;
                this.iLoggerService.debug('DepartmentController::deleteDepartment - departmentId', departmentId);
                const response = yield this.iDepartmentService.deleteDepartment(departmentId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - DepartmentController::deleteDepartment - Error while delete Department');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_DEPARTMENTS}`, this.createDepartment);
        this.router.post(`${urlConstants_1.URLConstants.URL_DEPARTMENTS}/list`, this.getDepartmentsList);
        this.router.get(`${urlConstants_1.URLConstants.URL_DEPARTMENTS}/:id`, this.getDepartmentById);
        this.router.put(`${urlConstants_1.URLConstants.URL_DEPARTMENTS}/:id`, this.updateDepartment);
        this.router.delete(`${urlConstants_1.URLConstants.URL_DEPARTMENTS}/:id`, this.deleteDepartment);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], DepartmentController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.DepartmentService),
    __metadata("design:type", Object)
], DepartmentController.prototype, "iDepartmentService", void 0);
DepartmentController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DepartmentController);
exports.DepartmentController = DepartmentController;
