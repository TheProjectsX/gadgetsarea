import { useState } from "react";

export const EditProfile = ({
    profile,
    closeModal,
}: {
    profile: any;
    closeModal: () => void;
}) => {
    const [profileData, setProfileData] = useState<Record<string, string>>(profile);

    return (
        <>
            <div
                className="fixed inset-0 bg-black/20 z-40 cursor-pointer mb-0"
                onClick={() => closeModal()}
            ></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Update Profile
                </h3>
                <div className="space-y-3 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData?.name}
                            onChange={(e) =>
                                setProfileData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData?.phone}
                            onChange={(e) =>
                                setProfileData((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => closeModal()}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                        Update
                    </button>
                </div>
            </div>
        </>
    );
};
