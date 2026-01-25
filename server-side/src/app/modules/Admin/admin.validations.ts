import { z } from "zod";

const createAdminSchema = z.object({});
export type CreateAdminInput = z.infer<typeof createAdminSchema>;

const updateAdminSchema = z.object({});
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;

export default {
    createAdminSchema,
    updateAdminSchema,
};
