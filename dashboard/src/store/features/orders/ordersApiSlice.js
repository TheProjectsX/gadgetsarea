import baseApiSlice from "../../app/baseApi/baseApiSlice";

const ordersApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchOrders: builder.query({
            query: (data) => ({
                url: "/admin/orders",
                params: data.params ?? {},
            }),
        }),

        fetchSingleOrder: builder.query({
            query: (data) => ({
                url: `/admin/orders/${data.id}`,
            }),
        }),

        updateOrderStatus: builder.mutation({
            query: (data) => ({
                url: `/admin/orders/${data.id}/status`,
                method: "PATCH",
                body: data.body,
            }),
        }),

        deleteOrder: builder.mutation({
            query: (data) => ({
                url: `/admin/orders/${data.id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useFetchOrdersQuery,
    useFetchSingleOrderQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation,
} = ordersApiSlice;
export default ordersApiSlice;
