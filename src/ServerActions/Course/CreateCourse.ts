'use server'

import { getToken } from "@/Cookies/auth.actions";
import { Course, CreateCourseData } from "@/Types/CourseTypes";


export async function CreateCourse(course: CreateCourseData): Promise<Course> {
    const token = await getToken();
    
    try {
    const response = await fetch("http://localhost:8000/api/courses", {
        method: "POST",
        headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": 'application/json'
        },
    body: JSON.stringify( course )
    })

    if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    return data
    } catch (error) {
    console.error(" Error creating course:", error)
    throw new Error("Failed to create course")
    }
}
