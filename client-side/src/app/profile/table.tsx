import { Fragment, useState } from "react";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useCancelOrderMutation } from "@/store/features/orders/ordersApiSlice";
import { toast } from "react-toastify";

const OrdersTable = ({ orders }: { orders: any }) => {
    const [ordersData, setOrdersData] = useState(orders);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [cancelOrder] = useCancelOrderMutation();

    const orderStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";
            case "SHIPPED":
                return "bg-blue-100 text-blue-700";
            case "PROCESSING":
                return "bg-yellow-100 text-yellow-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const orderStatusIcon = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return <CheckCircle size={16} />;
            case "SHIPPED":
            case "PROCESSING":
                return <Clock size={16} />;
            case "CANCELLED":
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrder({ id: orderId }).unwrap();

            setOrdersData((prevOrders: any) =>
                prevOrders.map((order: any) =>
                    order.id === orderId
                        ? { ...order, status: "CANCELLED" }
                        : order,
                ),
            );

            toast.success("Cancelled Order successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Failed to Cancel Order");
        }
    };

    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-center">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
                {ordersData.map((order: any) => (
                    <Fragment key={order.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-900">
                                    {order.id.slice(0, 8)}...
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${orderStatusColor(order.status)}`}
                                >
                                    {orderStatusIcon(order.status)}
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() =>
                                        setExpandedOrder(
                                            expandedOrder === order.id
                                                ? null
                                                : order.id,
                                        )
                                    }
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                                >
                                    {order.orderItems.length} item(s)
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-semibold text-gray-900">
                                    ৳{order.totalAmount.toFixed(2)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
                                >
                                    Cancel Order
                                </button>
                            </td>
                        </tr>
                        {expandedOrder === order.id && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-4 bg-blue-50"
                                >
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-3">
                                            Order Items:
                                        </h4>
                                        <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-center">
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                                                            Product
                                                        </th>
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                                                            Price
                                                        </th>
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                                                            Quantity
                                                        </th>
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {order.orderItems.map(
                                                        (
                                                            item: any,
                                                            idx: number,
                                                        ) => (
                                                            <tr key={idx}>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    <Link
                                                                        href={`/products/edit/${item.product.id}`}
                                                                        className="hover:text-blue-600 hover:underline underline-offset-4"
                                                                    >
                                                                        {
                                                                            item
                                                                                .product
                                                                                .name
                                                                        }
                                                                    </Link>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    ৳
                                                                    {item.product.price.toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    ×
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </td>
                                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                                    ৳
                                                                    {(
                                                                        item
                                                                            .product
                                                                            .price *
                                                                        item.quantity
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default OrdersTable;
