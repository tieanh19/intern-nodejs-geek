import { Request, Response } from 'express';
import productService from '../service/models/product.service';
import sendResponse from '../dto/response/send-response';

class ProductController {
    // get products with pagination
    async getAllProducts(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.size as string) || 10;
        
        const result = await productService.getAllProducts(page, pageSize);
        sendResponse(res, {
            message: 'Lấy sản phẩm thành công',
            code: 200,
            result
        });
    }

    // get product by query search 
    async getProductByQuery(req: Request, res: Response) {
        const query = req.query.q as string || '';
        const result = await productService.getProductByQuery(query);
        sendResponse(res, {
            message: 'Tìm kiếm sản phẩm thành công',
            code: 200,
            result
        });
    }
}

export default new ProductController()