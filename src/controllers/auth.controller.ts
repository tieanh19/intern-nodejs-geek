import { Request, Response } from 'express';
import authService from '../service/models/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import sendResponse from '../dto/response/send-response';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.data;
    const result = await authService.login(username, password)
    sendResponse(res, {
      code: StatusCodes.OK,
      message: result.message,
      result: result
    })
  }
}

export default new AuthController();