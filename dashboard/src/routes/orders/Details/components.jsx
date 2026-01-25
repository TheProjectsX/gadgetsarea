import { Link } from "react-router-dom";

export const OrderItem = ({ item }) => {
    return (
        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
                <img
                    src={
                        item.product.images?.[0] ??
                        "https://placehold.co/600x400"
                    }
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    loading="lazy"
                />
                <div className="flex-1">
                    <Link
                        to={`/products/edit/${item.product.id}`}
                        className="font-semibold text-gray-800 hover:underline underline-offset-4"
                    >
                        {item.product.name}
                    </Link>
                    <div className="mt-2 space-y-1 text-sm">
                        <p className="text-gray-600">
                            Price:{" "}
                            <span className="font-medium text-gray-800">
                                ${item.price.toFixed(2)}
                            </span>
                        </p>
                        <p className="text-gray-600">
                            Quantity:{" "}
                            <span className="font-medium text-gray-800">
                                ×{item.quantity}
                            </span>
                        </p>
                        <p className="text-gray-600">
                            Purchase Price:{" "}
                            <span className="font-medium text-gray-800">
                                ${item.product.purchasePrice.toFixed(2)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
