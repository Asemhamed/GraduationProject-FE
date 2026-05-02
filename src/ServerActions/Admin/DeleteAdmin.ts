'use server'

import { getToken } from "@/Cookies/auth.actions";

export async function DeleteAdmin(adminId: number): Promise<boolean> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/people/admins/${adminId}`, {
      method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete admin");
    }
    return true ;
  } catch (error) {
    console.error("Error deleting admin:", error)
    throw error
  }
}