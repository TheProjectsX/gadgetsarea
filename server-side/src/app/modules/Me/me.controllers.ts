import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import UsersServices from "./me.services";
import { UserJwtPayload } from "../../middlewares/cookieAuth";
import ApiError from "../../../errors/ApiErrors";

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UsersServices.getCurrentUser(
        req.user as UserJwtPayload,
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Current User Retrieved Successfully",
        data: result.data,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    if (req.file) {
        payload.avatar = req.file.filename;
    }

    await UsersServices.updateProfile(payload, req.user as UserJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Profile Updated Successfully",
    });
});

const updateAvatar = catchAsync(async (req: Request, res: Response) => {
    const file = req.file as unknown as string | null;

    if (!file) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Avatar is required!");
    }

    await UsersServices.updateProfile(
        { avatar: file },
        req.user as UserJwtPayload,
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Avatar Updated Successfully",
    });
});

export default {
    getCurrentUser,
    updateProfile,
    updateAvatar,
};
