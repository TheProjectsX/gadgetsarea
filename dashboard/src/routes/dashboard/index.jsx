import { DollarSign, Layers, Package, ShoppingCart, Users } from "lucide-react";
import { useFetchStatisticsQuery } from "../../store/features/admin/adminApiSlice";
import { StatisticCard, StatisticSkeleton } from "./components";

const Dashboard = () => {
    const { data: response, isLoading } = useFetchStatisticsQuery({});
    const statistics = response?.data;

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

            {/* If Loading */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(5).fill(null).map((_, idx) => (
                        <StatisticSkeleton key={idx} />
                    ))}
                </div>
            )}

            {/* If Loaded */}
            {!isLoading && statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatisticCard
                        icon={Users}
                        title="Total Customers"
                        value={statistics.totalCustomers}
                    />

                    <StatisticCard
                        icon={ShoppingCart}
                        title="Total Orders"
                        value={statistics.totalOrders}
                    />

                    <StatisticCard
                        icon={DollarSign}
                        title="Total Income"
                        value={statistics.totalIncome}
                    />

                    <StatisticCard
                        icon={Package}
                        title="Total Products"
                        value={statistics.totalProducts}
                    />

                    <StatisticCard
                        icon={Layers}
                        title="Total Categories"
                        value={statistics.totalCategories}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
