import { z } from "zod";

const userProfileUpdateSchema = z
    .object({
        name: z.string().optional(),
        phone: z.string().optional(),
        description: z.string().optional(),
    })
    .strip();
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema> & {
    avatar?: string;
};

export default {
    userProfileUpdateSchema,
};
