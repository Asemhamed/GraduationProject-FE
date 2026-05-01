'use server'

import { getToken } from "@/Cookies/auth.actions";

export async function DeleteRoom(roomId: number): Promise<boolean> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/facilities/rooms/${roomId}`, {
      method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete room")
    }
    return true ;
  } catch (error) {
    console.error("Error deleting room:", error)
    throw error
  }
}