'use server'

import { getToken } from "@/Cookies/auth.actions";
import { CreateStudentResponse, UpdateStudentData } from "@/Types/StudentTypes";

export async function UpdateStudent(student_id: number, student_data: UpdateStudentData): Promise<CreateStudentResponse> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/people/students/${student_id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(student_data)
    });

    if (!response.ok) {
        throw new Error("Failed to update student")
    }
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error updating student:", error)
    throw error
}
}