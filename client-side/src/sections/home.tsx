"use client";

import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { useFetchProductsQuery } from "@/store/features/products/productsApiSlice";

export const ProductSection = ({
    title,
    params,
}: {
    title: string;
    params: Record<string, string>;
}) => {
    const { data: products, isLoading } = useFetchProductsQuery(params, {
        refetchOnMountOrArgChange: true,
    });

    if (!isLoading && products?.data.length < 1) {
        return;
    }

    return (
        <div className="max-w-7xl mx-auto py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
                    {title}
                </h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {products?.data &&
                    products.data.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}

                {/* Loading Skeleton */}
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
            </div>
        </div>
    );
};
