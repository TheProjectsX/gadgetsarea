import Popover from "@theprojectsx/react-popover";
import { MoreVertical, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    useDeleteOrderMutation,
    useUpdateOrderStatusMutation,
} from "../../store/features/orders/ordersApiSlice";
import { toast } from "react-toastify";

const OrdersTable = ({ orders, refetch }) => {
    const [ordersList, setOrdersList] = useState(orders);

    useEffect(() => {
        setOrdersList(orders);
    }, [orders]);

    const [updateStatus] = useUpdateOrderStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateStatus({
                id: orderId,
                body: { status: newStatus },
            }).unwrap();

            setOrdersList((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order,
                ),
            );

            toast.success("Status Updated!");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to update Status");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        // TODO: Add confirmation
        if (confirm("Are you sure you want to delete this order?")) {
            setOrdersList(ordersList.filter((order) => order.id !== orderId));
        }

        try {
            await deleteOrder({ id: productId }).unwrap()
            refetch?.();
            toast.success("Order deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to delete Order");
        }
    };

    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Order ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Customer
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Items
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Total Amount
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Order Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
                {ordersList.map((order) => (
                    <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {order.id.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-500">
                                Updated:{" "}
                                {new Date(order.updatedAt).toLocaleDateString()}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="ml-4 flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order?.customer?.name ?? "Guest Order"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.customer.email ?? "n/a"}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <Popover
                                parentStyles={{
                                    display: "block",
                                    marginInline: "auto",
                                }}
                                content={
                                    <div className="w-64 rounded-lg overflow-hidden shadow-lg bg-white p-3">
                                        <div className="text-xs font-semibold text-gray-700 mb-2">
                                            Order Items (
                                            {order.orderItems.length})
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {order.orderItems.map(
                                                (item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2 text-xs"
                                                    >
                                                        <img
                                                            src={
                                                                item.product
                                                                    .image
                                                            }
                                                            alt={
                                                                item.product
                                                                    .name
                                                            }
                                                            className="w-8 h-8 rounded object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">
                                                                <Link
                                                                    to={`/products/edit/${item.product.id}`}
                                                                    className="hover:text-blue-600 hover:underline underline-offset-4"
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <div className="text-gray-500">
                                                                ৳ {item.price} ×{" "}
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                }
                                position="bottom"
                                axis="center"
                            >
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mx-auto cursor-pointer">
                                    <Package size={16} />
                                    <span className="whitespace-nowrap">
                                        {order.orderItems.length} item
                                        {order.orderItems.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </button>
                            </Popover>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-semibold text-gray-900">
                                ৳ {order.totalAmount.toFixed(2)}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    handleStatusChange(order.id, e.target.value)
                                }
                                className={`px-3 py-1 text-xs font-semibold cursor-pointer border-0 outline-none bg-gray-200`}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    },
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap relative">
                            <Popover
                                parentStyles={{
                                    marginInline: "auto",
                                    display: "block",
                                }}
                                content={
                                    <div className="w-32 rounded-lg overflow-hidden shadow text-sm bg-white flex flex-col">
                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDeleteOrder(order.id)
                                            }
                                            className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            Delete Order
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
    );
};

export default OrdersTable;
