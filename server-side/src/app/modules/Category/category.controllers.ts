import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import CategoryServices from "./category.services";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryServices.createCategory(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Category Created Successfully",
        data: result.data,
    });
});

const getAllAdminCategories = catchAsync(
    async (req: Request, res: Response) => {
        const result = await CategoryServices.getAllAdminCategories(
            req.query as Record<string, string>,
        );

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Categories Retrieved Successfully",
            data: result.data,
        });
    },
);

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryServices.getAllCategories();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Categories Retrieved Successfully",
        data: result.data,
    });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await CategoryServices.getSingleCategory(categoryId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Retrieved Successfully",
        data: result.data,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await CategoryServices.updateCategory(categoryId, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Updated Successfully",
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await CategoryServices.deleteCategory(categoryId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Deleted Successfully",
    });
});

const toggleCategoryStatus = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await CategoryServices.toggleCategoryStatus(categoryId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Status Updated Successfully",
        data: result.data,
    });
});

export default {
    createCategory,
    getAllAdminCategories,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
};
