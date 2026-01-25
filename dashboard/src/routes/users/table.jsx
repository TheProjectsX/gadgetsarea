import Popover from "@theprojectsx/react-popover";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    useDeleteUserMutation,
    useUpdateStatusMutation,
} from "../../store/features/users/usersApiSlice";
import { toast } from "react-toastify";

const UsersTable = ({ users, refetch }) => {
    const [usersList, setUsersList] = useState(users);

    useEffect(() => {
        setUsersList(users);
    }, [users]);

    const [updateStatus] = useUpdateStatusMutation();
    const [deleteUser] = useDeleteUserMutation();

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateStatus({
                id: userId,
                body: { status: newStatus },
            }).unwrap();

            setUsersList((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, status: newStatus } : user,
                ),
            );
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to change Status");
        }
    };

    const handleDelete = async (userId) => {
        // TODO: Take confirmation

        try {
            await deleteUser({
                id: userId,
            }).unwrap();

            refetch?.();
            toast.success("User Delete!");
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to change Status");
        }
    };

    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        User
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Contact
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Status
                    </th>
                    {/* <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Verified
                    </th> */}
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Joined
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {usersList.map((user) => (
                    <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <img
                                    src={
                                        user.profile.avatar ??
                                        "https://i.ibb.co.com/jPT0HBj4/istockphoto-692687226-612x612.jpg"
                                    }
                                    alt={user.profile.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.profile.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                                {user.profile.phone}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <select
                                value={user.status}
                                onChange={(e) =>
                                    handleStatusChange(user.id, e.target.value)
                                }
                                className={`px-3 py-1 text-xs font-semibold cursor-pointer border-0 bg-gray-100 outline-none`}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="SUSPENDED">SUSPENDED</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    },
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap relative">
                            <Popover
                                parentStyles={{
                                    marginInline: "auto",
                                    display: "block",
                                }}
                                content={
                                    <div className="w-32 rounded-lg overflow-hidden shadow text-sm bg-white flex flex-col">
                                        <Link
                                            to={`/users/${user.id}`}
                                            className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            Delete User
                                        </button>
                                    </div>
                                }
                                position="bottom"
                                axis="center"
                            >
                                <button className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                                    <MoreVertical size={20} />
                                </button>
                            </Popover>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
