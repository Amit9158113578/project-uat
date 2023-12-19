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
exports.ProjectController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
// const AddOrUpdateProjectSchema = require('../../schema/project/AddOrUpdateProjectSchema');
let ProjectController = class ProjectController extends baseController_1.BaseController {
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
        this.getProjectsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('ProjectController::getProjectList - retrieves Project list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iProjectService.getProjectList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('ProjectController::getProjectList - Error while retrieving Project list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createProject
        * @param req {Request} - Express Request -{Project}
        * @param res {Response} - Express Response - success
        * @returns Successfully if Project added
        * @throws ServiceException if failed to add Project
        */
        this.createProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createProjectRequest = req.body;
                this.iLoggerService.debug('ProjectController::createProject -  createProjectRequest', createProjectRequest);
                // this.validateRequest(createProjectRequest, AddOrUpdateProjectSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iProjectService.createProject(createProjectRequest);
                this.iLoggerService.log('ProjectController::createProject - response', response.data);
                this.sendResponse(201, 'Project created');
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectController::createProject - Error while crate Project request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Project by ID
        * @param req {Request} - Express Request - projectId
        * @param res {Response} - Express Response - Project details
        * @returns  ProjectResponse object is returned
        * @throws InvalidRequestException if Project id is invalid
        */
        this.getProjectById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = req.params.id;
                this.iLoggerService.debug('ProjectController::getProjectById - projectId', projectId);
                const ProjectResult = yield this.iProjectService.getProjectById(projectId);
                if (ProjectResult.success) {
                    this.sendResponse(200, ProjectResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectController::getProjectById - Error while retrieving Project');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateProject
       * @param req {Request} - Express Request -{Project}
       * @param res {Response} - Express Response - success
       * @returns Successfully if Project updated
       * @throws ServiceException if failed to update Project
       */
        this.updateProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateProjectRequest = req.body;
                const projectId = req.params.id;
                this.iLoggerService.debug('ProjectController::updateProject -  updateProjectRequest', updateProjectRequest);
                // this.validateRequest(updateProjectRequest, AddOrUpdateProjectSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iProjectService.updateProject(updateProjectRequest, projectId);
                this.iLoggerService.log('ProjectController::updateProject - response', response.data);
                this.sendResponse(201, 'Project Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectController::updateProject - Error while update Project request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteProject
        * @param req {Request} - Express Request - projectId
        * @param res {Response} - Express Response - Project details
        * @returns  ProjectResponse object is returned
        * @throws InvalidRequestException if Project id is invalid
        */
        this.deleteProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = req.params.id;
                this.iLoggerService.debug('ProjectController::deleteProject - projectId', projectId);
                const response = yield this.iProjectService.deleteProject(projectId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectController::deleteProject - Error while delete Project');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Dashboard Data
        * @param req {Request} - Express Request -
        * @param res {Response} - Express Response - Dashboard details
        * @returns  DashboardResponse object is returned
        */
        this.getDashboardData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('ProjectController::getDashboardData');
                const ProjectResult = yield this.iProjectService.getDashboardData();
                if (ProjectResult) {
                    this.sendResponse(200, ProjectResult);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - ProjectController::getDashboardData - Error while retrieving Project');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}`, this.createProject);
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}/list`, this.getProjectsList);
        this.router.get(`${urlConstants_1.URLConstants.URL_PROJECTS}/:id`, this.getProjectById);
        this.router.put(`${urlConstants_1.URLConstants.URL_PROJECTS}/:id`, this.updateProject);
        this.router.delete(`${urlConstants_1.URLConstants.URL_PROJECTS}/:id`, this.deleteProject);
        this.router.post(`${urlConstants_1.URLConstants.URL_PROJECTS}/dashboards`, this.getDashboardData);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], ProjectController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.ProjectService),
    __metadata("design:type", Object)
], ProjectController.prototype, "iProjectService", void 0);
ProjectController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ProjectController);
exports.ProjectController = ProjectController;
