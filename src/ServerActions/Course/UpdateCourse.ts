'use server'
import { getToken } from "@/cookies/auth.actions";
import { Course, UpdateCourseData } from "@/Types/CourseTypes";
import { revalidatePath } from "next/cache";

export async function UpdateCourse(courseId: number, course: UpdateCourseData): Promise<Course> {
  const token = await getToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_name: course.course_name,
      instructor_ids: course.instructor_ids,
      feature_ids: course.feature_ids,
    }),
  });

  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}`);
  }

  const data: Course = await response.json();

  revalidatePath("/admin");
  revalidatePath("/instructor");
  revalidatePath("/student");

  return data;
}