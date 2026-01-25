import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { comparePassword } from "../../../helpers/passwordHelpers";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";

export const statistics = async () => {
    const [
        totalCustomers,
        totalOrders,
        totalPayments,
        totalProducts,
        totalCategories,
    ] = await Promise.all([
        prisma.user.count({
            where: {
                role: "CUSTOMER",
                verified: true,
            },
        }),
        prisma.order.findMany({
            where: {
                status: {
                    not: "CANCELLED",
                },
            },
        }),
        prisma.payment.findMany({
            where: {
                status: "COMPLETED",
            },
            select: {
                amount: true,
            },
        }),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.category.count({ where: { active: true } }),
    ]);

    const data = {
        totalCustomers,
        totalOrders: totalOrders.length,
        totalIncome: totalPayments.reduce(
            (acc, payment) => acc + payment.amount,
            0,
        ),
        totalProducts,
        totalCategories,
    };

    return {
        message: "Admin statistics retrieved successfully",
        data,
    };
};

const loginWithEmail = async (payload: { email: string; password: string }) => {
    const userData = await prisma.user.findUnique({
        where: {
            email: payload.email,
            role: "ADMIN",
        },
        include: { profile: true },
    });
    if (!userData) {
        throw new ApiError(400, "Invalid Credentials");
    }

    if (!payload.password || !userData?.password) {
        throw new Error("Password is required");
    }

    const isCorrectPassword = await comparePassword(
        payload.password,
        userData.password,
    );

    if (!isCorrectPassword) {
        throw new ApiError(400, "Invalid Credentials");
    }

    if (userData.status === "INACTIVE")
        throw new ApiError(StatusCodes.FORBIDDEN, "This account is Inactive");

    const accessToken = jwtHelpers.generateToken(
        {
            id: userData.id,
            email: userData.email,
            role: userData.role,
        },
        config.jwt.jwt_secret as Secret,
        config.jwt.jwt_secret_expires_in as string,
    );

    const refreshToken = jwtHelpers.generateToken(
        {
            id: userData.id,
            email: userData.email,
            role: userData.role,
        },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string,
    );

    return {
        message: "Login successful",
        data: {
            refreshToken,
            accessToken,
            user: {
                email: userData.email,
                name: userData.profile?.name,
                avatar: userData.profile?.avatar,
            },
        },
    };
};

export default {
    statistics,
    loginWithEmail,
};
