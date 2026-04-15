import { authReducer } from "@/app/(Auth)/_authSlices/authSlice";
import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer:{
        authReducer
    }
})