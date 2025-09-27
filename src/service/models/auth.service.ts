
import ApiError from '../../middleware/ApiError';
import prisma from '../utils/prisma.service';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { JwtPayloadDto } from '../../dto/request/auth.dto'
import bcrypt from 'bcrypt';

class AuthService {
  async login(username: string, password: string): Promise<{ accessToken: string, refreshToken: string, message: string, user: { username: string, name: string } }> {
    try {
      const user = await prisma.users.findUnique({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Mật khẩu hoặc tài khoản không đúng !');
      }
      const accessToken = jwt.sign({ userId: user.id, type: 'access' } as JwtPayloadDto, process.env.JWT_SECRET!, { expiresIn: '7d' });
      const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' } as JwtPayloadDto, process.env.JWT_SECRET!, { expiresIn: '30d' });
      return {
        accessToken,
        refreshToken,
        user: {
          username: user.username,
          name: user.name,
        },
        message: 'Đăng nhập thành công !',
      };
    } catch (e: any) {
      throw new ApiError(e.status || StatusCodes.INTERNAL_SERVER_ERROR, e.message || 'Đã xảy ra lỗi trong quá trình đăng nhập');
    }
  }
}

export default new AuthService();