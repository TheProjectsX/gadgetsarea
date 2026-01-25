import baseApiSlice from "../../app/baseApi/baseApiSlice";

const categoriesApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchCategories: builder.query({
            query: (data) => ({
                url: "/categories/admin",
                params: data.params ?? {},
            }),
        }),

        fetchSingleCategory: builder.query({
            query: (data) => ({
                url: `/categories/${data.id}`,
            }),
        }),

        createCategory: builder.mutation({
            query: (data) => ({
                url: `/categories`,
                method: "POST",
                body: data.body,
            }),
        }),

        updateCategory: builder.mutation({
            query: (data) => ({
                url: `/categories/${data.id}`,
                method: "PATCH",
                body: data.body,
            }),
        }),

        toggleCategoryStatus: builder.mutation({
            query: (data) => ({
                url: `/categories/${data.id}/toggle-status`,
                method: "PATCH",
                body: data.body,
            }),
        }),

        deleteCategory: builder.mutation({
            query: (data) => ({
                url: `/categories/${data.id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useFetchCategoriesQuery,
    useFetchSingleCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useToggleCategoryStatusMutation,
    useDeleteCategoryMutation,
} = categoriesApiSlice;
export default categoriesApiSlice;
