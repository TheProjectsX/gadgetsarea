import React from "react";

const FilterSection = ({
    filters,
    onSubmit,
}: {
    filters: Record<string, any>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {

    console.log(filters)

    return (
        <form
            className="bg-white rounded-lg border border-gray-200 p-4"
            onSubmit={onSubmit}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                    type="reset"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filters?.brands.map((brand: string) => (
                            <label
                                key={brand}
                                className="flex items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    name="brands"
                                    value={brand}
                                    defaultChecked={filters.brands.includes(
                                        brand,
                                    )}
                                    className="w-4 h-4 text-blue-600 rounded outline-none"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {brand}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Price Range
                    </h3>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                                Min
                            </label>
                            <input
                                type="number"
                                name="minPrice"
                                defaultValue={filters?.price?.min || ""}
                                placeholder={
                                    filters?.price?.min?.toString() || "0"
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div className="flex items-end pb-2">
                            <span className="text-gray-400">-</span>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                                Max
                            </label>
                            <input
                                type="number"
                                name="maxPrice"
                                defaultValue={filters?.price?.max || ""}
                                placeholder={
                                    filters?.price?.max?.toString() || "0"
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Availability
                    </h3>
                    <div className="space-y-2">
                        {(
                            filters?.availability || [
                                "IN_STOCK",
                                "OUT_OF_STOCK",
                            ]
                        ).map((status: string) => (
                            <label
                                key={status}
                                className="flex items-center cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="availability" // same name for all radios
                                    value={status}
                                    defaultChecked={
                                        filters?.availability?.[0] === status
                                    } // only one can be selected
                                    className="w-4 h-4 text-blue-600 rounded outline-none"
                                />
                                <span className="ml-2 text-sm text-gray-700 select-none">
                                    {status === "IN_STOCK"
                                        ? "In Stock"
                                        : status === "OUT_OF_STOCK"
                                          ? "Out of Stock"
                                          : "Pre Order"}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
                Filter
            </button>
        </form>
    );
};

export default FilterSection;
