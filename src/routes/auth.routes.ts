import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validateDto from '../middleware/validateDto.midleware';
import { LoginDto } from '../dto/request/auth.dto';

const router = Router();

// Đăng nhập
router.post('/', validateDto(LoginDto), authController.login);

export default router;
