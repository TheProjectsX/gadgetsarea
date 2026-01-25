"use client";

import React, { useState } from "react";

const TabContents = ({
    tabs,
    children,
    defaultTab,
}: {
    tabs: { label: string; value: string }[];
    children: React.ReactElement | React.ReactElement[];
    defaultTab?: string;
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0].value);
    const reactChildArray = React.Children.toArray(
        children,
    ) as React.ReactElement<{ "data-key": string }>[];

    const filteredTabs = tabs.filter((tab) =>
        reactChildArray
            .map((child) => child.props["data-key"])
            .includes(tab.value),
    );

    const CurrentElement = reactChildArray.find(
        (elm) => elm.props["data-key"] === activeTab,
    );

    return (
        <>
            <div className="border-b border-gray-200">
                <div className="flex gap-4 px-6">
                    {filteredTabs.map((item) => {
                        return (
                            <button
                                key={item.value}
                                onClick={() => setActiveTab(item.value)}
                                className={`py-4 px-4 max-sm:text-sm font-semibold transition border-b-2 cursor-pointer ${
                                    activeTab === item.value
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-6">{CurrentElement}</div>
        </>
    );
};

export default TabContents;
