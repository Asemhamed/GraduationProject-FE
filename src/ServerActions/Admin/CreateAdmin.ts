'use server'

import { getToken } from "@/Cookies/auth.actions";
import { CreateAdminData, CreateAdminResponse } from "@/Types/AdminTypes";


export async function CreateAdmin(admin: CreateAdminData): Promise<CreateAdminResponse> {
    const token = await getToken();
    
    try {
    const response = await fetch("http://localhost:8000/api/people/admins", {
        method: "POST",
        headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": 'application/json'
        },
        body: JSON.stringify( admin )
    })

    if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    return data
    } catch (error) {
    console.error(" Error creating admin:", error)
    throw new Error("Failed to create admin")
    }
}
