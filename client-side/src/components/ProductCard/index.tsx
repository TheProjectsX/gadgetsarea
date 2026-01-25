import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import AuthButtonWrapper from "../AuthButtonWrapper";
import { useAddToCartMutation } from "@/store/features/carts/cartsApiSlice";
import { toast } from "react-toastify";

const ProductCard = ({
    product,
    homepage = true,
}: {
    product: any;
    homepage?: boolean;
}) => {
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

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition group shrink-0 ${homepage ? "w-60 sm:w-72" : ""}`}
        >
            <div className="relative aspect-5/4 bg-gray-100 overflow-hidden block">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    <Link href={`/products/${product.id}`}>
                        <img src={product.images?.[0]} alt="Product Image" />
                    </Link>
                </div>
                {(product.price ?? 0) - (product.purchasePrice ?? 0) > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        ৳ {product.price - product.purchasePrice} OFF
                    </div>
                )}
                {
                    <AuthButtonWrapper>
                        <button
                            onClick={handleAddToCart}
                            className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-50"
                        >
                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </button>
                    </AuthButtonWrapper>
                }
            </div>
            <div className="p-4">
                <Link
                    href={`/products/${product.id}`}
                    className="font-semibold text-gray-800 mb-2 line-clamp-1"
                >
                    {product.name}
                </Link>
                <div className="flex items-baseline gap-2">
                    <span className="sm:text-xl font-bold text-blue-600">
                        ৳ {product.purchasePrice.toLocaleString()}
                    </span>
                    {product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            ৳ {product.price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

export const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-60 sm:w-72 shrink-0 animate-pulse">
            {/* Image */}
            <div className="aspect-5/4 bg-gray-200" />

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4" />

                {/* Rating */}
                <div className="h-3 bg-gray-200 rounded w-20" />

                {/* Price */}
                <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
            </div>
        </div>
    );
};
