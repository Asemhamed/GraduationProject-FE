import { GetStudents } from "@/ServerActions/Student/GetStudents"
import StudentsLayout from "../_Components/students-layout"

export default async function StudentsPage() {
  const students = await GetStudents();
  
  return (
    <StudentsLayout
      initialStudents={students}
    />
  )
}
