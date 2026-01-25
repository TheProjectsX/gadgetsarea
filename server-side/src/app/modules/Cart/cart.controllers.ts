import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import CartServices from "./cart.services";
import { UserJwtPayload } from "../../middlewares/cookieAuth";

const createCart = catchAsync(async (req: Request, res: Response) => {
    await CartServices.createCart(req.body, req.user as UserJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Product Added to Cart Successfully",
    });
});

const getAllCarts = catchAsync(async (req: Request, res: Response) => {
    const result = await CartServices.getAllCarts(req.user as UserJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart Items Retrieved Successfully",
        data: result.data,
    });
});

const updateCart = catchAsync(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    await CartServices.updateCart(cartId, req.body, req.user as UserJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart Item Updated Successfully",
    });
});

const deleteCart = catchAsync(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    await CartServices.deleteCart(cartId, req.user as UserJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart Item Deleted Successfully",
    });
});

export default {
    createCart,
    getAllCarts,
    updateCart,
    deleteCart,
};
