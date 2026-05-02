'use server'

import { getToken } from "@/Cookies/auth.actions";

export async function DeleteInstructor(instructorId: number): Promise<boolean> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/people/instructors/${instructorId}`, {
      method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete instructor");
    }
    return true ;
  } catch (error) {
    console.error("Error deleting instructor:", error)
    throw error
  }
}
