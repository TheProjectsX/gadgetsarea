"use client";

import { use, useState } from "react";
import { Filter, X, ChevronDown, Star, ShoppingCart } from "lucide-react";
import {
    useFetchProductFiltersQuery,
    useFetchProductsQuery,
} from "@/store/features/products/productsApiSlice";
import FilterSection from "./Filters";
import ProductCard from "@/components/ProductCard";

export default function ProductsFilterPage({
    params,
}: {
    params: Promise<Record<string, string>>;
}) {
    const { name } = use(params);
    const { data } = useFetchProductFiltersQuery({ name });
    const productFilters = data?.data;

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState<{
        brands?: string;
        availability?: string;
        minPrice?: string;
        maxPrice?: string;
        category?: string;
    }>({
        category: name,
    });

    const { data: products } = useFetchProductsQuery(filters);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target ?? e.currentTarget;
        const formData = new FormData(form as HTMLFormElement);

        const brands = formData.getAll("brands") || [];
        const availability =
            formData.get("availability")?.toString() || undefined;

        const minPrice = formData.get("minPrice")?.toString() || undefined;
        const maxPrice = formData.get("maxPrice")?.toString() || undefined;

        const params = {
            brands: brands.join(","),
            availability,
            minPrice,
            maxPrice,
            category: name,
        };

        setFilters(params);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        All Products
                    </h1>
                    <p className="text-gray-600">
                        Showing{" "}
                        {products?.data?.length.toString().padStart(2, "0")}{" "}
                        products
                    </p>
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        <Filter className="h-5 w-5" />
                        Filter
                    </button>
                </div>

                {/* Mobile Filters Modal */}
                {showMobileFilters && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                        <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-4">
                                <FilterSection
                                    filters={productFilters}
                                    onSubmit={handleFilter}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Desktop Filters - Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-4">
                            <FilterSection
                                filters={productFilters}
                                onSubmit={handleFilter}
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {products?.data.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {products?.data.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        homepage={false}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
