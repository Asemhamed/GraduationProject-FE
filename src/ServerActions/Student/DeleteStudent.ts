'use server'

import { getToken } from "@/Cookies/auth.actions";
import { revalidatePath } from "next/cache";

export async function DeleteStudent(studentId: number): Promise<boolean> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/people/students/${studentId}`, {
      method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete student");
    }
        revalidatePath("/admin");
        revalidatePath("/instructor");
        revalidatePath("/student");
    
    return true ;
  } catch (error) {
    console.error("Error deleting student:", error)
    throw error
  }
}