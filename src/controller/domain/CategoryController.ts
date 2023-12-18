import { inject, injectable } from 'inversify';
import { BaseIdentifiers } from '../../config/baseIdentifiers';
import { URLConstants } from '../../constants/urlConstants';
import { ILoggerService } from '../../service/util/iLoggerService';
import { ListQueryRequest } from '../../types/request';
import { BaseController } from '../baseController';
import { Request, Response } from 'express';
import { ErrorCodes } from '../../constants/errorCodes';
import { InvalidRequestException } from '../../exception/InvalidRequestException';
import { ICategoryService } from '../../service/domain/ICategoryService';
import { Category } from '../../types/entity';

// schema
const AddOrUpdateCategorySchema = require('../../schema/category/AddOrUpdateCategorySchema');

@injectable()
export class CategoryController extends BaseController {
    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.CategoryService)
    private iCategoryService: ICategoryService;

    constructor() {
        super();
        this.router.post(`${URLConstants.URL_CATEGORIES}`, this.createCategory);
        this.router.post(`${URLConstants.URL_CATEGORIES}/list`, this.getCategorysList);
        this.router.get(`${URLConstants.URL_CATEGORIES}/:id`, this.getCategoryById);
        this.router.put(`${URLConstants.URL_CATEGORIES}/:id`, this.updateCategory);
        this.router.delete(`${URLConstants.URL_CATEGORIES}/:id`, this.deleteCategory);
    }

    /**
     * @author <Rohit.L>
     * @description API - Get Invoice's list
     * @param req {Request} - Express Request - invoice list
     * @param res {Response} - Express Response - success result - invoice list by oragnization id
     * @returns 200 if invoice's list is returned
     * @throws InvalidRequestException if request is invalid
     */
    private getCategorysList = async (req: Request, res: Response) => {
        try {
            this.iLoggerService.log('CategoryController::getCategoryList - retrieves Category list');
            const listQueryRequest = req.body as ListQueryRequest;
            if (!listQueryRequest.conditions) {
                listQueryRequest.conditions = [];
            }
            const response = await this.iCategoryService.getCategoryList(listQueryRequest);
            this.sendResponse(200, response.data, response.totalCount);
        } catch (error) {
            this.iLoggerService.error('CategoryController::getCategoryList - Error while retrieving Category list', 400);
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description createCategory
    * @param req {Request} - Express Request -{Category}
    * @param res {Response} - Express Response - success
    * @returns Successfully if Category added
    * @throws ServiceException if failed to add Category
    */
    private createCategory = async (req: Request, res: Response) => {
        try {
            const createCategoryRequest: Category = req.body;
            this.iLoggerService.debug('CategoryController::createCategory -  createCategoryRequest', createCategoryRequest);
            this.validateRequest(createCategoryRequest, AddOrUpdateCategorySchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iCategoryService.createCategory(createCategoryRequest);
            this.iLoggerService.log('CategoryController::createCategory - response', response.data);
            this.sendResponse(201, 'Category created');
        } catch (error) {
            this.iLoggerService.error('Error - CategoryController::createCategory - Error while crate Category request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description gets Category by ID
    * @param req {Request} - Express Request - categoryId
    * @param res {Response} - Express Response - Category details
    * @returns  CategoryResponse object is returned
    * @throws InvalidRequestException if Category id is invalid
    */
    private getCategoryById = async (req: Request, res: Response) => {
        try {
            const categoryId: string = req.params.id;
            this.iLoggerService.debug('CategoryController::getCategoryById - categoryId', categoryId);
            const CategoryResult = await this.iCategoryService.getCategoryById(categoryId);
            if (CategoryResult.success) {
                this.sendResponse(200, CategoryResult.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - CategoryController::getCategoryById - Error while retrieving Category');
            this.sendError(error);
        }
    }

    /**
   * @author <Rohit.L>
   * @description updateCategory
   * @param req {Request} - Express Request -{Category}
   * @param res {Response} - Express Response - success
   * @returns Successfully if Category updated
   * @throws ServiceException if failed to update Category
   */
    private updateCategory = async (req: Request, res: Response) => {
        try {
            const updateCategoryRequest: Category = req.body;
            const categoryId = req.params.id;
            this.iLoggerService.debug('CategoryController::updateCategory -  updateCategoryRequest', updateCategoryRequest);
            this.validateRequest(updateCategoryRequest, AddOrUpdateCategorySchema, ErrorCodes.ERR_API_INVALID_REQUEST);
            const response = await this.iCategoryService.updateCategory(updateCategoryRequest, categoryId);
            this.iLoggerService.log('CategoryController::updateCategory - response', response.data);
            this.sendResponse(201, 'Category Updated');
        } catch (error) {
            this.iLoggerService.error('Error - CategoryController::updateCategory - Error while update Category request');
            this.sendError(error);
        }
    }

    /**
    * @author <Rohit.L>
    * @description deleteCategory
    * @param req {Request} - Express Request - categoryId
    * @param res {Response} - Express Response - Category details
    * @returns  CategoryResponse object is returned
    * @throws InvalidRequestException if Category id is invalid
    */
    private deleteCategory = async (req: Request, res: Response) => {
        try {
            const categoryId: string = req.params.id;
            this.iLoggerService.debug('CategoryController::deleteCategory - categoryId', categoryId);
            const response = await this.iCategoryService.deleteCategory(categoryId);
            if (response.success) {
                this.sendResponse(200, response.data);
            } else {
                throw new InvalidRequestException([], ErrorCodes.ERR_API_INVALID_ID, 400);
            }
        } catch (error) {
            this.iLoggerService.error('Error - CategoryController::deleteCategory - Error while delete Category');
            this.sendError(error);
        }
    }
}
