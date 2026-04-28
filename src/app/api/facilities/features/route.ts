import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      )
    }

    const response = await fetch("http://localhost:8000/api/facilities/features?skip=0&limit=100", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API responded with status ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching features from backend:", error)
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    )
  }
}
