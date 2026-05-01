'use server'

import { getToken } from "@/Cookies/auth.actions";

export async function UpdateFeature(feature_id: number, feature_name: string): Promise<any> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/facilities/features/${feature_id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feature_name, feature_id })
    });

    if (!response.ok) {
        throw new Error("Failed to update feature")
    }
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error updating feature:", error)
    throw error
}
}