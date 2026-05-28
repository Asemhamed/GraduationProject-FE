import { GetCourses } from "@/ServerActions/Course/GetCourses"
import { GetProfile } from "@/ServerActions/Profile/GetProfile"
import { Course } from "@/Types/CourseTypes"
import { StudentStateGrid } from "./_Components/student-state-gird"

export default async function StudentDashboard() {
  const [profileData, allCourses] = await Promise.all([
    GetProfile(),
    GetCourses(0, 1000),
  ])

  const enrolled: Course[] = profileData
    ? allCourses.filter((c: Course) =>
        c.students.some((s) => s.student_id === profileData.student_id)
      )
    : []

  return <StudentStateGrid student={profileData} courses={enrolled} />
}