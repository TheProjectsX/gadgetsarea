import {
    Plus,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    ToggleLeft,
    ToggleRight,
    X,
} from "lucide-react";
import { useState } from "react";
import {
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
    useUpdateCategoryMutation,
} from "../../store/features/categories/categoriesApiSlice";
import { toast } from "react-toastify";

export const CategoryItem_bak = ({
    category,
    toggleExpand,
    expandedCategories,
    toggleActive,
    handleEdit,
    handleDelete,
    handleAddSubcategory,
}) => {
    return (
        <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
                {/* Expand/Collapse Button */}
                {category.children.length > 0 && (
                    <button
                        onClick={() => toggleExpand(category.id)}
                        className="mt-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                        {expandedCategories.has(category.id) ? (
                            <ChevronDown size={20} />
                        ) : (
                            <ChevronRight size={20} />
                        )}
                    </button>
                )}
                {category.children.length === 0 && <div className="w-5"></div>}

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {category.name}
                            </h3>
                            {category.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {category.description}
                                </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-gray-500">
                                    {category.children.length} subcategories
                                </span>
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                        category.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {category.active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleActive(category.id)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title={
                                    category.active ? "Deactivate" : "Activate"
                                }
                            >
                                {category.active ? (
                                    <ToggleRight
                                        size={24}
                                        className="text-green-600"
                                    />
                                ) : (
                                    <ToggleLeft
                                        size={24}
                                        className="text-gray-400"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() =>
                                    handleAddSubcategory(category.id)
                                }
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Add Subcategory"
                            >
                                <Plus size={20} />
                            </button>
                            <button
                                onClick={() => handleEdit(category)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Edit"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CategoryItem = ({ category, refetch }) => {
    const [catData, setCatData] = useState(category);
    const [showEditModal, setShowEditModal] = useState(false);

    const [updateCategory] = useUpdateCategoryMutation();
    const [toggleStatus] = useToggleCategoryStatusMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const toggleActive = async (categoryId) => {
        try {
            await toggleStatus({
                id: categoryId,
            });
            setCatData((prev) => ({ ...prev, active: !prev.active }));
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to toggle status");
        }
    };

    const handleUpdate = async (category) => {
        try {
            await updateCategory({
                id: catData.id,
                body: { ...category, id: undefined },
            });
            setCatData(category);
            toast.success("Category Updated!");
            setShowEditModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to update Category");
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await deleteCategory({ id: categoryId });
            toast.success("Category deleted");
            refetch?.();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to delete Category");
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                        {catData.name}
                    </h3>
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            catData.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {catData.active ? "Active" : "Inactive"}
                    </span>
                </div>

                {catData.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {catData.description}
                    </p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <button
                        onClick={() => toggleActive(catData.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                        title={catData.active ? "Deactivate" : "Activate"}
                    >
                        {catData.active ? (
                            <ToggleRight size={22} className="text-green-600" />
                        ) : (
                            <ToggleLeft size={22} className="text-gray-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Edit"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(catData.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors ml-auto cursor-pointer"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {showEditModal && (
                <EditCategoryModal
                    category={catData}
                    closeModal={() => setShowEditModal(false)}
                    handleUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export const CategoryItemSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
            </div>
        </div>
    );
};

export const SubCategories = ({ subCategories, handleEdit, handleDelete }) => {
    return (
        <div className="border-t border-gray-200 bg-gray-50">
            <div className="divide-y divide-gray-200">
                {subCategories.map((cat) => (
                    <div
                        key={cat.id}
                        className="p-4 pl-16 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">
                                    {cat.name}
                                </h4>
                                {cat.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {cat.description}
                                    </p>
                                )}
                            </div>

                            {/* Subcategory Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const EditCategoryModal = ({
    category = {},
    closeModal,
    handleUpdate,
}) => {
    const [catData, setCatData] = useState(category ?? {});

    return (
        <>
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={closeModal}
            ></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {category.id ? "Edit Category" : "Add Category"}
                        </h3>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={catData.name}
                                onChange={(e) =>
                                    setCatData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter category name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={catData.description}
                                onChange={(e) =>
                                    setCatData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter category description"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={catData.active}
                                    onChange={(e) =>
                                        setCatData((prev) => ({
                                            ...prev,
                                            active: e.target.checked,
                                        }))
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Active
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleUpdate(catData)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            {catData.id ? "Update" : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
