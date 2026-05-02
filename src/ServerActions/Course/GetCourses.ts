'use server'

import { getToken } from "@/Cookies/auth.actions";
import { CourseResponse } from "@/Types/CourseTypes";


export async function GetCourses(skip: number = 0, limit: number = 100): Promise<CourseResponse> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/courses?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    return data
  } catch (error) {
    console.error(" Error fetching courses from backend:", error)
    throw error
    
  }
}
