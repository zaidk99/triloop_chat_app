import { createSlice } from "@reduxjs/toolkit";
import { tokenUtils } from "../../utils/tokenUtils";

const initialState = {
    user : tokenUtils.getUser(),
    token : tokenUtils.getToken(),
    isAuthenticated : tokenUtils.isAuthenticated(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state,action)=>{
            const {token,user} = action.payload;
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            tokenUtils.setAuth(token , user);
        },
        logout: (state)=>{
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            tokenUtils.clearAuth();
        },
    },
});

export const {setAuth , logout} = authSlice.actions;
export default authSlice.reducer;
