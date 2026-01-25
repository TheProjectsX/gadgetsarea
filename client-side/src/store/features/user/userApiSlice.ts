import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const userApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUserInfo: builder.query({ query: () => "/me" }),
        updateUserInfo: builder.mutation({
            query: (data) => ({
                url: "/me",
                method: "PUT",
                body: data.body,
            }),
        }),
    }),
});

export const { useFetchUserInfoQuery, useUpdateUserInfoMutation } =
    userApiSlice;
export default userApiSlice;
