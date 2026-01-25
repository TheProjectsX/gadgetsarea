import { useState } from "react";
import { Loader, Search } from "lucide-react";
import ProductsTable from "./table";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import { useFetchProductsQuery } from "../../store/features/products/productsApiSlice";
import { TableSkeleton } from "../../components/Skeletons";
import EmptyState from "../../components/EmptyState";

const ProductsList = () => {
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
    });

    const {
        data: response,
        isLoading,
        isFetching,
        refetch,
    } = useFetchProductsQuery({ params });

    console.log(response);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Products
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your product inventory and pricing
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isFetching && (
                        <Loader
                            className="animate-spin text-gray-600"
                            size={24}
                        />
                    )}
                    <Link
                        to={"/products/edit"}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + Add New Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <form
                        className="relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const search = e.target.search.value;
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
                            placeholder="Search by name or category..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </form>
                </div>

                <div className="overflow-x-auto">
                    {/* Loading State */}
                    {isLoading && !response?.data && <TableSkeleton />}

                    {/* Loaded State */}
                    {response?.data && response.data.length > 0 && (
                        <ProductsTable
                            products={response?.data}
                            refetch={refetch}
                        />
                    )}
                    {/* Empty State */}
                    {response?.data && response.data.length === 0 && (
                        <EmptyState title="No User to Show" />
                    )}
                </div>

                <div className="flex items-center justify-center w-full p-5">
                    {response?.data && response.data.length > 0 && (
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

export default ProductsList;
