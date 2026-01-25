"use client";

import { useLogoutMutation } from "@/store/features/auth/authApiSlice";
import { useFetchProductCategoriesQuery } from "@/store/features/products/productsApiSlice";
import {
    fetchUserInfoViaThunk,
    removeUserInfo,
} from "@/store/features/user/userInfoSlice";
import Popover from "@theprojectsx/react-popover";
import {
    ArrowDown,
    ArrowRight,
    LogOut,
    Search,
    ShoppingCart,
    Smile,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Navbar = () => {
    const dispatch = useDispatch();
    const {
        data: userInfo,
        isLoading,
        isSuccess,
        isError,
    } = useSelector((state: any) => state.user_info);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: categories } = useFetchProductCategoriesQuery({});

    const [logout] = useLogoutMutation();

    useEffect(() => {
        dispatch(fetchUserInfoViaThunk() as any);
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
            dispatch(removeUserInfo());
            toast.success("Logout Successful!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Logout Failed");
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                <img src="/logo.png" alt="Site Logo" />
                            </div>
                            <span className="text-xl font-bold text-gray-800 max-sm:hidden">
                                Gadgets Area
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-10 flex-1 max-w-lg mx-6">
                        <div>
                            <Popover
                                position="bottom"
                                axis="center"
                                content={
                                    <div className="w-40 rounded-lg overflow-hidden shadow-lg bg-white">
                                        {categories?.data?.map(
                                            (category: {
                                                id: string;
                                                name: string;
                                                description: string;
                                            }) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/category/${category.name}`}
                                                    className="w-full text-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
                                                >
                                                    {category.name}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                }
                                viewOnHover
                            >
                                <button className="flex items-center gap-1 cursor-pointer">
                                    Category <ArrowDown size={16} />
                                </button>
                            </Popover>
                        </div>
                        <div className="relative w-full flex items-center">
                            <input
                                type="text"
                                placeholder="Search gadgets..."
                                className="w-full max-w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="md:hidden">
                            <Popover
                                position="bottom"
                                axis="center"
                                content={
                                    <div className="w-40 rounded-lg overflow-hidden shadow-lg bg-white">
                                        {categories?.data?.map(
                                            (category: {
                                                id: string;
                                                name: string;
                                                description: string;
                                            }) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/category/${category.name}`}
                                                    className="w-full text-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
                                                >
                                                    {category.name}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                }
                            >
                                <button className="flex items-center gap-1 cursor-pointer">
                                    Category <ArrowDown size={16} />
                                </button>
                            </Popover>
                        </div>

                        {/* Cart */}
                        <Link
                            href={"/cart"}
                            className="p-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                        >
                            <ShoppingCart className="h-6 w-6" />
                        </Link>

                        {/* Auth (Login / Register) */}
                        {!isLoading && (!userInfo || isError) && (
                            <Link
                                href={"/login"}
                                className="flex-1 bg-blue-600 text-white py-2.5 px-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2.5 cursor-pointer max-sm:text-sm"
                            >
                                <span className="px-2 text-sm text-white font-semibold">
                                    Login
                                </span>
                            </Link>
                        )}

                        {/* User Profile */}
                        {isSuccess && (
                            <Popover
                                parentStyles={{
                                    display: "block",
                                    marginInline: "auto",
                                }}
                                content={
                                    <div className="w-40 rounded-lg overflow-hidden shadow-lg bg-white">
                                        <Link href={"/profile"} className="w-full text-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 cursor-pointer">
                                            <Smile size={20} /> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <LogOut size={20} /> Logout
                                        </button>
                                    </div>
                                }
                                position="bottom"
                                axis="right"
                            >
                                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 cursor-pointer">
                                    <User className="h-6 w-6" />
                                </button>
                            </Popover>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 cursor-pointer"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Search className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search gadgets..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
