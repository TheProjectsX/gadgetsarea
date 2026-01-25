import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import AdminProductsServices from "./adminProducts.services";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const files = req.files as unknown as string[];

    if (files) {
        payload.images = files;
    }

    const result = await AdminProductsServices.createProduct(payload);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Product Created Successfully",
        data: result.data,
    });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const payload = req.body;
    const files = req.files as unknown as string[];

    if (files) {
        payload.images = [...(payload.images ?? []), ...files];
    }

    await AdminProductsServices.updateProduct(productId, payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Updated Successfully",
    });
});

const insertProductVariations = catchAsync(
    async (req: Request, res: Response) => {
        await AdminProductsServices.insertProductVariations(req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Product Variations Inserted Successfully",
        });
    },
);

const insertProductSpecs = catchAsync(async (req: Request, res: Response) => {
    await AdminProductsServices.insertProductSpecs(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Specs Inserted Successfully",
    });
});

const insertProductDescription = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;

        if (req.file) {
            payload.banner = req.file as unknown as string;
        }

        await AdminProductsServices.insertProductDescription(payload);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Product Description Inserted Successfully",
        });
    },
);

const changeProductStatus = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const payload = req.body;

    await AdminProductsServices.changeProductStatus(productId, payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Status Updated Successfully",
    });
});

const changeProductTags = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const payload = req.body;

    await AdminProductsServices.changeProductTags(productId, payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Status Updated Successfully",
    });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    await AdminProductsServices.deleteProduct(productId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Deleted Successfully",
    });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminProductsServices.getProducts(
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
    const result = await AdminProductsServices.getSingleProduct(productId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product Retrieved Successfully",
        data: result.data,
    });
});

export default {
    createProduct,
    updateProduct,
    insertProductVariations,
    insertProductSpecs,
    insertProductDescription,
    changeProductStatus,
    changeProductTags,
    deleteProduct,
    getProducts,
    getSingleProduct,
};
