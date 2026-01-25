import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const CartItem = ({
    item,
    selectedItems,
    setSelectedItems,
    handleRemoveItem,
    handleCheckout,
}: {
    item: {
        quantity: number;
        id: string;
        product: {
            id: string;
            name: string;
            price: number;
            purchasePrice: number;
            images: string[];
            stock: number;
        };
    };
    selectedItems: string[];
    setSelectedItems: any;
    handleRemoveItem: (id: string) => Promise<void>;
    handleCheckout: (id: string[]) => Promise<void>;
}) => {
    const [quantity, setQuantity] = useState<number>(item.quantity ?? 1);
    const isSelected = selectedItems.includes(item.id);

    const toggleItemSelection = (id: string) => {
        setSelectedItems((selected: any) =>
            selected.includes(id)
                ? selected.filter((itemId: any) => itemId !== id)
                : [...selected, id],
        );
    };

    return (
        <div key={item.id} className={`p-4`}>
            <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex items-start pt-2">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-5 h-5 text-blue-600 rounded outline-none cursor-pointer"
                    />
                </div>

                {/* Product Image */}
                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-4xl border border-gray-200">
                    <img src={item.product.images[0]} alt="Product image" />
                </div>

                {/* Product Details */}
                <div className="grow">
                    <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold text-gray-900 mb-1 inline-block hover:underline underline-offset-4"
                    >
                        {item.product.name}
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-blue-600">
                            ৳ {item.product.purchasePrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                            ৳ {item.product.price.toLocaleString()}
                        </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                onClick={() => setQuantity((prev) => prev - 1)}
                                disabled={quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <p className="w-12 text-center border-x border-gray-300 focus:outline-none">
                                {quantity.toString().padStart(2, "0")}
                            </p>
                            <button
                                onClick={() => setQuantity((prev) => prev + 1)}
                                disabled={quantity >= item.product.stock}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-500">
                            {item.product.stock} in stock
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => handleCheckout([item.id])}
                        className="shrink-0 text-blue-600 hover:text-blue-700 hover:bg-gray-100 transition p-2 cursor-pointer"
                        title="Proceed to Checkout"
                    >
                        <ShoppingBag className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="shrink-0 text-red-600 hover:text-red-700 hover:bg-gray-100 transition p-2 cursor-pointer"
                        title="Delete item from Cart"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
