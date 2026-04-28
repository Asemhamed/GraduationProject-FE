export async function GET(request: Request) {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3Nzc5OTQ4ODJ9.yj3VIYF0kt3idHSezL3yN_xwZRG5t4KQyN7Ltqum00w"
  
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
    
    return Response.json(data)
  } catch (error) {
    console.error("[v0] Error fetching features from backend:", error)
    return Response.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    )
  }
}
