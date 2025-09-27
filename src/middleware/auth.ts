import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../middleware/ApiError';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) 
    throw new ApiError(401, 'Thiếu token xác thực');
  try {
    const payload = jwt.verify(hdr.split(' ')[1], process.env.JWT_SECRET!) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    return next(new ApiError(401, 'Token không hợp lệ'));
  }
};
