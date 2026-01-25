import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import OrdersServices from "./orders.services";
import { UserJwtPayload } from "../../middlewares/cookieAuth";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrdersServices.createOrder(
        req.body,
        req.user as UserJwtPayload,
    );

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Order Created Successfully",
        data: result.data,
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrdersServices.getMyOrders(
        req.query as Record<string, string>,
        req.user as UserJwtPayload,
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Orders Retrieved Successfully",
        data: result.data,
        pagination: result.pagination,
    });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const result = await OrdersServices.getSingleOrder(
        orderId,
        req.user as UserJwtPayload,
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Retrieved Successfully",
        data: result.data,
    });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    await OrdersServices.cancelOrder(orderId, req.user as UserJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Cancelled Successfully",
    });
});

export default {
    createOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder,
};
