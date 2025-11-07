import { configureStore } from "@reduxjs/toolkit";
import messageAreaReducer from "./slices/messageAreaSlice";
import friendsReducer from "./slices/friendsSlice.jsx"

export const store = configureStore({
    reducer:{
        friends: friendsReducer,
        messageArea: messageAreaReducer
    }
});