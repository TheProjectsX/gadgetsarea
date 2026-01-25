"use client";

import { Loader } from "lucide-react";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";

const withAuth = (WrappedComponent: any) => {
    return function ProtectedComponent(props: any) {
        const { data: userInfo, isLoading: isUserInfoLoading } = useSelector(
            (state: any) => state.user_info,
        );

        if (isUserInfoLoading) {
            return (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                    <Loader className="animate-spin text-blue-600" size={48} />
                    <p className="mt-4 text-gray-600 text-sm">Loading…</p>
                </div>
            );
        }

        if (!userInfo) {
            return notFound();
        }
        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
