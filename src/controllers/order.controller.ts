import { NextFunction, Request, Response } from "express";
import orderService from "../service/models/order.service";
import sendResponse from "../dto/response/send-response";
import { StatusCodes } from "http-status-codes";
import ApiError from "../middleware/ApiError";
import { JwtPayloadDto } from "../dto/request/auth.dto";
import { CreateOrderDto } from "../dto/request/order.dto";

class OrderController {
    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user as JwtPayloadDto;
            const ipAddress = req.ip || req.connection.remoteAddress || '';
            const newOrder = req.body as CreateOrderDto;

            const result = await orderService.createOrder(newOrder, user, ipAddress);
            sendResponse(res, {
                message: 'Tạo đơn hàng thành công',
                code: StatusCodes.CREATED,
                result
            });
        } catch (error: any) {
            next(new ApiError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi trong quá trình tạo đơn hàng'));
        }
    }
    
    //handle vnpay return url
    async verifyOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query;
            const result = await orderService.verifyPayment(query);
            sendResponse(res, {
                message: 'Xác thực đơn hàng thành công',
                code: StatusCodes.OK,
                result
            });
        } catch (error: any) {
            next(new ApiError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi trong quá trình xác thực đơn hàng'));
        }
    }
}

export default new OrderController();