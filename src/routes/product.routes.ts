import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

// get products with pagination
router.get('/', productController.getAllProducts);

export default router;
