import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../../utils/queryBuilder";
import { Prisma, ProductAvailability, ProductTag } from "@prisma/client";

// Get Product Filters by Sub Category
const getProductFilters = async (name: string) => {
    const category = await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
        select: {
            products: {
                select: {
                    brand: true,
                    price: true,
                    purchasePrice: true,
                    availability: true,
                },
            },
        },
    });

    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Category Not Found!");
    }

    const filters = {
        brands: [] as string[],
        price: {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        availability: [] as string[],
    };

    category.products.forEach((product) => {
        if (product.brand && !filters.brands.includes(product.brand)) {
            filters.brands.push(product.brand);
        }

        if (product.purchasePrice < filters.price.min) {
            filters.price.min = product.purchasePrice;
        }

        if (product.purchasePrice > filters.price.max) {
            filters.price.max = product.purchasePrice;
        }

        if (
            product.availability &&
            !filters.availability.includes(product.availability)
        ) {
            filters.availability.push(product.availability);
        }
    });

    return {
        message: "Product Filters Retrieved Successfully",
        data: filters,
    };
};

// Get Products with Filter
const getProducts = async (query: Record<string, string>) => {
    const { sortBy, tag, category, brands, availability, ...restQuery } = query;

    const queryBuilder = new QueryBuilder<
        typeof prisma.product,
        Prisma.$ProductPayload
    >(prisma.product, restQuery);

    const products = await queryBuilder
        .search(["name", "brand"])
        .sortBy({
            purchasePrice: sortBy === "low_to_high" ? "asc" : "desc",
        })
        .range([
            {
                field: "purchasePrice",
                type: "number",
                startKey: "minPrice",
                endKey: "maxPrice",
            },
        ])
        .select({
            id: true,
            images: true,
            name: true,
            price: true,
            purchasePrice: true,
        })
        .rawFilter({
            status: "ACTIVE",
            ...(tag && { tags: { has: tag as ProductTag } }),
            ...(category && {
                category: {
                    name: { contains: category, mode: "insensitive" },
                },
            }),
            ...(brands && {
                brand: {
                    in: brands.split(","),
                },
            }),
            ...(availability && {
                availability: {
                    equals: availability as ProductAvailability,
                },
            }),
        })
        .filter({ exclude: ["minPrice", "maxPrice"] })
        .paginate()
        .execute();

    const pagination = await queryBuilder.countTotal();

    return {
        message: "Products Retrieved Successfully",
        data: products,
        pagination,
    };
};

// Get Single Product
const getSingleProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            variations: {
                omit: {
                    id: true,
                    productId: true,
                },
            },
            specs: {
                omit: {
                    id: true,
                    productId: true,
                },
            },
            description: {
                omit: {
                    id: true,
                    productId: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found!");
    }

    return {
        message: "Product Retrieved Successfully",
        data: { ...product, specs: product.specs?.data },
    };
};

export default {
    getProductFilters,
    getProducts,
    getSingleProduct,
};
