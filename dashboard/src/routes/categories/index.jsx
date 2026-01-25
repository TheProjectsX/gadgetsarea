import { useState } from "react";
import { Plus } from "lucide-react";
import {
    CategoryItem,
    CategoryItemSkeleton,
    EditCategoryModal,
} from "./components";
import {
    useCreateCategoryMutation,
    useFetchCategoriesQuery,
} from "../../store/features/categories/categoriesApiSlice";
import { toast } from "react-toastify";

export default function CategoriesPage() {
    const {
        data: response,
        isLoading,
        isFetching,
        refetch,
    } = useFetchCategoriesQuery({});

    const [showAddModal, setShowAddModal] = useState(false);

    const [createCategory] = useCreateCategoryMutation();

    const handleAddCategory = async (category) => {
        try {
            await createCategory({ body: category });
            toast.success("New category created!");
            setShowAddModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to create category");
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Categories
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage product categories
                        </p>
                    </div>
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">
                            Total Categories
                        </p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {response?.data?.length ?? "--"}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">
                            Active Categories
                        </p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {response?.data?.filter((cat) => cat.active)?.length ?? "--"}
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Loading State */}
                    {isLoading &&
                        Array(5).map((_, idx) => (
                            <CategoryItemSkeleton key={idx} />
                        ))}

                    {!isLoading &&
                        response?.data &&
                        response.data?.length > 0 &&
                        response.data.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                refetch={refetch}
                            />
                        ))}
                </div>

                {/* Empty State */}
                {response?.data?.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                No categories yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Get started by creating your first category
                            </p>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showAddModal && (
                <EditCategoryModal
                    closeModal={() => setShowAddModal(false)}
                    handleUpdate={handleAddCategory}
                />
            )}
        </>
    );
}
