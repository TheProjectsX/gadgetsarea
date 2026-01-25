import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { UserJwtPayload } from "../../middlewares/cookieAuth";
import { UserProfileUpdateInput } from "./me.validations";
import ApiError from "../../../errors/ApiErrors";

// Get Me (/users/me - Current User Profile)
const getCurrentUser = async (userInfo: UserJwtPayload) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userInfo.id,
        },
        select: {
            id: true,
            email: true,
            status: true,
            verified: true,
            role: true,
            createdAt: true,
            profile: {
                select: {
                    name: true,
                    avatar: true,
                    phone: true,
                },
            },
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

    const userData = {
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
        message: "User profile fetched successfully",
        data: userData,
    };
};

// Update Profile Info
const updateProfile = async (
    payload: UserProfileUpdateInput,
    user: UserJwtPayload,
) => {
    const profile = await prisma.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!profile) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Profile not found");
    }

    const updatedProfile = await prisma.profile.update({
        where: {
            userId: user.id,
        },
        data: payload,
    });

    return {
        message: "User profile updated successfully",
        data: updatedProfile,
    };
};

export default {
    getCurrentUser,
    updateProfile,
};
