import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../../utils/queryBuilder";
import { Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { UserJwtPayload } from "../../middlewares/cookieAuth";
import { CreateOrdersInput } from "./orders.validations";
import stripe from "../../../helpers/stripe/stripe";
import config from "../../../config";

const createOrder = async (
    payload: CreateOrdersInput,
    user: UserJwtPayload,
) => {
    const cartItems = await prisma.cart.findMany({
        where: {
            id: {
                in: payload.cartIds,
            },
            customerId: user.customerId,
        },
        include: {
            product: true,
        },
    });

    if (cartItems.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart item(s) not found");
    }

    const totalAmount = cartItems.reduce((sum, item) => {
        if (item.product.stock < item.quantity) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                `Only ${item.product.stock} items are available in stock for product ${item.product.name}`,
            );
        }
        return sum + item.quantity * item.product.purchasePrice;
    }, 0);

    const orderResult = await prisma.$transaction(async (transactionClient) => {
        const order = await transactionClient.order.create({
            data: {
                customerId: user.customerId!,
                totalAmount: totalAmount,
                orderItems: {
                    createMany: {
                        data: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.purchasePrice * item.quantity,
                        })),
                    },
                },
            },
        });

        for (const item of cartItems) {
            await transactionClient.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        const res = await transactionClient.cart.deleteMany({
            where: {
                id: {
                    in: payload.cartIds,
                },
                customerId: user.customerId,
            },
        });
        console.log(res);

        return order;
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item) => ({
            price_data: {
                currency: "bdt",
                product_data: {
                    name: item.product.name,
                },
                unit_amount: item.product.purchasePrice * item.quantity * 100,
            },
            quantity: item.quantity,
        })),
        mode: "payment",
        allow_promotion_codes: true,
        success_url: `${config.url.frontend}/success`,
        cancel_url: `${config.url.frontend}/cancel`,
        customer_email: user.email,
        metadata: {
            userId: user.id,
            email: user.email,
            customerId: user.customerId!,
            orderId: orderResult.id,
        },
    });

    return {
        message: "Order Created Successfully",
        data: {
            url: session.url,
        },
    };
};

const getMyOrders = async (
    query: Record<string, string>,
    user: UserJwtPayload,
) => {
    const queryBuilder = new QueryBuilder<
        typeof prisma.order,
        Prisma.$OrderPayload
    >(prisma.order, query);

    const orders = await queryBuilder
        .sort()
        .paginate()
        .select({
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            orderItems: {
                select: {
                    quantity: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                },
            },
        })
        .rawFilter({ customerId: user.customerId })
        .execute();

    const pagination = await queryBuilder.countTotal();

    return {
        message: "Orders Retrieved Successfully",
        data: orders,
        pagination,
    };
};

// Do we need this? Maybe to show extra data?
const getSingleOrder = async (orderId: string, user: UserJwtPayload) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
            customerId: user.customerId,
        },
        select: {
            status: true,
            totalAmount: true,
            payment: {
                select: {
                    status: true,
                },
            },
            orderItems: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: true,
                            price: true,
                            purchasePrice: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
    }

    const formattedItems = order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product,
    }));

    const data = {
        status: order.status,
        paymentStatus: order.payment?.status,
        totalAmount: order.totalAmount,
        items: formattedItems,
    };

    return {
        message: "Order Retrieved Successfully",
        data,
    };
};

const cancelOrder = async (orderId: string, user: UserJwtPayload) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
            customerId: user.customerId,
        },
    });

    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
    }

    if (order.status !== "PENDING") {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only pending orders can be cancelled",
        );
    }

    await prisma.$transaction(async (transactionClient) => {
        const cancelledOrder = await transactionClient.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: "CANCELLED",
            },
        });

        const orderItems = await transactionClient.orderItem.findMany({
            where: {
                orderId: orderId,
            },
        });

        for (const item of orderItems) {
            await transactionClient.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    stock: {
                        increment: item.quantity,
                    },
                },
            });
        }

        return cancelledOrder;
    });

    return {
        message: "Order Cancelled Successfully",
    };
};

export default { createOrder, getMyOrders, getSingleOrder, cancelOrder };
