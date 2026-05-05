import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import InstructorProfile from "../_Components/instructorProfile";
import { GetProfile } from "@/ServerActions/Profile/GetProfile";

export default async function ProfilePage() {
  const profile = await GetProfile();
  
  if (!profile) {
    toast.error("Failed to load profile. Please log in again.");
    redirect("/login");
  }

  return <InstructorProfile profile={profile} />;
}