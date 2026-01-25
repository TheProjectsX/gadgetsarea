import { z } from "zod";

const createOrdersSchema = z
    .object({
        cartIds: z.array(z.string()),
    })
    .strip();
export type CreateOrdersInput = z.infer<typeof createOrdersSchema>;

const updateOrdersSchema = z.object({});
export type UpdateOrdersInput = z.infer<typeof updateOrdersSchema>;

export default {
    createOrdersSchema,
    updateOrdersSchema,
};
