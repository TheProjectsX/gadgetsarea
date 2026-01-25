import { ProductAvailability, ProductStatus, ProductTag } from "@prisma/client";
import { z } from "zod";

const createProductsSchema = z
    .object({
        name: z.string(),
        price: z.number(),
        purchasePrice: z.number(),
        brand: z.string().optional(),
        availability: z
            .enum(ProductAvailability)
            .default("IN_STOCK")
            .optional(),
        categoryId: z.string(),
        stock: z.number().optional().default(0),
    })
    .strip();
export type CreateProductsInput = z.infer<typeof createProductsSchema>;

const updateProductsSchema = z
    .object({
        name: z.string().optional(),
        price: z.number().optional(),
        images: z.array(z.string()).optional(),
        purchasePrice: z.number().optional(),
        brand: z.string().optional(),
        stock: z.number().optional(),
        status: z.enum(ProductStatus).optional(),
        availability: z.enum(ProductAvailability).optional(),
        tags: z.array(z.enum(ProductTag)).optional(),
    })
    .strip();
export type UpdateProductsInput = z.infer<typeof updateProductsSchema>;

const productVariationsSchema = z
    .object({
        productId: z.string(),
        data: z.array(
            z.object({
                id: z.string().optional(),
                name: z.string(),
                values: z.array(z.string()),
            }),
        ),
    })
    .strip();
export type ProductVariationsInput = z.infer<typeof productVariationsSchema>;

const productSpecsSchema = z
    .object({
        productId: z.string(),
        data: z.array(z.object({ name: z.string(), value: z.string() })),
    })
    .strip();
export type ProductSpecsInput = z.infer<typeof productSpecsSchema>;

const productDescriptionSchema = z
    .object({
        productId: z.string(),
        banner: z.string().optional(),
        content: z.string(),
        video: z.string().optional(),
    })
    .strip();
export type ProductDescriptionInput = z.infer<typeof productDescriptionSchema>;

export default {
    createProductsSchema,
    updateProductsSchema,
    productVariationsSchema,
    productSpecsSchema,
    productDescriptionSchema,
};
