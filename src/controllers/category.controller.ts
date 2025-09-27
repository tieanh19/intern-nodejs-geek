import categoryService from '../service/models/category.service';
import sendResponse from '../dto/response/send-response';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../middleware/ApiError';
import { Request, Response } from 'express';
import productService from '../service/models/product.service';

class CategoryController {
    // get categories with pagination
    async getAllCategories(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.size as string) || 10;
            const result = await categoryService.getAllCategory(page, pageSize);
            sendResponse(res, {
                message: 'Lấy danh mục thành công',
                code: StatusCodes.OK,
                result
            });
        } catch (error: any) {
            throw new ApiError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi trong quá trình lấy danh mục');
        }
    }

    // get products by category id with pagination
    async getProductsByCategoryId(req: Request, res: Response) {
        try {
            const categoryId = req.params.id as string;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.size as string) || 10;
            const result = await productService.getProductsByCategories(categoryId, page, pageSize);
            sendResponse(res, {
                message: 'Lấy sản phẩm theo danh mục thành công',
                code: StatusCodes.OK,
                result
            });
        } catch (error: any) {
            throw new ApiError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi trong quá trình lấy sản phẩm theo danh mục');
        }
    }
}
  
export default new CategoryController();