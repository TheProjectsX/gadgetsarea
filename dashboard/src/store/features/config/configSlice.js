import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
    name: "site_config",
    initialState: {
        auth_data: null,
    },
    reducers: {
        setAuthData: (state, action) => {
            state["auth_data"] = action.payload;
        },
    },
});

export default configSlice.reducer;
export const { setAuthData } = configSlice.actions;
