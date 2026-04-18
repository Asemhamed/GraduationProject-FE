'use server';

import { cookies } from "next/headers";

export async function setToken(token:string): Promise<void> {
    const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly:true,
            maxAge:30*24*60*60
        });
    
}

export async function removeToken(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}

export async function getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    return token?.value || null;
}