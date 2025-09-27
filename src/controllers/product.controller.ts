import { Request, Response } from 'express';
import productService from '../service/models/product.service';

class ProductController {
    // get products with pagination
    async getAllProducts(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.size as string) || 10;
        
        const result = await productService.getAllProducts(page, pageSize);
        res.status(200).json({
            message: 'Lấy sản phẩm thành công',
            code: 200,
            result
        });
    }
}

export default new ProductController();