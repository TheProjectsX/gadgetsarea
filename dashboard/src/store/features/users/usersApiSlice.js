import baseApiSlice from "../../app/baseApi/baseApiSlice";

const usersApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUsers: builder.query({
            query: (data) => ({
                url: `/users`,
                params: data.params ?? {},
            }),
        }),
        fetchSingleUser: builder.query({
            query: (data) => ({
                url: `/users/${data.id}`,
            }),
        }),

        fetchUserOrders: builder.query({
            query: (data) => ({
                url: `/users/${data.id}/orders`,
                params: data.params ?? {}
            }),
        }),

        updateStatus: builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}/status`,
                method: "PATCH",
                body: data.body,
            }),
        }),

        deleteUser: builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useFetchUsersQuery,
    useFetchSingleUserQuery,
    useUpdateStatusMutation,
    useDeleteUserMutation,
    useFetchUserOrdersQuery,
} = usersApiSlice;
export default usersApiSlice;
