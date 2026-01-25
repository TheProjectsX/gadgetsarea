import { CookieOptions, NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@prisma/client";

export type UserJwtPayload = {
    id: string;
    email: string;
    role: UserRole;
    customerId?: string;
};

export const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
} satisfies CookieOptions;

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { access_token = "" } = req.cookies;

        try {
            const decrypted = jwtHelpers.verifyToken(
                access_token,
                config.jwt.jwt_secret as Secret,
            );

            const user = await prisma.user.findUnique({
                where: {
                    email: decrypted.email,
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    customer: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            if (!user) {
                throw new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "You are not authorized!",
                );
            }

            if (user.status !== "ACTIVE") {
                throw new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "You are not authorized!",
                );
            }

            if (roles.length && !roles.includes(user.role)) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
            }

            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                customerId: user.customer?.id,
            } as UserJwtPayload;

            next();
        } catch (error) {
            console.error(error);
            res.clearCookie("access_token", cookieOptions)
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: false,
                    message: "You are not authorized!",
                    status_code: StatusCodes.UNAUTHORIZED,
                });
        }
    };
};
export default auth;
