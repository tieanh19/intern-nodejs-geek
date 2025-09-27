import { Router } from 'express';
import orderController from '../controllers/order.controller';
import validateDto from '../middleware/validateDto.midleware';
import { CreateOrderDto } from '../dto/request/order.dto'
import { auth } from '../middleware/auth';

const router = Router();

router.get('/verify', orderController.verifyOrder);

//get orders with pagination
router.use(auth);
router.post('/', validateDto(CreateOrderDto), orderController.createOrder);

export default router;
