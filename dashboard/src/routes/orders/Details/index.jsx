import { useState } from "react";
import { ArrowLeft, Package, Mail, Phone, Trash2 } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useDeleteOrderMutation,
    useUpdateOrderStatusMutation,
} from "../../../store/features/orders/ordersApiSlice";
import { OrderItem } from "./components";

const orderStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export default function OrderDetailsPage() {
    const loaded = useLoaderData();
    const navigate = useNavigate();

    if (!loaded.data) {
        toast.error("Order not Found!");
        navigate("/orders", { replace: true });
        return null;
    }

    const [order, setOrder] = useState(loaded.data);
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const [updateStatus] = useUpdateOrderStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const getStatusColor = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";
            case "SHIPPED":
                return "bg-blue-100 text-blue-700";
            case "PROCESSING":
                return "bg-yellow-100 text-yellow-700";
            case "PENDING":
                return "bg-gray-100 text-gray-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "FAILED":
                return "bg-red-100 text-red-700";
            case "REFUNDED":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleChangeStatus = async () => {
        try {
            await updateStatus({
                id: order.id,
                body: { status: selectedStatus },
            }).unwrap();
            setOrder({ ...order, status: selectedStatus });
            toast.success("Status Updated!");
            setShowStatusModal(false);
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
            toast.success("Order deleted successfully!");
            navigate("/orders", { replace: true });
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to delete Order");
        }
    };
    const calculateSubtotal = (item) => {
        return item.quantity * item.purchasePrice;
    };

    const calculateProfit = () => {
        return order.orderItems.reduce((total, item) => {
            const profit =
                (item.price - item.product.purchasePrice) * item.quantity;
            return total + profit;
        }, 0);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Order Details
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Order ID: {order.id}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowStatusModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                        Change Status
                    </button>
                    <button
                        onClick={handleDeleteOrder}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                    >
                        <Trash2 size={20} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Customer & Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Customer Information
                        </h2>
                        {order.customer ? (
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        order.customer.avatar ||
                                        "https://i.ibb.co.com/jPT0HBj4/istockphoto-692687226-612x612.jpg"
                                    }
                                    alt={"Customer Profile Picture"}
                                    className="w-16 h-16 rounded-full border-2 border-blue-100"
                                />
                                <div className="flex-1 space-y-0.5">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {order.customer.name || "N/A"}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail
                                                size={16}
                                                className="text-gray-500"
                                            />
                                            <span className="text-gray-700">
                                                {order.customer.email}
                                            </span>
                                        </div>
                                        {order.customer.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone
                                                    size={16}
                                                    className="text-gray-500"
                                                />
                                                <span className="text-gray-700">
                                                    {order.customer.phone}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No customer information available
                            </p>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.orderItems.map((item, idx) => (
                                <OrderItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Order Status
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Order Status
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Payment Status
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment?.status ?? "PENDING")}`}
                                >
                                    {order.payment?.status ?? "PENDING"}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <span className="text-sm text-gray-600">
                                    Order Date
                                </span>
                                <p className="font-medium text-gray-800 mt-1">
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Order Summary
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-800">
                                    ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-gray-800">
                                    $0.00
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-gray-800">
                                    $0.00
                                </span>
                            </div>
                            <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                                <span className="font-semibold text-gray-800">
                                    Total
                                </span>
                                <span className="font-bold text-xl text-blue-600">
                                    ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                            {/* <div className="pt-3 border-t border-gray-200 flex justify-between">
                                <span className="text-sm text-green-600 font-medium">
                                    Total Profit
                                </span>
                                <span className="text-sm font-bold text-green-600">
                                    ${calculateProfit().toFixed(2)}
                                </span>
                            </div> */}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Items
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {order.orderItems.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Status Modal */}
            {showStatusModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40 cursor-pointer"
                        onClick={() => setShowStatusModal(false)}
                    ></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Change Order Status
                        </h3>
                        <div className="space-y-3 mb-6">
                            {orderStatuses.map((status) => (
                                <label
                                    key={status}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={selectedStatus === status}
                                        onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                        }
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
                                    >
                                        {status}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangeStatus}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
