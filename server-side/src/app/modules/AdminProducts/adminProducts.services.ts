import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import {
    CreateProductsInput,
    ProductDescriptionInput,
    ProductSpecsInput,
    ProductVariationsInput,
    UpdateProductsInput,
} from "./adminProducts.validations";
import QueryBuilder from "../../../utils/queryBuilder";
import { Prisma, ProductTag } from "@prisma/client";

// * ========== Admin Functions Start ==========
// Create Product
const createProduct = async (payload: CreateProductsInput) => {
    const result = await prisma.product.create({
        data: payload,
    });

    return {
        message: "Product Created successfully",
        data: {
            id: result.id,
        },
    };
};

// Update Product
const updateProduct = async (
    productId: string,
    payload: UpdateProductsInput,
) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    await prisma.product.update({
        where: {
            id: productId,
        },
        data: payload,
    });

    return {
        message: "Product Updated successfully",
    };
};

// Upsert Product Variations
const insertProductVariations = async (payload: ProductVariationsInput) => {
    // Delete all variations
    await prisma.variation.deleteMany({
        where: {
            productId: payload.productId,
        },
    });

    await prisma.variation.createMany({
        data: payload.data.map((item) => ({
            ...item,
            productId: payload.productId,
        })),
    });

    return {
        message: "Product Variations Insert Successful",
    };
};

// Upsert Product Specs - Array
const insertProductSpecs = async (payload: ProductSpecsInput) => {
    const product = await prisma.product.findUnique({
        where: {
            id: payload.productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    const response = await prisma.specs.upsert({
        where: {
            productId: product.id,
        },
        update: { data: payload.data },
        create: {
            productId: product.id,
            data: payload.data,
        },
    });

    return {
        message: "Product Specs Insert Successful",
    };
};

// Upsert Product Description
const insertProductDescription = async (payload: ProductDescriptionInput) => {
    const product = await prisma.product.findUnique({
        where: {
            id: payload.productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    await prisma.description.upsert({
        where: {
            productId: product.id,
        },
        update: {
            banner: payload.banner,
            content: payload.content,
            video: payload.video,
        },
        create: {
            ...payload,
        },
    });

    if (product.status === "DRAFT") {
        await prisma.product.update({
            where: { id: payload.productId },
            data: { status: "INACTIVE" },
        });
    }

    return {
        message: "Product Description Insert Successful",
    };
};

// Change product Status
const changeProductStatus = async (
    productId: string,
    { status }: { status: "ACTIVE" | "INACTIVE" },
) => {
    if (status !== "ACTIVE" && status !== "INACTIVE") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Status Value!");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            status,
        },
    });

    return {
        message: "Product Status Updated Successfully",
    };
};

const changeProductTags = async (
    productId: string,
    { tags }: { tags: ProductTag[] },
) => {
    if (tags.some((tag) => !Object.values(ProductTag).includes(tag))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Tag Detected!");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            tags,
        },
    });

    return {
        message: "Product Tags Updated Successfully",
    };
};

// Delete Product
const deleteProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    await prisma.product.delete({
        where: {
            id: productId,
        },
    });

    return {
        message: "Product Deleted Successfully",
    };
};

const getProducts = async (query: Record<string, string>) => {
    const { sortBy, tag, ...restQuery } = query;

    const queryBuilder = new QueryBuilder<
        typeof prisma.product,
        Prisma.$ProductPayload
    >(prisma.product, restQuery);

    const products = await queryBuilder
        .search(["name", "brand", "brand"])
        .sort()
        .range([
            {
                field: "purchasePrice",
                type: "number",
                startKey: "minPrice",
                endKey: "maxPrice",
            },
        ])
        .select({
            id: true,
            images: true,
            name: true,
            price: true,
            purchasePrice: true,
            category: { select: { id: true, name: true } },
            status: true,
            availability: true,
            stock: true,
            tags: true,
        })
        .rawFilter({
            ...(tag && {
                tags: {
                    has: tag as ProductTag,
                },
            }),
        })
        .filter({ exacts: ["status", "availability"] })
        .paginate()
        .execute();

    const pagination = await queryBuilder.countTotal();

    return {
        message: "Products Retrieved Successfully",
        data: products,
        pagination,
    };
};

const getSingleProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            variations: {
                omit: {
                    productId: true,
                },
            },
            specs: {
                omit: {
                    productId: true,
                },
            },
            description: {
                omit: {
                    productId: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    return {
        message: "Product Retrieved Successfully",
        data: { ...product, specs: product.specs?.data },
    };
};

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
