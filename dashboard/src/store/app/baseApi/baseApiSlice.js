import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_BASE_URL = "https://gadgetsarea-server.vercel.app/api";

const baseApiSlice = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: "include",
    }),
    endpoints: (builder) => ({}),
});

export default baseApiSlice;
