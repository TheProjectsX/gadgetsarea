"use client";

import { useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CartItem } from "./components";
import {
    useFetchAllCartQuery,
    useRemoveFromCartMutation,
} from "@/store/features/carts/cartsApiSlice";
import withAuth from "@/hoc/withAuth";
import Link from "next/link";
import { useCreateOrdersMutation } from "@/store/features/orders/ordersApiSlice";
import { toast } from "react-toastify";
import ReactHead from "@theprojectsx/react-head";

type CartItemType = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        purchasePrice: number;
        images: string[];
        stock: number;
    };
};

const ShoppingCartPage = () => {
    const { data: response, refetch } = useFetchAllCartQuery({});
    const cartItems = response?.data as CartItemType[] | null;

    const [createOrder] = useCreateOrdersMutation();
    const [removeCart] = useRemoveFromCartMutation();

    const [selectedItems, setSelectedItems] = useState(
        cartItems?.map((i) => i.id) ?? [],
    );

    const selectedCartItems = cartItems?.filter((i) =>
        selectedItems?.includes(i.id),
    );

    const subtotal =
        selectedCartItems?.reduce(
            (sum, i) => sum + i.product.purchasePrice * i.quantity,
            0,
        ) ?? 0;

    const handleRemoveItem = async (id: string) => {
        try {
            await removeCart({
                id,
            }).unwrap();
            setSelectedItems((selected) =>
                selected.filter((itemId) => itemId !== id),
            );

            refetch();
            toast.success("Cart item removed");
        } catch (error: any) {
            console.error(error);
            toast.error(
                error?.data?.message ??
                    error?.message ??
                    "Failed to remove cart",
            );
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems?.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems?.map((item) => item.id) ?? []);
        }
    };

    const checkoutPage = async (items: string[]) => {
        try {
            const data = await createOrder({
                body: { cartIds: items },
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
            <ReactHead>
                <title>Your Cart</title>
            </ReactHead>
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {cartItems?.length}{" "}
                            {cartItems?.length === 1 ? "item" : "items"} in your
                            cart
                        </p>
                    </div>

                    {cartItems?.length === 0 ? (
                        // Empty Cart
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Add some products to get started!
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg border border-gray-200">
                                    {/* Select All Header */}
                                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedItems.length ===
                                                    cartItems?.length
                                                }
                                                onChange={toggleSelectAll}
                                                className="w-5 h-5 text-blue-600 rounded outline-none cursor-pointer"
                                            />
                                            <span className="font-semibold text-gray-700">
                                                Select All (
                                                {selectedItems.length}/
                                                {cartItems?.length})
                                            </span>
                                        </label>
                                        {selectedItems.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    selectedItems.forEach(
                                                        (id) =>
                                                            handleRemoveItem(
                                                                id,
                                                            ),
                                                    );
                                                }}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Delete Selected
                                            </button>
                                        )}
                                    </div>

                                    {/* Cart Items List */}
                                    <div className="divide-y divide-gray-200">
                                        {cartItems?.map((item) => (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                                selectedItems={selectedItems}
                                                setSelectedItems={
                                                    setSelectedItems
                                                }
                                                handleRemoveItem={
                                                    handleRemoveItem
                                                }
                                                handleCheckout={checkoutPage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>
                                                Subtotal ({selectedItems.length}{" "}
                                                items)
                                            </span>
                                            <span>
                                                ৳ {subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>
                                                <span className="text-green-600">
                                                    FREE
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-semibold text-gray-900">
                                                Total
                                            </span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                ৳ {subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            checkoutPage(selectedItems)
                                        }
                                        disabled={selectedItems.length === 0}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                                    >
                                        Proceed to Checkout (
                                        {selectedItems.length})
                                    </button>

                                    <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
                                        Continue Shopping
                                    </button>

                                    {/* Trust Badges */}
                                    <div className="flex flex-wrap justify-between gap-2 mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">
                                                ✓
                                            </span>
                                            <span>Secure Payment</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">
                                                ✓
                                            </span>
                                            <span>7 Days Return</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">
                                                ✓
                                            </span>
                                            <span>Official Warranty</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>{" "}
        </>
    );
};
export default withAuth(ShoppingCartPage);
