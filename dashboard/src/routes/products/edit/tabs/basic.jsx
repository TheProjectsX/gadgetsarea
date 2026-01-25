import { useFetchCategoriesQuery } from "../../../../store/features/categories/categoriesApiSlice";
import { MultiImageUploader } from "../components";

const availabilityOptions = [
    {
        label: "IN STOCK",
        value: "IN_STOCK",
    },
    { label: "OUT OF STOCK", value: "OUT_OF_STOCK" },
    { label: "PRE ORDER", value: "PRE_ORDER" },
    { label: "TBA", value: "TBA" },
];
const BasicTab = ({ basic = {}, setBasic }) => {
    const { data: categories } = useFetchCategoriesQuery({ active: "true" });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiImageUploader
                    images={basic?.images ?? []}
                    setImages={(value) =>
                        setBasic((prev) => ({ ...prev, images: value }))
                    }
                    className="col-span-full"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={basic.name}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <input
                        type="text"
                        value={basic.brand}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                brand: e.target.value,
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter brand name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={basic.price}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                price: Number(e.target.value),
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={basic.purchasePrice}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                purchasePrice: Number(e.target.value),
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={basic.categoryId}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                categoryId: e.target.value,
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option hidden>-- Select Category --</option>
                        {categories &&
                            categories.data.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                    </label>
                    <select
                        value={basic.availability}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                availability: e.target.value,
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {availabilityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                    </label>
                    <input
                        type="number"
                        value={basic.stock}
                        onChange={(e) =>
                            setBasic((prev) => ({
                                ...prev,
                                stock: Number(e.target.value),
                            }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicTab;
