import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    ShoppingCart,
    DollarSign,
    Package,
    Activity,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { DataCard } from "./components";
import OrdersTable from "./table";
import { useEffect, useState } from "react";
import Pagination from "../../../components/pagination";
import { toast } from "react-toastify";
import { useFetchUserOrdersQuery } from "../../../store/features/users/usersApiSlice";
import { TableSkeleton } from "../../../components/Skeletons";

const UserDetailsPage = () => {
    const navigate = useNavigate();
    const { data: user } = useLoaderData();

    if (!user) {
        toast.error("User not Found!");
        navigate("/users", { replace: true });
        return null;
    }

    const [params, setParams] = useState({
        limit: 10,
        page: 1,
    });

    const {
        data: response,
        isLoading,
        isFetching,
        isError,
        error,
    } = useFetchUserOrdersQuery({
        id: user.id,
        params,
    });

    useEffect(() => {
        if (!isError) return
        console.error(error);
        toast.error(error?.data?.message ?? error?.message ?? "Failed to get Orders");
    }, [isError, error]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        User Details
                    </h1>
                    <p className="text-gray-600 mt-1">
                        View and manage user information
                    </p>
                </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col lg:items-center lg:flex-row lg:justify-between gap-6">
                        {/* Avatar and Name Section */}
                        <div className="flex flex-col items-center lg:items-start">
                            <img
                                src={user.profile.avatar}
                                alt={user.profile.name}
                                className="w-32 h-32 rounded-full border-4 border-blue-100"
                            />
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

                {/* Statistics */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Package size={24} className="text-blue-600" />
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
                    {isLoading && !response?.data && (
                        <TableSkeleton rows={5} cols={5} />
                    )}

                    {/* Loaded State */}
                    {response?.data && response?.data.length > 0 && (
                        <OrdersTable orders={response.data} />
                    )}

                    {/* Empty State */}
                    {response?.data && response?.data.length === 0 && (
                        <EmptyState title="No User to Show" />
                    )}
                </div>

                <div className="flex items-center justify-center w-full p-5">
                    {response?.data && response?.data.length > 0 && (
                        <Pagination
                            totalPages={response?.pagination?.totalPages ?? 1}
                            currentPage={params.page}
                            onPageChange={(page) =>
                                setParams((prev) => ({ ...prev, page }))
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;
