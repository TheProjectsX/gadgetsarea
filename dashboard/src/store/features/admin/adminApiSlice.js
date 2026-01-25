import baseApiSlice from "../../app/baseApi/baseApiSlice";

const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchStatistics: builder.query({
            query: () => "/admin/statistics",
        }),
        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "/admin/login",
                method: "POST",
                body: data.body,
            }),
        }),
        logoutAdmin: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
        fetchInfo: builder.query({
            query: () => "/me",
        }),
    }),
});

export const {
    useFetchStatisticsQuery,
    useLoginAdminMutation,
    useLogoutAdminMutation,
    useFetchInfoQuery,
} = adminApiSlice;
export default adminApiSlice;
