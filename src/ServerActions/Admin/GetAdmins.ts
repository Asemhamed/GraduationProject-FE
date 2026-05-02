'use server'

import { getToken } from "@/Cookies/auth.actions";
import { AdminResponse } from "@/Types/AdminTypes";


export async function GetAdmins(skip: number = 0, limit: number = 100): Promise<AdminResponse[]> {
  const token = await getToken();
  try {
    const response = await fetch(`http://localhost:8000/api/people/admins?skip=${skip}&limit=${limit}`, {
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
    console.error(" Error fetching admins from backend:", error)
    throw error
  }
}
