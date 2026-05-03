'use server'

import { getToken } from "@/Cookies/auth.actions";
import { TimetableResponse } from "@/Types/TimetableTypes";


export async function GetTimetable(): Promise<TimetableResponse> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/timetable/`, {
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
    console.error(" Error fetching timetable from backend:", error)
    throw error
    
  }
}
