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
exports.JobTitleController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateJobTitleSchema = require('../../schema/jobTitle/AddOrUpdateJobTitleSchema');
let JobTitleController = class JobTitleController extends baseController_1.BaseController {
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
        this.getJobTitlesList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('JobTitleController::getJobTitleList - retrieves JobTitle list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iJobTitleService.getJobTitleList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('JobTitleController::getJobTitleList - Error while retrieving JobTitle list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createJobTitle
        * @param req {Request} - Express Request -{JobTitle}
        * @param res {Response} - Express Response - success
        * @returns Successfully if JobTitle added
        * @throws ServiceException if failed to add JobTitle
        */
        this.createJobTitle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createJobTitleRequest = req.body;
                this.iLoggerService.debug('JobTitleController::createJobTitle -  createJobTitleRequest', createJobTitleRequest);
                this.validateRequest(createJobTitleRequest, AddOrUpdateJobTitleSchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iJobTitleService.createJobTitle(createJobTitleRequest);
                this.iLoggerService.log('JobTitleController::createJobTitle - response', response.data);
                this.sendResponse(201, 'JobTitle created');
            }
            catch (error) {
                this.iLoggerService.error('Error - JobTitleController::createJobTitle - Error while crate JobTitle request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets JobTitle by ID
        * @param req {Request} - Express Request - JobTitleId
        * @param res {Response} - Express Response - JobTitle details
        * @returns  JobTitleResponse object is returned
        * @throws InvalidRequestException if JobTitle id is invalid
        */
        this.getJobTitleById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const JobTitleId = req.params.id;
                this.iLoggerService.debug('JobTitleController::getJobTitleById - JobTitleId', JobTitleId);
                const JobTitleResult = yield this.iJobTitleService.getJobTitleById(JobTitleId);
                if (JobTitleResult.success) {
                    this.sendResponse(200, JobTitleResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - JobTitleController::getJobTitleById - Error while retrieving JobTitle');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateJobTitle
       * @param req {Request} - Express Request -{JobTitle}
       * @param res {Response} - Express Response - success
       * @returns Successfully if JobTitle updated
       * @throws ServiceException if failed to update JobTitle
       */
        this.updateJobTitle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateJobTitleRequest = req.body;
                const JobTitleId = req.params.id;
                this.iLoggerService.debug('JobTitleController::updateJobTitle -  updateJobTitleRequest', updateJobTitleRequest);
                // this.validateRequest(updateJobTitleRequest, AddOrUpdateJobTitleSchema, ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iJobTitleService.updateJobTitle(updateJobTitleRequest, JobTitleId);
                this.iLoggerService.log('JobTitleController::updateJobTitle - response', response.data);
                this.sendResponse(201, 'JobTitle Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - JobTitleController::updateJobTitle - Error while update JobTitle request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteJobTitle
        * @param req {Request} - Express Request - JobTitleId
        * @param res {Response} - Express Response - JobTitle details
        * @returns  JobTitleResponse object is returned
        * @throws InvalidRequestException if JobTitle id is invalid
        */
        this.deleteJobTitle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const JobTitleId = req.params.id;
                this.iLoggerService.debug('JobTitleController::deleteJobTitle - JobTitleId', JobTitleId);
                const response = yield this.iJobTitleService.deleteJobTitle(JobTitleId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - JobTitleController::deleteJobTitle - Error while delete JobTitle');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_JOBTITLES}`, this.createJobTitle);
        this.router.post(`${urlConstants_1.URLConstants.URL_JOBTITLES}/list`, this.getJobTitlesList);
        this.router.get(`${urlConstants_1.URLConstants.URL_JOBTITLES}/:id`, this.getJobTitleById);
        this.router.put(`${urlConstants_1.URLConstants.URL_JOBTITLES}/:id`, this.updateJobTitle);
        this.router.delete(`${urlConstants_1.URLConstants.URL_JOBTITLES}/:id`, this.deleteJobTitle);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], JobTitleController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.JobTitleService),
    __metadata("design:type", Object)
], JobTitleController.prototype, "iJobTitleService", void 0);
JobTitleController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], JobTitleController);
exports.JobTitleController = JobTitleController;
