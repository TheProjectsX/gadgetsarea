import { z } from "zod";

const createCartSchema = z
    .object({
        productId: z.string(),
        quantity: z.number().min(1).optional().default(1),
    })
    .strip();
export type CreateCartInput = z.infer<typeof createCartSchema>;

const updateCartSchema = z
    .object({
        quantity: z.number().min(1),
    })
    .strip();
export type UpdateCartInput = z.infer<typeof updateCartSchema>;

export default {
    createCartSchema,
    updateCartSchema,
};
