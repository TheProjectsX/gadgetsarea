import { configureStore } from "@reduxjs/toolkit";
import baseApiSlice from "./baseApi/baseApiSlice";
import siteConfigReducer from "../features/config/configSlice";

const store = configureStore({
    reducer: {
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
        site_config: siteConfigReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
});

// export type AppDispatch = typeof store.dispatch;
export default store;
