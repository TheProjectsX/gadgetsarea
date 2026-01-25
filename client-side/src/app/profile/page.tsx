"use client";

import {
    Mail,
    Phone,
    Calendar,
    ShoppingCart,
    DollarSign,
    Package,
    Activity,
    Edit3,
    PenTool,
    Save,
} from "lucide-react";
import { DataCard } from "./components";
import OrdersTable from "./table";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { EditProfile } from "./modal";
import withAuth from "@/hoc/withAuth";
import { useSelector } from "react-redux";
import { useFetchOrdersQuery } from "@/store/features/orders/ordersApiSlice";
import { TableSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import ReactHead from "@theprojectsx/react-head";

const UserDetailsPage = () => {
    const { data } = useSelector((state: any) => state.user_info);
    const user = data?.data;

    const [currentAvatar, setCurrentAvatar] = useState<{
        url: string;
        file?: File;
    }>({ url: user.profile?.avatar });
    const [showEditModal, setShowEditModal] = useState(false);

    const [params, setParams] = useState({
        limit: 10,
        page: 1,
    });
    const { data: response, isLoading } = useFetchOrdersQuery({
        id: user.id,
        params,
    });
    const orders = response?.data;

    const handleUploadAvatar = () => {};

    return (
        <>
            <ReactHead>
                <title>User Profile</title>
            </ReactHead>
            <div className="space-y-6">
                {/* User Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                    <div className="p-6">
                        <div className="flex flex-col lg:items-center lg:flex-row lg:justify-between gap-6">
                            {/* Avatar and Name Section */}
                            <div className="flex flex-col items-center lg:items-start">
                                <div className="relative rounded-full group">
                                    <img
                                        src={currentAvatar.url}
                                        alt={user.profile.name}
                                        className="w-32 h-32 rounded-full border-4 border-blue-100"
                                    />

                                    {/* Overlay */}
                                    <label className="rounded-full absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer">
                                        <PenTool
                                            size={20}
                                            className="text-white"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (!file) return;

                                                const blobUrl =
                                                    URL.createObjectURL(file);
                                                setCurrentAvatar({
                                                    url: blobUrl,
                                                    file,
                                                });
                                            }}
                                        />
                                    </label>

                                    {currentAvatar.file && (
                                        <button
                                            onClick={handleUploadAvatar}
                                            className="text-white bg-blue-500 p-1 rounded-sm cursor-pointer absolute right-2 top-2 z-50"
                                        >
                                            <Save size={15} />
                                        </button>
                                    )}
                                </div>

                                <h2 className="mt-4 text-xl font-bold text-gray-800 text-center w-full">
                                    {user.profile.name}
                                </h2>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-4 lg:w-2/3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                    <DataCard
                                        icon={Mail}
                                        label="Email"
                                        value={user.email}
                                    />
                                    <DataCard
                                        icon={Phone}
                                        label="Phone"
                                        value={user.profile.phone}
                                    />
                                    <DataCard
                                        icon={Calendar}
                                        label="Member Since"
                                        value={new Date(
                                            user.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    />
                                    <DataCard
                                        icon={Activity}
                                        label="Status"
                                        value={user.status}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="absolute top-5 right-5 p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setShowEditModal(true)}
                    >
                        <Edit3 size={16} />
                    </button>

                    {/* Statistics */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Package
                                        size={24}
                                        className="text-blue-600"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Orders
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {user.totalOrders}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <DollarSign
                                        size={24}
                                        className="text-green-600"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Payments
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">
                                        ৳{user.totalPayment.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <ShoppingCart
                                        size={24}
                                        className="text-purple-600"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Active Carts
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {user.totalCarts}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Order History
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            View all orders placed by this user
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        {/* Loading State */}
                        {isLoading && !orders && (
                            <TableSkeleton rows={5} cols={5} />
                        )}

                        {/* Loaded State */}
                        {orders && orders.length > 0 && (
                            <OrdersTable orders={response.data} />
                        )}

                        {/* Empty State */}
                        {orders && orders.length === 0 && (
                            <EmptyState title="No User to Show" />
                        )}
                    </div>

                    <div className="flex items-center justify-center w-full p-5">
                        {orders && orders.length > 0 && (
                            <Pagination
                                totalPages={
                                    response?.pagination?.totalPages ?? 1
                                }
                                currentPage={params.page}
                                onPageChange={(page) =>
                                    setParams((prev) => ({ ...prev, page }))
                                }
                            />
                        )}
                    </div>
                </div>

                {showEditModal && (
                    <EditProfile
                        profile={user.profile}
                        closeModal={() => setShowEditModal(false)}
                    />
                )}
            </div>
        </>
    );
};

export default withAuth(UserDetailsPage);
