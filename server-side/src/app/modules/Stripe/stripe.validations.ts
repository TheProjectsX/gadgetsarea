import { z } from "zod";

const createStripeSchema = z.object({});
export type CreateStripeInput = z.infer<typeof createStripeSchema>;

const updateStripeSchema = z.object({});
export type UpdateStripeInput = z.infer<typeof updateStripeSchema>;

export default {
    createStripeSchema,
    updateStripeSchema,
};
