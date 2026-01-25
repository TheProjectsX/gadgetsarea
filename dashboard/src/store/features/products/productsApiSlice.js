import baseApiSlice from "../../app/baseApi/baseApiSlice";

const productsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/admin/products",
                method: "POST",
                body: data.body,
            }),
        }),

        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/admin/products/${data.id}`,
                method: "PATCH",
                body: data.body,
            }),
        }),

        insertProductVariations: builder.mutation({
            query: (data) => ({
                url: `/admin/products/variations`,
                method: "POST",
                body: data.body,
            }),
        }),

        insertProductSpecs: builder.mutation({
            query: (data) => ({
                url: `/admin/products/specs`,
                method: "POST",
                body: data.body,
            }),
        }),
        insertProductDescription: builder.mutation({
            query: (data) => ({
                url: `/admin/products/description`,
                method: "POST",
                body: data.body,
            }),
        }),

        updateProductStatus: builder.mutation({
            query: (data) => ({
                url: `/admin/products/${data.id}/status`,
                method: "PATCH",
                body: data.body,
            }),
        }),

        deleteProduct: builder.mutation({
            query: (data) => ({
                url: `/admin/products/${data.id}`,
                method: "DELETE",
            }),
        }),

        fetchProducts: builder.query({
            query: (data) => ({
                url: "/admin/products",
                params: data.params ?? {},
            }),
        }),
        fetchSingleProduct: builder.query({
            query: (data) => ({
                url: `/admin/products/${data.id}`,
            }),
        }),
    }),
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useInsertProductVariationsMutation,
    useInsertProductSpecsMutation,
    useInsertProductDescriptionMutation,
    useUpdateProductStatusMutation,
    useDeleteProductMutation,
    useFetchProductsQuery,
    useFetchSingleProductQuery,
} = productsApiSlice;
export default productsApiSlice;
