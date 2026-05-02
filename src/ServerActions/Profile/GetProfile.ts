import { getToken } from "@/Cookies/auth.actions";
import { AdminResponse } from "@/Types/AdminTypes";

export async function GetProfile(): Promise<AdminResponse | null> {
  const token = await getToken();
  
  if (!token) return null; 
  try {
    const response = await fetch(`http://localhost:8000/api/people/me`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store" 
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}