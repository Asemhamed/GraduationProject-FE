'use server'

import { getToken } from "@/Cookies/auth.actions";

type ToggleEnrollmentResponse = {
  message: string;
}

export async function ToggleEnrollment(
  course_Id: number,
  is_open: boolean
): Promise<ToggleEnrollmentResponse> {
  const token = await getToken();
  try {
    const response = await fetch(
      `http://localhost:8000/api/enrollment/${course_Id}/toggle?is_open=${is_open}`,
      {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    )
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error toggling enrollment from backend:", error)
    throw error
  }
}