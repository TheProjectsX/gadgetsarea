import { useEffect, useState } from "react";
import { Menu, X, Home, Users, Box, Clipboard, Grid } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    useFetchInfoQuery,
    useLogoutAdminMutation,
} from "./store/features/admin/adminApiSlice";
import { setAuthData } from "./store/features/config/configSlice";
import { Bounce, toast, ToastContainer } from "react-toastify";

const navigationItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Category", icon: Grid, path: "/categories" },
    { name: "Products", icon: Box, path: "/products" },
    { name: "Orders", icon: Clipboard, path: "/orders" },
];

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(navigationItems[0]);

    const [logoutUser] = useLogoutAdminMutation();

    const authInfo = useSelector((state) => state.site_config.auth_data);

    if (!authInfo) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(setAuthData(null));
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to Logout");
        }
    };

    // console.log(authResponse);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className="min-h-screen bg-gray-50">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {sidebarOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                            <h1 className="text-xl font-bold text-blue-600">
                                {currentPage.name}
                            </h1>
                        </div>
                    </div>
                </header>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="hidden lg:flex items-center px-6 py-5 border-b border-gray-200">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                    D
                                </span>
                            </div>
                            <h1 className="ml-3 text-xl font-bold text-gray-800">
                                Dashboard
                            </h1>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 overflow-y-auto mt-16 lg:mt-0">
                            <ul className="space-y-2 [&_.active]:text-blue-600! [&_.active>svg]:text-blue-600! [&_.active]:bg-blue-50!">
                                {navigationItems.map((item) => (
                                    <li key={item.name}>
                                        <NavLink
                                            onClick={() => setCurrentPage(item)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors group text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
                                            to={item.path}
                                        >
                                            <item.icon
                                                size={20}
                                                className={
                                                    "text-gray-500 group-hover:text-blue-600"
                                                }
                                            />
                                            <span className="ml-3 font-medium">
                                                {item.name}
                                            </span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* User Profile */}
                        <div className="px-4 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center">
                                    <img
                                        src={
                                            authInfo.avatar ??
                                            "https://i.ibb.co.com/Dfp53bmp/user-avatar.png"
                                        }
                                        alt="User Avatar"
                                        className="w-10 h-10 bg-blue-600 rounded-full"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-800">
                                            {authInfo.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {authInfo.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:ml-64 min-h-screen">
                    {/* Desktop Header */}
                    <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
                        <div className="flex items-center justify-between px-8 py-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Welcome Back
                            </h2>
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={"/products/edit"}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    New Product
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-4 lg:p-8 mt-16 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
