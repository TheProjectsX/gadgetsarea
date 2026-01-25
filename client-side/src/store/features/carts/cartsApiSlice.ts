import baseApiSlice from "../../app/baseApi/baseApiSlice";

const cartsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: (data) => ({
                url: "/carts",
                method: "POST",
                body: data.body,
            }),
        }),

        fetchAllCart: builder.query({
            query: (data) => ({
                url: "/carts",
            }),
        }),

        removeFromCart: builder.mutation({
            query: (data) => ({
                url: `/carts/${data.id}`,
                method: "DELETE",
            }),
        }),
        updateCart: builder.mutation({
            query: (data) => ({
                url: `/carts/${data.id}`,
                method: "PATCH",
                body: data.body,
            }),
        }),
    }),
});

export const {
    useAddToCartMutation,
    useFetchAllCartQuery,
    useRemoveFromCartMutation,
    useUpdateCartMutation,
} = cartsApiSlice;
export default cartsApiSlice;
