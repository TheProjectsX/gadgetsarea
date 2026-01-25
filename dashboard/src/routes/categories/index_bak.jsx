import { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryItem, EditCategoryModal, SubCategories } from "./components";

// Demo data
const demoCategoriesData = [
    {
        id: "cat_1",
        name: "Electronics",
        description: "Electronic devices and accessories",
        active: true,
        children: [
            {
                id: "cat_1_1",
                name: "Smartphones",
                description: "Mobile phones and accessories",
            },
            {
                id: "cat_1_2",
                name: "Laptops",
                description: "Portable computers and accessories",
            },
            {
                id: "cat_1_3",
                name: "Audio",
                description: "Headphones, speakers, and audio equipment",
            },
        ],
    },
    {
        id: "cat_2",
        name: "Clothing",
        description: "Apparel and fashion items",
        active: true,
        children: [
            {
                id: "cat_2_1",
                name: "Men's Clothing",
                description: "Clothing items for men",
            },
            {
                id: "cat_2_2",
                name: "Women's Clothing",
                description: "Clothing items for women",
            },
            {
                id: "cat_2_3",
                name: "Kids Clothing",
                description: "Clothing items for children",
            },
        ],
    },
    {
        id: "cat_3",
        name: "Home & Garden",
        description: "Home improvement and gardening products",
        active: false,
        children: [
            {
                id: "cat_3_1",
                name: "Furniture",
                description: "Indoor and outdoor furniture",
            },
            {
                id: "cat_3_2",
                name: "Garden Tools",
                description: "Tools and equipment for gardening",
            },
        ],
    },
    {
        id: "cat_4",
        name: "Sports & Outdoors",
        description: "Sports equipment and outdoor gear",
        active: true,
        children: [],
    },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(demoCategoriesData);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [modalCategory, setModalCategory] = useState(null);

    const toggleExpand = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleActive = (categoryId) => {
        setCategories(
            categories.map((cat) =>
                cat.id === categoryId ? { ...cat, active: !cat.active } : cat,
            ),
        );
    };

    const handleEdit = (category) => {
        setModalCategory(category);
    };

    const handleDelete = (categoryId, isChild = false, parentId = null) => {
        if (confirm("Are you sure you want to delete this category?")) {
            if (isChild && parentId) {
                setCategories(
                    categories.map((cat) => {
                        if (cat.id === parentId) {
                            return {
                                ...cat,
                                children: cat.children.filter(
                                    (child) => child.id !== categoryId,
                                ),
                            };
                        }
                        return cat;
                    }),
                );
            } else {
                setCategories(
                    categories.filter((cat) => cat.id !== categoryId),
                );
            }
            alert("Category deleted successfully!");
        }
    };

    const handleAddCategory = () => {
        setModalCategory({});
    };

    const handleAddSubcategory = (parentId) => {
        setModalCategory({ parentId });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Categories
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage product categories and subcategories
                    </p>
                </div>
                <button
                    onClick={handleAddCategory}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {categories.length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active Categories</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {categories.filter((cat) => cat.active).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Subcategories</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                        {categories.reduce(
                            (sum, cat) => sum + cat.children.length,
                            0,
                        )}
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                        {/* Parent Category */}
                        <CategoryItem
                            category={category}
                            toggleExpand={toggleExpand}
                            expandedCategories={expandedCategories}
                            toggleActive={toggleActive}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            handleAddSubcategory={handleAddSubcategory}
                        />

                        {/* Subcategories */}
                        {expandedCategories.has(category.id) &&
                            category.children.length > 0 && (
                                <SubCategories
                                    subCategories={category.children}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            )}

                        {/* Empty Subcategories Message */}
                        {expandedCategories.has(category.id) &&
                            category.children.length === 0 && (
                                <div className="border-t border-gray-200 bg-gray-50 p-6 text-center">
                                    <p className="text-gray-500 text-sm">
                                        No subcategories yet
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleAddSubcategory(category.id)
                                        }
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Add your first subcategory
                                    </button>
                                </div>
                            )}
                    </div>
                ))}
            </div>

            {/* Custom Empty State */}
            {categories.length === 0 && (
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

            {/* Modal */}
            {modalCategory && (
                <EditCategoryModal
                    category={modalCategory}
                    closeModal={() => setModalCategory(null)}
                />
            )}
        </div>
    );
}
