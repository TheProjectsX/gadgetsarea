import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ProductsServices from "./products.services";

const getProductFilters = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.params;
    const result = await ProductsServices.getProductFilters(name);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Filters Retrieved Successfully",
        data: result.data,
    });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductsServices.getProducts(
        req.query as Record<string, string>,
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Products Retrieved Successfully",
        data: result.data,
        pagination: result.pagination,
    });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await ProductsServices.getSingleProduct(productId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Retrieved Successfully",
        data: result.data,
    });
});

export default {
    getProductFilters,
    getProducts,
    getSingleProduct,
};
