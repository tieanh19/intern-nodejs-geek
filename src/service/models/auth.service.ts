
import ApiError from '../../middleware/ApiError';
import prisma from '../prisma.service';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

class AuthService {
  async login(username: string, password: string): Promise<{ accessToken: string, refreshToken: string, message: string, user: { username: string, name: string } }> {
    try {
      const user = await prisma.users.findUnique({ where: { username } });
      if (!user || !(password === user.password)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Mật khẩu hoặc tài khoản không đúng !');
      }
      const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
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