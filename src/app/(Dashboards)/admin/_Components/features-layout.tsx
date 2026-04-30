"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, X, Sparkles, Loader2 } from "lucide-react"
import { CreateFeature } from "@/ServerAPIs/CreateFeature"
import { toast } from "react-toastify"

interface Feature {
  feature_id: number
  feature_name: string
}

interface FeatureFormData {
  feature_name: string
}


function ActionDropdown({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative ">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-xl animate-in fade-in zoom-in duration-100">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

function Modal({ open, onClose, title, description, children }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// --- Main Feature Component ---

export default function FeaturesLayout({ features }: { features: Feature[] }) {
  const [data, setData] = useState<Feature[]>(features)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Feature | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // React Hook Form initialization
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FeatureFormData>()

  const filteredData = data.filter(item =>
    item.feature_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.feature_id.toString().includes(searchQuery)
  )

  const handleOpenDialog = (item?: Feature) => {
    if (item) {
      setEditingItem(item)
      reset({ feature_name: item.feature_name })
    } else {
      setEditingItem(null)
      reset({ feature_name: "" })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = async (formData: FeatureFormData) => {
    setIsSubmitting(true)
    try {
      if (editingItem) {
        // Handle Edit logic locally (or call an Update action if you have one)
        setData(data.map(f => f.feature_id === editingItem.feature_id ? { ...editingItem, ...formData } : f))
        setIsDialogOpen(false)
      } else {
        // --- CALLING SERVER ACTION ---
        const result = await CreateFeature(formData.feature_name)

        if (result && 'error' in result) {
          toast.error(result.error);
        } else {
          // Add the newly created feature to the table
          const newFeature = result as unknown as Feature
          setData(prev => [...prev, newFeature])
          toast.success("Feature created successfully.");
          setIsDialogOpen(false)
          reset();
        }
      }
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("An error occurred while saving the feature.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Triggered by the ActionDropdown
const handleDeleteClick = (id: number) => {
  setItemToDelete(id);
  setIsDeleteModalOpen(true);
};

// Triggered by the "Confirm" button in the design modal
const confirmDelete = () => {
  if (itemToDelete) {
    setData(data.filter(f => f.feature_id !== itemToDelete));
    // toast.success("Feature deleted successfully.") // If using toast
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  }
};

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 shadow-xl shadow-blue-200">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Features</h1>
            <p className="text-slate-500 font-medium">Manage platform features and capabilities</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Feature
        </button>
      </div>

      {/* Main Table Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Filter by name or ID..."
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
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Feature Name</th>
                <th className="px-8 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <p className="text-slate-400 italic">No features found.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.feature_id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5 text-sm font-mono text-blue-600 font-semibold">
                      #{item.feature_id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">
                      {item.feature_name}
                    </td>
                    <td className="px-8 py-5 text-right ">
                      <ActionDropdown 
                          onEdit={() => handleOpenDialog(item)} 
                          onDelete={() => handleDeleteClick(item.feature_id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={editingItem ? "Edit Feature" : "New Feature"}
        description="Enter the unique name for this system capability."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Feature Name</label>
            <input
              {...register("feature_name", { required: "Feature name is required" })}
              autoFocus
              disabled={isSubmitting}
              type="text"
              placeholder="e.g. Wireless Casting"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                errors.feature_name ? "border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
              }`}
            />
            {errors.feature_name && (
              <p className="text-xs text-red-500 font-medium">{errors.feature_name.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsDialogOpen(false)}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-100 active:scale-95 transition-all disabled:bg-blue-400"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? "Update Changes" : "Save Feature"}
            </button>
          </div>
        </form>
      </Modal>
      {/* Delete Confirmation Modal */}
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Deletion"
          description="Are you sure you want to delete this feature? This action cannot be undone."
        >
          <div className="flex flex-col  items-center gap-6 ">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-red-100 active:scale-95 transition-all"
              >
                Delete Feature
              </button>
            </div>
          </div>
        </Modal>
            </div>
  )
}