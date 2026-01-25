import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import OrdersTable from "./table";
import Pagination from "../../components/pagination";
import { TableSkeleton } from "../../components/Skeletons";
import { useFetchOrdersQuery } from "../../store/features/orders/ordersApiSlice";

const OrdersList = () => {
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
    });

    const {
        data: response,
        isLoading,
        isFetching,
        refetch,
    } = useFetchOrdersQuery({ params });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and track customer orders
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <form
                        className="relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const search = e.search.value;
                            setParams((prev) => ({ ...prev, page: 1, search }));
                        }}
                    >
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by customer name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </form>
                </div>

                <div className="overflow-x-auto">
                    {/* Loading State */}
                    {isLoading && !response?.data && <TableSkeleton />}

                    {/* Loaded State */}
                    {response?.data && response?.data.length > 0 && (
                        <OrdersTable orders={response.data} refetch={refetch} />
                    )}

                    {/* Empty State */}
                    {response?.data && response.data?.length === 0 && (
                        <EmptyState title="No User to Show" />
                    )}
                </div>

                <div className="flex items-center justify-center w-full p-5">
                    {response?.data && response.data?.length > 0 && (
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

export default OrdersList;
