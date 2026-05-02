
import { GetInstructors } from "@/ServerActions/Instructor/GetInstructor";
import InstructorsLayout from "../_Components/instructors-layout"

export default async function InstructorsPage() {
  const instructors = await GetInstructors();
  return (
    <InstructorsLayout initialInstructors={instructors}/>
  )
}
