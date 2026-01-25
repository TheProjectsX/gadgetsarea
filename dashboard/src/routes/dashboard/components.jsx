import React from "react";

export const StatisticCard = ({ icon: Icon, title, value }) => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-blue-600 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                        {value}
                    </p>
                </div>
                <Icon className="text-blue-600" size={32} />
            </div>
        </div>
    );
};

export const StatisticSkeleton = () => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-4 w-24 bg-blue-100 rounded mb-2" />
                    <div className="h-8 w-32 bg-blue-200 rounded" />
                </div>
                <div className="h-8 w-8 bg-blue-200 rounded-full" />
            </div>
        </div>
    );
};
