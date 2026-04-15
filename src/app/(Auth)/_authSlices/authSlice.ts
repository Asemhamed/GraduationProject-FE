import { createSlice } from "@reduxjs/toolkit";

type User ={
    id: number,
    name: string,
    email: string,
}

type AuthState = {
    user: User | null,
    token: string | null,
}
const initialState: AuthState = {
    user: null,
    token: null,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {}
})


export const authReducer = authSlice.reducer;
export const {} = authSlice.actions;