import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { CreateCartInput, UpdateCartInput } from "./cart.validations";
import ApiError from "../../../errors/ApiErrors";
import { UserJwtPayload } from "../../middlewares/cookieAuth";

const createCart = async (payload: CreateCartInput, user: UserJwtPayload) => {
    const product = await prisma.product.findUnique({
        where: {
            id: payload.productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    if (product.status === "INACTIVE") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Product is inactive");
    }

    if (product.stock === 0 || product.availability === "OUT_OF_STOCK") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Product is out of stock");
    }

    if (product.stock < payload.quantity) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Only ${product.stock} items are available in stock`,
        );
    }

    const result = await prisma.cart.create({
        data: {
            ...payload,
            customerId: user.customerId!,
        },
    });

    return result;
};

const getAllCarts = async (user: UserJwtPayload) => {
    const cartItems = await prisma.cart.findMany({
        where: {
            customerId: user.customerId!,
        },
        select: {
            id: true,
            product: {
                select: {
                    id: true,
                    images: true,
                    name: true,
                    price: true,
                    purchasePrice: true,
                    stock: true,
                },
            },
            quantity: true,
        },
    });

    return {
        message: "Cart Items Retrieved Successfully",
        data: cartItems,
    };
};

// Why will we need to get single Cart? I don't think we need!

const updateCart = async (
    cartId: string,
    payload: UpdateCartInput,
    user: UserJwtPayload,
) => {
    const cart = await prisma.cart.findUnique({
        where: {
            id: cartId,
            customerId: user.customerId,
        },
    });

    if (!cart) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart item not found");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: cart.productId,
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    if (product.status === "INACTIVE") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Product is inactive");
    }

    if (product.stock === 0 || product.availability === "OUT_OF_STOCK") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Product is out of stock");
    }

    if (product.stock < payload.quantity) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Only ${product.stock} items are available in stock`,
        );
    }

    await prisma.cart.update({
        where: {
            id: cartId,
        },
        data: payload,
    });

    return { message: "Cart Item Updated Successfully" };
};

const deleteCart = async (cartId: string, user: UserJwtPayload) => {
    const cart = await prisma.cart.findUnique({
        where: {
            id: cartId,
            customerId: user.customerId,
        },
    });

    if (!cart) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart item not found");
    }

    const result = await prisma.cart.delete({
        where: {
            id: cartId,
            customerId: user.customerId,
        },
    });

    return result;
};

export default {
    createCart,
    getAllCarts,
    updateCart,
    deleteCart,
};
