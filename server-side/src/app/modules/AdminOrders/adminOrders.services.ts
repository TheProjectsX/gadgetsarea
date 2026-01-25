import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../../utils/queryBuilder";
import config from "../../../config";
import { OrderStatus, Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";

const getAllOrders = async (query: Record<string, unknown>) => {
    const { search = "" } = query;

    const queryBuilder = new QueryBuilder<
        typeof prisma.order,
        Prisma.$OrderPayload
    >(prisma.order, query);

    const orders = await queryBuilder
        .paginate()
        .sort()
        .search(["customer.user.email", "customer.user.profile.name"])
        .filter({ exacts: ["status"] })
        // Customer -> User -> [email +] -> Profile -> [avatar , name , phone]
        .include({
            customer: {
                select: {
                    user: {
                        select: {
                            email: true,
                            profile: {
                                select: {
                                    avatar: true,
                                    name: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            },
            orderItems: {
                select: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: true,
                        },
                    },
                    quantity: true,
                    price: true,
                },
            },
        })
        // OrderItems -> Product -> [name]
        .rawFilter({
            orderItems: {
                some: {
                    product: {
                        name: {
                            contains: search as string,
                            mode: "insensitive",
                        },
                    },
                },
            },
        })
        .execute();
    const pagination = await queryBuilder.countTotal();

    const data = orders.map((order) => ({
        ...order,
        orderItems: order.orderItems.map((item) => ({
            ...item,
            product: {
                id: item.product.id,
                name: item.product.name,
                image: item.product.images[0],
            },
        })),
        customer: {
            name: order.customer?.user.profile?.name,
            email: order.customer?.user.email,
            avatar: order.customer?.user.profile?.avatar,
            phone: order.customer?.user.profile?.phone,
        },
    }));

    return {
        message: "Orders retrieved successfully",
        data,
        pagination,
    };
};

const getSingleOrder = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            id: true,
            status: true,
            totalAmount: true,
            payment: {
                select: {
                    status: true,
                },
            },
            customer: {
                select: {
                    user: {
                        select: {
                            email: true,
                            profile: {
                                select: {
                                    name: true,
                                    phone: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
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
    const data = {
        ...order,
        customer: {
            name: order.customer?.user.profile?.name,
            email: order.customer?.user.email,
            avatar: order.customer?.user.profile?.avatar,
            phone: order.customer?.user.profile?.phone,
        },
    };

    return {
        message: "Order Retrieved Successfully",
        data,
    };
};

const changeOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!Object.values(OrderStatus).includes(status)) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Invalid Status! Use: ${Object.values(OrderStatus).join(" | ")}`,
        );
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Order not Found!");
    }

    if (order.status === status) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Order is already ${status}`,
        );
    }

    await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status,
        },
    });

    return {
        message: "Order status updated successfully",
    };
};

const deleteOrder = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Order not Found!");
    }

    await prisma.order.delete({
        where: {
            id: orderId,
        },
    });

    return {
        message: "Order deleted successfully",
    };
};

export default {
    getAllOrders,
    getSingleOrder,
    changeOrderStatus,
    deleteOrder,
};
