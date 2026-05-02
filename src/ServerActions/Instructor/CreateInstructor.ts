'use server'

import { getToken } from "@/Cookies/auth.actions";
import { CreateInstructorData, CreateInstructorResponse } from "@/Types/InstructorTypes";


export async function CreateInstructor(instructor: CreateInstructorData): Promise<CreateInstructorResponse> {
    const token = await getToken();
    
    try {
    const response = await fetch("http://localhost:8000/api/people/instructors", {
        method: "POST",
        headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": 'application/json'
        },
    body: JSON.stringify( instructor )
    })

    if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    return data
    } catch (error) {
    console.error(" Error creating instructor:", error)
    throw new Error("Failed to create instructor")
    }
}
