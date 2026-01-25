import baseApiSlice from "../../app/baseApi/baseApiSlice";

const cartsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrders: builder.mutation({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                body: data.body,
            }),
        }),
        fetchOrders: builder.query({
            query: (data) => ({
                url: "/orders",
                params: data.params ?? {},
            }),
        }),

        fetchSingleOrder: builder.query({
            query: (data) => ({
                url: `/orders/${data.id}`,
            }),
        }),

        cancelOrder: builder.mutation({
            query: (data) => ({
                url: `/orders/${data.id}/cancel`,
                method: "PATCH",
            }),
        }),
    }),
});

export const {
    useCreateOrdersMutation,
    useFetchOrdersQuery,
    useFetchSingleOrderQuery,
    useCancelOrderMutation,
} = cartsApiSlice;
export default cartsApiSlice;
