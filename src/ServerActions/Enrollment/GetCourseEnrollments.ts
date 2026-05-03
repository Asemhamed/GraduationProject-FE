'use server'

import { getToken } from "@/Cookies/auth.actions";
import { StudentResponse } from "@/Types/StudentTypes";


export async function GetCourseEnrollments(course_Id:number): Promise<StudentResponse> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/enrollment/${course_Id}/students`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json();
    console.log( );
    
    return data
  } catch (error) {
    console.error(" Error fetching course enrollments from backend:", error)
    throw error
    
  }
}
