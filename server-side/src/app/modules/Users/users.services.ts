import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../../utils/queryBuilder";
import { ActivityStatus, Prisma } from "@prisma/client";

import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";

const getAllUsers = async (query: Record<string, unknown>) => {
    const queryBuilder = new QueryBuilder<
        typeof prisma.user,
        Prisma.$UserPayload
    >(prisma.user, query).paginate();

    const users = await queryBuilder
        .sort()
        .search(["profile.name", "email"])
        .filter({ exacts: ["status"] })
        .rawFilter({ role: "CUSTOMER" })
        .select({
            id: true,
            email: true,
            status: true,
            verified: true,
            createdAt: true,
            profile: {
                select: {
                    avatar: true,
                    name: true,
                    phone: true,
                },
            },
        })
        .execute();
    const pagination = await queryBuilder.countTotal();

    return {
        data: users,
        pagination,
    };
};

const getSingleUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            status: true,
            verified: true,
            role: true,
            profile: {
                select: {
                    name: true,
                    avatar: true,
                    phone: true,
                },
            },
            createdAt: true,
            customer: {
                select: {
                    _count: {
                        select: {
                            orders: {
                                where: {
                                    status: {
                                        not: "CANCELLED",
                                    },
                                },
                            },
                            carts: true,
                        },
                    },
                    payments: {
                        where: { status: "COMPLETED" },
                        select: {
                            amount: true,
                        },
                    },
                },
            },
        },
    });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found!");
    }

    const data = {
        ...user,
        totalOrders: user.customer?._count.orders,
        totalPayment: user.customer?.payments.reduce(
            (acc, payment) => acc + payment.amount,
            0,
        ),
        totalCarts: user.customer?._count.carts,
        customer: undefined,
    };

    return {
        message: "User retrieved successfully",
        data,
    };
};

const changeUserStatus = async (id: string, status: ActivityStatus) => {
    if (!Object.values(ActivityStatus).includes(status)) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Invalid Status! Use: ${Object.values(ActivityStatus).join(" | ")}`,
        );
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found!");
    }

    if (user.status === status) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `User is already ${status}`,
        );
    }

    await prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });

    return {
        message: "User status updated successfully",
    };
};

const deleteUser = async (id: string): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found!");
    }

    await prisma.user.delete({
        where: {
            id,
        },
    });

    return user;
};

const getUserOrders = async (id: string, query: Record<string, string>) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            customer: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!user?.customer?.id) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

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
        .rawFilter({ customerId: user.customer?.id })
        .execute();

    const pagination = await queryBuilder.countTotal();

    return {
        message: "User orders retrieved successfully",
        data: orders,
        pagination,
    };
};

export default {
    getAllUsers,
    getSingleUser,
    changeUserStatus,
    deleteUser,
    getUserOrders,
};
