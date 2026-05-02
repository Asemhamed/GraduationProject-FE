'use server'

import { getToken } from "@/Cookies/auth.actions";
import { GetInstructorsResponse } from "@/Types/InstructorTypes";


export async function GetInstructors(skip: number = 0, limit: number = 100): Promise<GetInstructorsResponse> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/people/instructors?skip=${skip}&limit=${limit}`, {
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
    console.error(" Error fetching instructors from backend:", error)
    throw error
  }
}
