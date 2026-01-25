import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import AdminOrdersServices from "./adminOrders.services";

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminOrdersServices.getAllOrders(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Orders Retrieved Successfully",
        data: result.data,
        pagination: result.pagination,
    });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminOrdersServices.getSingleOrder(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Retrieved Successfully",
        data: result.data,
    });
});

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    await AdminOrdersServices.changeOrderStatus(id, status);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order status updated successfully",
    });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminOrdersServices.deleteOrder(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order deleted successfully",
    });
});

export default {
    getAllOrders,
    getSingleOrder,
    changeOrderStatus,
    deleteOrder,
};
