import { Prisma, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import { hashPassword } from "../../helpers/passwordHelpers";

export const initiateSuperAdmin = async () => {
    const payload = {
        name: "Admin",
        phone: "12345678",
        email: "admin@example.com",
        password: "123456",
        role: UserRole.ADMIN,
    };

    const existingSuperAdmin = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (existingSuperAdmin) {
        return;
    }

    await prisma.$transaction(async (TX: Prisma.TransactionClient) => {
        const hashedPassword: string = await hashPassword(payload.password);

        await TX.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                role: "ADMIN",
                profile: {
                    create: {
                        name: payload.name,
                        phone: payload.phone,
                    },
                },
            },
        });
    });
};
