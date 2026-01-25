import { CookieOptions, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.services";
import config from "../../../config";
import { UserJwtPayload } from "../../middlewares/cookieAuth";
import { cookieOptions } from "../../middlewares/cookieAuth";

const register = catchAsync(async (req: Request, res: Response) => {
    await AuthServices.register(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Registration Successful!",
    });
});

const loginWithEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginWithEmail(req.body);

    res.cookie("access_token", result.data.accessToken, cookieOptions);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Login Successful!",
        data: result.data,
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    // Clear the token cookie
    res.clearCookie("access_token", cookieOptions);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Logout successful",
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as UserJwtPayload;

    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const result = await AuthServices.refreshToken(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
        data: result.data,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    const result = await AuthServices.resetPassword(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result.message,
    });
});

export const AuthController = {
    loginWithEmail,
    logoutUser,
    changePassword,
    forgotPassword,
    resetPassword,
    register,
    refreshToken,
};
