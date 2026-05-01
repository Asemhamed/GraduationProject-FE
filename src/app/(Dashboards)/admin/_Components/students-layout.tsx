"use client"

import {
  ArrowRight,
  Calendar,
  GraduationCap, Loader2,
  Lock,
  Mail,
  Plus, Search,
  User
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

// Import Server Actions
import { CreateStudent } from "@/ServerActions/Student/CreateStudent"
import { DeleteStudent } from "@/ServerActions/Student/DeleteStudent"
import { GetStudents } from "@/ServerActions/Student/GetStudents"
import { UpdateStudent } from "@/ServerActions/Student/UpdateStudent"
import { Student, StudentFormData } from "@/Types/StudentTypes"
import { ActionDropdown } from "@/app/_Components/Shared/ActionDropdown"
import { Modal } from "@/app/_Components/Shared/Modal"

// --- Main Layout ---

export default function StudentsLayout({ initialStudents }: { initialStudents: Student[] }) {
  const [data, setData] = useState<Student[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Student | null>(null)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pagination State
  const [skip, setSkip] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialStudents.length === 100)
  const LIMIT = 100

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormData>()

  const filteredData = data.filter(item =>
    item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.student_id.toString().includes(searchQuery)
  ).sort((a, b) => a.student_id - b.student_id);

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingItem(student)
      reset({ full_name: student.full_name, semester: student.semester, email: "", password: "" })
    } else {
      setEditingItem(null)
      reset({ full_name: "", semester: "Fall", email: "", password: "" })
    }
    setIsDialogOpen(true)
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    try {
      const nextSkip = skip + LIMIT
      const newStudents = await GetStudents(nextSkip, LIMIT)
      
      if (newStudents.length < LIMIT) {
        setHasMore(false)
      }

      setData((prev) => [...prev, ...newStudents])
      setSkip(nextSkip)
    } catch (error) {
      toast.error("Failed to load more records")
    } finally {
      setIsLoadingMore(false)
    }
  }

  const onSubmit = async (formData: StudentFormData) => {
    setIsSubmitting(true)
    try {
      if (editingItem) {
        const updatedStudent = await UpdateStudent(editingItem.student_id, {
          full_name: formData.full_name,
          semester: formData.semester
        })
        setData(data.map(s => s.student_id === editingItem.student_id ? updatedStudent : s))
        toast.success("Student updated successfully")
      } else {
        const newStudent = await CreateStudent(formData)
        setData(prev => [newStudent, ...prev])
        toast.success("Student enrolled successfully")
      }
      setIsDialogOpen(false)
      reset()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return
    setIsSubmitting(true)
    try {
      await DeleteStudent(itemToDelete)
      setData(data.filter(s => s.student_id !== itemToDelete))
      toast.success("Student deleted")
      setIsDeleteModalOpen(false)
    } catch (error: any) {
      toast.error("Failed to delete")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 shadow-xl shadow-blue-100">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Students</h1>
            <p className="text-slate-500 font-medium">Manage student accounts and enrollment</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Enroll Student
        </button>
      </div>

      {/* Search & Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search students..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">ID</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Student Name</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Semester</th>
                <th className="px-8 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((student) => (
                <tr key={student.student_id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-blue-600 font-semibold">#{student.student_id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {student.full_name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                      <Calendar className="h-3 w-3" />
                      {student.semester}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ActionDropdown 
                      onEdit={() => handleOpenDialog(student)} 
                      onDelete={() => { setItemToDelete(student.student_id); setIsDeleteModalOpen(true); }} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{data.length}</span> records
          </p>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Load Next 100
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={editingItem ? "Edit Student" : "New Enrollment"}
        description={editingItem ? "Update basic info." : "Create account and student profile."}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("full_name", { required: "Required" })}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5"
                placeholder="John Doe"
              />
            </div>
            {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.full_name.message}
                  </p>
                )}
          </div>

          {!editingItem && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register("email", { required: !editingItem })}
                    type="email"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5"
                    placeholder="student@example.com"
                  />
                </div>
                    {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register("password", { required: !editingItem })}
                    type="password"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5"
                    placeholder="••••••••"
                  />
                </div>
                  {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Semester</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                {...register("semester", { required: "Required" })}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all appearance-none bg-white shadow-sm focus:ring-4 focus:ring-blue-500/5"
              >
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
                type="button" 
                disabled={isSubmitting}
                onClick={() => setIsDialogOpen(false)} 
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-blue-100"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? "Save Changes" : "Create Student"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" description="Are you sure you want to delete this student? This action cannot be undone.">
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 cursor-pointer">Cancel</button>
          <button 
            onClick={confirmDelete} 
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}