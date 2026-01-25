import { z } from "zod";

const createCategorySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

const updateCategorySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export default {
    createCategorySchema,
    updateCategorySchema,
};
