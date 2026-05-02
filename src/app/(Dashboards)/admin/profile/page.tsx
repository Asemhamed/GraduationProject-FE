import { GetProfile } from "@/ServerActions/Profile/GetProfile";
import { redirect } from "next/navigation";
import ProfileLayout from "../_Components/profile-layout";
import { toast } from "react-toastify";

export default async function ProfilePage() {
  const profile = await GetProfile();
  
  if (!profile) {
    toast.error("Failed to load profile. Please log in again.");
    redirect("/login");
  }

  return <ProfileLayout profile={profile} />;
}