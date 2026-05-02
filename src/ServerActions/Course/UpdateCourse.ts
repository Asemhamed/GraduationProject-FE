'use server'

import { getToken } from "@/Cookies/auth.actions";
import { Course, CreateCourseData } from "@/Types/CourseTypes";

export async function UpdateCourse(course_id: number, updateCourseData: CreateCourseData): Promise<Course> {
    const token = await getToken();
    try {
    const response = await fetch(`http://localhost:8000/api/courses/${course_id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateCourseData)
    });

    if (!response.ok) {
        throw new Error("Failed to update course")
    }
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
}
}