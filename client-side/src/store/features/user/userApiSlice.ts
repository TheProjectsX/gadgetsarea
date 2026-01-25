import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const userApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUserInfo: builder.query({ query: () => "/me" }),
        updateUserInfo: builder.mutation({
            query: (data) => ({
                url: "/me",
                method: "PATCH",
                body: data.body,
            }),
        }),
        uploadUserAvatar: builder.mutation({
            query: (data) => ({
                url: "/me/avatar",
                method: "PATCH",
                body: data.body,
            }),
        }),
    }),
});

export const {
    useFetchUserInfoQuery,
    useUpdateUserInfoMutation,
    useUploadUserAvatarMutation,
} = userApiSlice;
export default userApiSlice;
