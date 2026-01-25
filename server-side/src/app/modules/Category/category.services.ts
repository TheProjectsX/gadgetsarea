import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "./category.validations";
import ApiError from "../../../errors/ApiErrors";

// In Git, commit: 385855bcdf5b027ff3059939a9ed99d84e8470dc has the sub category routes

const createCategory = async (payload: CreateCategoryInput) => {
    const category = await prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (category) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "Category with this name already exists!",
        );
    }

    const result = await prisma.category.create({
        data: payload,
    });

    return {
        message: "Category Created Successfully",
        data: result,
    };
};

const getAllAdminCategories = async (query: Record<string, string>) => {
    const categories = await prisma.category.findMany({
        where: {
            ...(query.active && {
                active: query.active === "true" ? true : false,
            }),
        },
        omit: {
            createdAt: true,
            updatedAt: true,
        },
    });

    return {
        message: "Categories Retrieved Successfully",
        data: categories,
    };
};

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        where: {
            active: true,
        },
        omit: {
            createdAt: true,
            updatedAt: true,
        },
    });

    return {
        message: "Categories Retrieved Successfully",
        data: categories,
    };
};

const getSingleCategory = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Category Not Found!");
    }

    return {
        message: "Category Retrieved Successfully",
        data: category,
    };
};

const updateCategory = async (
    categoryId: string,
    payload: UpdateCategoryInput,
) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Category Not Found!");
    }

    const result = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: payload,
    });

    return {
        message: "Category Updated Successfully",
        data: result,
    };
};

const deleteCategory = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Category Not Found!");
    }

    const result = await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });

    return {
        message: "Category Deleted Successfully",
        data: result,
    };
};

const toggleCategoryStatus = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Category Not Found!");
    }

    const result = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            active: !category.active,
        },
    });

    return {
        message: "Category Status Updated Successfully",
        data: {
            active: result.active,
        },
    };
};

export default {
    createCategory,
    getAllAdminCategories,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
};
