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
exports.RoleController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateRoleSchema = require('../../schema/role/AddOrUpdateRoleSchema');
let RoleController = class RoleController extends baseController_1.BaseController {
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
        this.getRolesList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('RoleController::getRoleList - retrieves Role list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iRoleService.getRoleList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('RoleController::getRoleList - Error while retrieving Role list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createRole
        * @param req {Request} - Express Request -{Role}
        * @param res {Response} - Express Response - success
        * @returns Successfully if Role added
        * @throws ServiceException if failed to add Role
        */
        this.createRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createRoleRequest = req.body;
                this.iLoggerService.debug('RoleController::createRole -  createRoleRequest', createRoleRequest);
                this.validateRequest(createRoleRequest, AddOrUpdateRoleSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iRoleService.createRole(createRoleRequest);
                this.iLoggerService.log('RoleController::createRole - response', response.data);
                this.sendResponse(201, 'Role created');
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleController::createRole - Error while crate Role request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Role by ID
        * @param req {Request} - Express Request - roleId
        * @param res {Response} - Express Response - Role details
        * @returns  RoleResponse object is returned
        * @throws InvalidRequestException if Role id is invalid
        */
        this.getRoleById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = req.params.id;
                this.iLoggerService.debug('RoleController::getRoleById - roleId', roleId);
                const RoleResult = yield this.iRoleService.getRoleById(roleId);
                if (RoleResult.success) {
                    this.sendResponse(200, RoleResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleController::getRoleById - Error while retrieving Role');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateRole
       * @param req {Request} - Express Request -{Role}
       * @param res {Response} - Express Response - success
       * @returns Successfully if Role updated
       * @throws ServiceException if failed to update Role
       */
        this.updateRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateRoleRequest = req.body;
                const roleId = req.params.id;
                this.iLoggerService.debug('RoleController::updateRole -  updateRoleRequest', updateRoleRequest);
                // this.validateRequest(updateRoleRequest, AddOrUpdateRoleSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iRoleService.updateRole(updateRoleRequest, roleId);
                this.iLoggerService.log('RoleController::updateRole - response', response.data);
                this.sendResponse(201, 'Role Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleController::updateRole - Error while update Role request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteRole
        * @param req {Request} - Express Request - roleId
        * @param res {Response} - Express Response - Role details
        * @returns  RoleResponse object is returned
        * @throws InvalidRequestException if Role id is invalid
        */
        this.deleteRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = req.params.id;
                this.iLoggerService.debug('RoleController::deleteRole - roleId', roleId);
                const response = yield this.iRoleService.deleteRole(roleId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - RoleController::deleteRole - Error while delete Role');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_ROLES}`, this.createRole);
        this.router.post(`${urlConstants_1.URLConstants.URL_ROLES}/list`, this.getRolesList);
        this.router.get(`${urlConstants_1.URLConstants.URL_ROLES}/:id`, this.getRoleById);
        this.router.put(`${urlConstants_1.URLConstants.URL_ROLES}/:id`, this.updateRole);
        this.router.delete(`${urlConstants_1.URLConstants.URL_ROLES}/:id`, this.deleteRole);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], RoleController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.RoleService),
    __metadata("design:type", Object)
], RoleController.prototype, "iRoleService", void 0);
RoleController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RoleController);
exports.RoleController = RoleController;
