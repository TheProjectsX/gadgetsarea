import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApiSlice = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
        credentials: "include",
    }),
    endpoints: (builder) => ({}),
});

export default baseApiSlice;
