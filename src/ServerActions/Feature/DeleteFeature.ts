'use server'

import { getToken } from "@/Cookies/auth.actions";

export async function DeleteFeature(featureId: number): Promise<boolean> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/facilities/features/${featureId}`, {
      method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete feature")
    }
    return true ;
  } catch (error) {
    console.error("Error deleting feature:", error)
    throw error
  }
}