'use server'

import { getToken } from "@/Cookies/auth.actions";
import { StudentResponse } from "@/Types/StudentTypes";


export async function GetStudents(skip: number = 0, limit: number = 100): Promise<StudentResponse> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/people/students?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    return await response.json();
  } catch (error) {
    console.error(" Error fetching students from backend:", error)
    throw error
  }
}
