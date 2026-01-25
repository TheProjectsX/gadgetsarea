import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import AdminServices from "./admin.services";
import { cookieOptions } from "../../middlewares/cookieAuth";

const getStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.statistics();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Statistics Retrieved Successfully",
        data: result.data,
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.loginWithEmail(req.body);

    res.cookie("access_token", result.data.accessToken, cookieOptions);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Login Successful!",
        data: result.data,
    });
});

export default {
    getStatistics,
    login,
};
