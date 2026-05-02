'use server'

import { getToken } from "@/Cookies/auth.actions";
import { InstructorResponse } from "@/Types/InstructorTypes";

export async function UpdateInstructor(instructor_id: number, name: string): Promise<InstructorResponse> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/people/instructors/${instructor_id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });

    if (!response.ok) {
        throw new Error("Failed to update instructor")
    }
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error updating instructor:", error)
    throw error
}
}