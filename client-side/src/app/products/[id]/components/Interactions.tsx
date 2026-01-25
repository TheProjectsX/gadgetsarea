"use client";

import { useAddToCartMutation } from "@/store/features/carts/cartsApiSlice";
import { useCreateOrdersMutation } from "@/store/features/orders/ordersApiSlice";
import {
    Heart,
    Minus,
    Plus,
    Share2,
    ShoppingBag,
    ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Interactions = ({ product }: { product: any }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState<
        Record<string, string>
    >({});

    const handleVariationChange = (variationName: any, value: any) => {
        setSelectedVariations((prev) => ({
            ...prev,
            [variationName]: value,
        }));
    };

    const [createOrder] = useCreateOrdersMutation();
    const [addToCart] = useAddToCartMutation();

    const handleAddToCart = async () => {
        try {
            await addToCart({ body: { productId: product.id } }).unwrap();
            toast.success("Added to Cart");
        } catch (error: any) {
            console.error(error);
            toast.error(
                error?.data?.message ??
                    error?.message ??
                    "Failed to Add to cart",
            );
        }
    };

    const checkoutPage = async () => {
        try {
            const response = await addToCart({ body: { productId: product.id } }).unwrap();

            const data = await createOrder({
                body: { cartIds: [response?.data?.id] },
            }).unwrap();
            if (data?.data?.url) {
                const url = data.data.url;

                window.location.href = url;
                toast.success("Order created!");
            } else {
                toast.error("Failed to Create order");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(
                error?.data?.message ??
                    error?.message ??
                    "Failed to Create order",
            );
        }
    };

    return (
        <>
            {/* Variations */}
            {product.variations.map(
                (variation: { name: string; values: string[] }) => (
                    <div key={variation.name} className="mb-6">
                        <label className="block font-semibold text-gray-700 mb-3">
                            {variation.name}:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {variation.values.map((value) => (
                                <button
                                    key={value}
                                    onClick={() =>
                                        handleVariationChange(
                                            variation.name,
                                            value,
                                        )
                                    }
                                    className={`max-sm:text-sm px-4 py-2 border-2 rounded-lg cursor-pointer ${
                                        selectedVariations[variation.name] ===
                                        value
                                            ? "border-blue-600 bg-blue-50 text-blue-600"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                ),
            )}

            {/* Quantity and stuff */}
            <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-3">
                    Quantity:
                </label>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setQuantity((prev) => prev - 1)}
                            disabled={quantity <= 1}
                            className="size-8 sm:size-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                        >
                            <Minus className="size-2 sm:size-4" />
                        </button>
                        <p className="w-14 sm:w-20 py-1 text-base sm:text-xl border border-gray-300 rounded text-center">
                            {quantity.toString().padStart(2, "0")}
                        </p>
                        <button
                            onClick={() => setQuantity((prev) => prev + 1)}
                            disabled={quantity >= product.stock}
                            className="size-8 sm:size-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                        >
                            <Plus className="size-2 sm:size-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="size-10 sm:size-12 border-2 border-gray-300 rounded-lg flex items-center justify-center not-disabled:hover:border-red-500 not-disabled:hover:text-red-500 transition not-disabled:cursor-pointer disabled:cursor-not-allowed"
                            disabled
                        >
                            <Heart className="size-3 sm:size-5" />
                        </button>
                        <button className="size-10 sm:size-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition cursor-pointer">
                            <Share2 className="size-3 sm:size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2.5 cursor-pointer max-sm:text-sm">
                    <ShoppingCart className="size-4 sm:size-5" />
                    Add to Cart
                </button>
                <button onClick={checkoutPage} className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2.5 cursor-pointer max-sm:text-sm">
                    <ShoppingBag className="size-4 sm:size-5" />
                    Buy Now
                </button>
            </div>
        </>
    );
};

export default Interactions;
