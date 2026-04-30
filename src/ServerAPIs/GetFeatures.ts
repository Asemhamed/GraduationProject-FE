'use server'

import { getToken } from "@/Cookies/auth.actions";


export async function GetFeaturs(): Promise<any> {
  const token = await getToken();
  try {
    const response = await fetch("http://localhost:8000/api/facilities/features?skip=0&limit=100", {
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
    console.error(" Error fetching features from backend:", error)
    return Response.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    )
  }
}
