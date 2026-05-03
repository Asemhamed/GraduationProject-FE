'use server'

import { getToken } from "@/Cookies/auth.actions";
import { TimetableEntry } from "@/Types/TimetableTypes";


export async function TriggerGeneration(): Promise<TimetableEntry> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/solver/generate`, {
      method: "POST",
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
    console.error(" Error triggering timetable generation from backend:", error)
    throw error
    
  }
}
