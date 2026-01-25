import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import UsersServices from "./users.services";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UsersServices.getAllUsers(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UsersServices.getSingleUser(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrieved successfully",
        data: result.data,
    });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    await UsersServices.changeUserStatus(id, status);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User status updated successfully",
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await UsersServices.deleteUser(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User deleted successfully",
    });
});

const getUserOrders = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UsersServices.getUserOrders(
        id,
        req.query as Record<string, string>,
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User orders retrieved successfully!",
        data: result.data,
    });
});

export default {
    getAllUsers,
    getSingleUser,
    changeUserStatus,
    deleteUser,
    getUserOrders,
};
