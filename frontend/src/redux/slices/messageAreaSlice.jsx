import { createSlice } from "@reduxjs/toolkit";

const messageAreaSlice = createSlice({
    name:"messageArea",
    initialState: {paddingBottom : 56},
    reducers:{
        setPaddingBottom: (state, action) =>{
            state.paddingBottom = action.payload;
        }
    }
});

export const {setPaddingBottom} = messageAreaSlice.actions;
export default messageAreaSlice.reducer;