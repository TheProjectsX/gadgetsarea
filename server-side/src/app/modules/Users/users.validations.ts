import { z } from "zod";

const createUsersSchema = z.object({});
export type CreateUsersInput = z.infer<typeof createUsersSchema>;

const updateUsersSchema = z.object({});
export type UpdateUsersInput = z.infer<typeof updateUsersSchema>;

export default {
    createUsersSchema,
    updateUsersSchema,
};
