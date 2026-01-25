import baseApiSlice from "../../app/baseApi/baseApiSlice";

const productsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params: params ?? {},
            }),
        }),
        fetchSingleProduct: builder.query({
            query: (data) => ({
                url: `/products/${data.id}`,
            }),
        }),
        fetchProductFilters: builder.query({
            query: (data) => ({
                url: `/products/filters/${data.name}`,
            }),
        }),
        fetchProductCategories: builder.query({
            query: (data) => ({
                url: `/categories`,
            }),
        }),
    }),
});

export const {
    useFetchProductsQuery,
    useFetchSingleProductQuery,
    useFetchProductFiltersQuery,
    useFetchProductCategoriesQuery
} = productsApiSlice;
export default productsApiSlice;
