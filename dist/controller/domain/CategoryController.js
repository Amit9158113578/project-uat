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
exports.CategoryController = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../config/baseIdentifiers");
const urlConstants_1 = require("../../constants/urlConstants");
const baseController_1 = require("../baseController");
const errorCodes_1 = require("../../constants/errorCodes");
const InvalidRequestException_1 = require("../../exception/InvalidRequestException");
// schema
const AddOrUpdateCategorySchema = require('../../schema/category/AddOrUpdateCategorySchema');
let CategoryController = class CategoryController extends baseController_1.BaseController {
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
        this.getCategorysList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.log('CategoryController::getCategoryList - retrieves Category list');
                const listQueryRequest = req.body;
                if (!listQueryRequest.conditions) {
                    listQueryRequest.conditions = [];
                }
                const response = yield this.iCategoryService.getCategoryList(listQueryRequest);
                this.sendResponse(200, response.data, response.totalCount);
            }
            catch (error) {
                this.iLoggerService.error('CategoryController::getCategoryList - Error while retrieving Category list', 400);
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description createCategory
        * @param req {Request} - Express Request -{Category}
        * @param res {Response} - Express Response - success
        * @returns Successfully if Category added
        * @throws ServiceException if failed to add Category
        */
        this.createCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const createCategoryRequest = req.body;
                this.iLoggerService.debug('CategoryController::createCategory -  createCategoryRequest', createCategoryRequest);
                this.validateRequest(createCategoryRequest, AddOrUpdateCategorySchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iCategoryService.createCategory(createCategoryRequest);
                this.iLoggerService.log('CategoryController::createCategory - response', response.data);
                this.sendResponse(201, 'Category created');
            }
            catch (error) {
                this.iLoggerService.error('Error - CategoryController::createCategory - Error while crate Category request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description gets Category by ID
        * @param req {Request} - Express Request - categoryId
        * @param res {Response} - Express Response - Category details
        * @returns  CategoryResponse object is returned
        * @throws InvalidRequestException if Category id is invalid
        */
        this.getCategoryById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                this.iLoggerService.debug('CategoryController::getCategoryById - categoryId', categoryId);
                const CategoryResult = yield this.iCategoryService.getCategoryById(categoryId);
                if (CategoryResult.success) {
                    this.sendResponse(200, CategoryResult.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - CategoryController::getCategoryById - Error while retrieving Category');
                this.sendError(error);
            }
        });
        /**
       * @author <Rohit.L>
       * @description updateCategory
       * @param req {Request} - Express Request -{Category}
       * @param res {Response} - Express Response - success
       * @returns Successfully if Category updated
       * @throws ServiceException if failed to update Category
       */
        this.updateCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateCategoryRequest = req.body;
                const categoryId = req.params.id;
                this.iLoggerService.debug('CategoryController::updateCategory -  updateCategoryRequest', updateCategoryRequest);
                this.validateRequest(updateCategoryRequest, AddOrUpdateCategorySchema, errorCodes_1.ErrorCodes.ERR_API_INVALID_REQUEST);
                const response = yield this.iCategoryService.updateCategory(updateCategoryRequest, categoryId);
                this.iLoggerService.log('CategoryController::updateCategory - response', response.data);
                this.sendResponse(201, 'Category Updated');
            }
            catch (error) {
                this.iLoggerService.error('Error - CategoryController::updateCategory - Error while update Category request');
                this.sendError(error);
            }
        });
        /**
        * @author <Rohit.L>
        * @description deleteCategory
        * @param req {Request} - Express Request - categoryId
        * @param res {Response} - Express Response - Category details
        * @returns  CategoryResponse object is returned
        * @throws InvalidRequestException if Category id is invalid
        */
        this.deleteCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                this.iLoggerService.debug('CategoryController::deleteCategory - categoryId', categoryId);
                const response = yield this.iCategoryService.deleteCategory(categoryId);
                if (response.success) {
                    this.sendResponse(200, response.data);
                }
                else {
                    throw new InvalidRequestException_1.InvalidRequestException([], errorCodes_1.ErrorCodes.ERR_API_INVALID_ID, 400);
                }
            }
            catch (error) {
                this.iLoggerService.error('Error - CategoryController::deleteCategory - Error while delete Category');
                this.sendError(error);
            }
        });
        this.router.post(`${urlConstants_1.URLConstants.URL_CATEGORIES}`, this.createCategory);
        this.router.post(`${urlConstants_1.URLConstants.URL_CATEGORIES}/list`, this.getCategorysList);
        this.router.get(`${urlConstants_1.URLConstants.URL_CATEGORIES}/:id`, this.getCategoryById);
        this.router.put(`${urlConstants_1.URLConstants.URL_CATEGORIES}/:id`, this.updateCategory);
        this.router.delete(`${urlConstants_1.URLConstants.URL_CATEGORIES}/:id`, this.deleteCategory);
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], CategoryController.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.CategoryService),
    __metadata("design:type", Object)
], CategoryController.prototype, "iCategoryService", void 0);
CategoryController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CategoryController);
exports.CategoryController = CategoryController;
