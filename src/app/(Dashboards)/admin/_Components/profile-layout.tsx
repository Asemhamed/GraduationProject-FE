"use client"

import {
  BadgeCheck,
  Briefcase, Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Save,
  ShieldCheck,
  User
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { UpdateProfile } from "@/ServerActions/Profile/UpdateProfile"
import { AdminResponse, UpdateProfileData } from "@/Types/AdminTypes"

export default function ProfileLayout({ profile }: { profile: AdminResponse }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [displayName, setDisplayName] = useState(profile.full_name)
  const [displayTitle, setDisplayTitle] = useState(profile.title)


  const { register, handleSubmit, getValues, formState: { errors } } = useForm<UpdateProfileData>({
    defaultValues: {
      full_name: profile.full_name,
      title: profile.title,
      department: profile.department,
      semester: "Spring 2026"
    }
  })

  const onSubmit = async (formData: UpdateProfileData) => {
    setIsSubmitting(true)
    setSaveSuccess(false)

    setDisplayName(formData.full_name)
    setDisplayTitle(formData.title)

    try {
      const newProfile = await UpdateProfile(formData);
      setDisplayName(newProfile.full_name)
      setDisplayTitle(newProfile.title)
      setSaveSuccess(true)
      toast.success("Profile updated successfully")
    } catch (error: any) {
      setDisplayName(profile.full_name)
      setDisplayTitle(profile.title)
      toast.error(error.message || "Failed to save changes")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-blue-100/40">
        <div className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500" />
        <div className="px-6 pb-6">
          <div className="relative -mt-10 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
                <User size={32} />
              </div>
            </div>
            <div className="pt-10">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 transition-all duration-300">
                  {displayName}
                </h1>
                <BadgeCheck className="text-blue-500 h-5 w-5" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{displayTitle} • {profile.department} UID.{profile.admin_id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800">Profile Settings</h2>
            <p className="text-xs text-slate-500">Update your public information and department</p>
          </div>
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Full Display Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register("full_name", { required: "Name is required" })}
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                placeholder="Full Name"
              />
            </div>
            {errors.full_name && (
              <p className="text-xs text-red-500 ml-1">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Professional Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Senior Admin"
                />
              </div>
              {errors.title && (
                <p className="text-xs text-red-500 ml-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Current Semester
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  {...register("semester")}
                  className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Assigned Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                {...register("department")}
                className="w-full appearance-none rounded-2xl border border-slate-200 pl-11 pr-10 py-3 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all bg-white cursor-pointer"
              >
                <option value="IT">IT (Information Technology)</option>
                <option value="IS">IS (Information Systems)</option>
                <option value="CS">CS (Computer Science)</option>
                <option value="AI">AI (Artificial Intelligence)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none
                ${saveSuccess
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-green-100 hover:shadow-green-200"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Database...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Changes Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}