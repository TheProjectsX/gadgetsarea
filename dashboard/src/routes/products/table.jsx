import { useEffect, useState } from "react";
import { MoreVertical, X, Tag } from "lucide-react";
import Popover from "@theprojectsx/react-popover";
import { Link } from "react-router-dom";
import {
    useDeleteProductMutation,
    useUpdateProductMutation,
} from "../../store/features/products/productsApiSlice";
import { toast } from "react-toastify";

const tagsData = [
    {
        label: "None",
        value: "NONE",
    },
    {
        label: "Featured",
        value: "FEATURED",
    },
    {
        label: "New Arrival",
        value: "NEW_ARRIVAL",
    },
    {
        label: "Best Deal",
        value: "BEST_DEAL",
    },
];

const ProductsTable = ({ products, refetch }) => {
    const [productsList, setProductsList] = useState(products);
    const [showEditTagsModal, setShowEditTagsModal] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        setProductsList(products);
    }, [products]);

    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const handleStatusChange = async (productId, newStatus) => {
        try {
            await updateProduct({
                id: productId,
                body: { status: newStatus },
            }).unwrap();

            setProductsList((prev) =>
                prev.map((product) =>
                    product.id === productId
                        ? { ...product, status: newStatus }
                        : product,
                ),
            );

            toast.success("Product status updated");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to update status");
        }
    };

    const handleAvailabilityChange = async (productId, newAvailability) => {
        try {
            await updateProduct({
                id: productId,
                body: { availability: newAvailability },
            }).unwrap();

            setProductsList((prev) =>
                prev.map((product) =>
                    product.id === productId
                        ? { ...product, availability: newAvailability }
                        : product,
                ),
            );

            toast.success("Product availability updated");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to update availability");
        }
    };

    const handleDeleteProduct = async (productId) => {
        // TODO: ADD confirmation
        if (confirm("Are you sure you want to delete this product?")) {
            setProductsList(
                productsList.filter((product) => product.id !== productId),
            );
        }
        try {
            await deleteProduct({ id: productId });
            refetch?.();
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to delete product");
        }
    };

    const openEditTags = (product) => {
        setShowEditTagsModal(product);
        console.log(product);
        setSelectedTags(product.tags ?? []);
    };

    const closeEditTags = () => {
        setShowEditTagsModal(null);
        setSelectedTags([]);
    };

    const toggleTag = (tagValue) => {
        if (tagValue === "NONE") {
            setSelectedTags(["NONE"]);
        } else {
            setSelectedTags((prev) => {
                let tags = [];
                if (prev.includes(tagValue)) {
                    tags = prev.filter((t) => t !== tagValue);
                } else {
                    tags = [...prev, tagValue];
                }

                return tags.length === 0
                    ? ["NONE"]
                    : tags.filter((tag) => tag != "NONE");
            });
        }
    };

    const saveTags = async (productId) => {
        setProductsList((prev) =>
            prev.map((product) =>
                product.id === productId
                    ? { ...product, tags: selectedTags }
                    : product,
            ),
        );

        // Actually Change the availability here
        try {
            await updateProduct({
                id: productId,
                body: { tags: selectedTags },
            });
            toast.success("Product tags updated");
            setShowEditTagsModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to update tags");
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                                Product
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Category
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Price
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Availability
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productsList.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {product.id.slice(0, 8)}...
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">
                                        {product.category?.name || "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm font-medium text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">
                                        {product.stock} units
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <select
                                        value={product.availability}
                                        onChange={(e) =>
                                            handleAvailabilityChange(
                                                product.id,
                                                e.target.value,
                                            )
                                        }
                                        className="px-3 py-1 text-xs font-semibold cursor-pointer border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="IN_STOCK">
                                            IN STOCK
                                        </option>
                                        <option value="OUT_OF_STOCK">
                                            OUT OF STOCK
                                        </option>
                                        <option value="PRE_ORDER">
                                            PRE ORDER
                                        </option>
                                        <option value="TBA">TBA</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <select
                                        value={product.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                product.id,
                                                e.target.value,
                                            )
                                        }
                                        className="px-3 py-1 text-xs font-semibold cursor-pointer border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">
                                            INACTIVE
                                        </option>
                                        <option value="DRAFT">DRAFT</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap relative">
                                    <Popover
                                        parentStyles={{
                                            marginInline: "auto",
                                            display: "block",
                                        }}
                                        content={
                                            <div className="w-32 rounded-lg overflow-hidden shadow text-sm bg-white flex flex-col">
                                                <button
                                                    onClick={() =>
                                                        openEditTags(product)
                                                    }
                                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer text-left"
                                                >
                                                    Edit Tags
                                                </button>
                                                <Link
                                                    to={`/products/edit/${product.id}`}
                                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                                                >
                                                    Edit Product
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            product.id,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors cursor-pointer text-left"
                                                >
                                                    Delete Product
                                                </button>
                                            </div>
                                        }
                                        position="bottom"
                                        axis="center"
                                    >
                                        <button className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                                            <MoreVertical size={20} />
                                        </button>
                                    </Popover>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Tags Modal */}
            {showEditTagsModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
                        onClick={closeEditTags}
                    ></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Edit Product Tags
                                </h3>
                                <button
                                    onClick={closeEditTags}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Product:{" "}
                                    <span className="font-medium text-gray-800">
                                        {showEditTagsModal.name}
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Select tags (multiple selection allowed):
                                </p>
                                {tagsData.map((tag) => (
                                    <label
                                        key={tag.value}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTags.includes(
                                                tag.value,
                                            )}
                                            onChange={() =>
                                                toggleTag(tag.value)
                                            }
                                            // disabled={
                                            //     tag.value === "NONE" &&
                                            //     selectedTags.length > 0
                                            // }
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span
                                            className={`flex-1 px-3 py-1 rounded-full font-inter inline-block`}
                                        >
                                            {tag.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeEditTags}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        saveTags(showEditTagsModal.id)
                                    }
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                                >
                                    Save Tags
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProductsTable;
