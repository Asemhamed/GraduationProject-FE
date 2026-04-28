'use server'

import { useUserData } from "@/Context/UserData"

export async function GetFeaturs() {
  const { token } = useUserData()

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
    console.error("[v0] Error fetching features from backend:", error)
    return Response.json(
      { error: "Failed to fetch features ss" },
      { status: 500 }
    )
  }
}
