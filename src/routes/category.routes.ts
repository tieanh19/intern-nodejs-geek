import { Router } from 'express';
import categoryController from '../controllers/category.controller';

const router = Router();

//get categories with pagination
router.get('/', categoryController.getAllCategories);

// get products by category id with pagination
router.get('/:id/products', categoryController.getProductsByCategoryId);

export default router;
