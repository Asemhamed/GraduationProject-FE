"use client"

import { CreateRoom } from "@/ServerAPIs/CreateRoom"
import { Feature, Room, RoomFormData } from "@/Types/RoomsType"
import { DoorOpen, Loader2, MoreHorizontal, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


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

// --- Main Room Component ---

export default function RoomsLayout({ rooms, availableFeatures }: { rooms: Room[], availableFeatures: Feature[] }) {
  const [data, setData] = useState<Room[]>(rooms)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Room | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomFormData>()

  const filteredData = data.filter(item => 
    item.room_id.toString().includes(searchQuery) ||
    item.features.some(f => f.feature_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingItem(room)
      reset({ 
        capacity: room.capacity, 
        feature_ids: room.features.map(f => f.feature_id) 
      })
    } else {
      setEditingItem(null)
      reset({ capacity: 0, feature_ids: [] })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = async (formData: RoomFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate mapping the selected IDs back to feature objects for the UI
      const selectedFeatures = availableFeatures.filter(f => 
        formData.feature_ids.map(Number).includes(f.feature_id)
      )

      if (editingItem) {
        setData(data.map(r => r.room_id === editingItem.room_id ? { ...r, capacity: formData.capacity, features: selectedFeatures } : r))
        toast.success("Room updated successfully")
      } else {
      const newRoomFromServer = await CreateRoom(formData);
      
      setData((prev) => [...prev, newRoomFromServer]);
      toast.success("Room created successfully");
      }
      setIsDialogOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter(r => r.room_id !== itemToDelete))
      toast.success("Room deleted successfully.")
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 shadow-xl shadow-indigo-100">
            <DoorOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Rooms</h1>
            <p className="text-slate-500 font-medium">Manage facility rooms and their equipment</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 cursor-pointer px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Room
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Filter by ID or features..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Room ID</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Capacity</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Features</th>
                <th className="px-8 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((room) => (
                <tr key={room.room_id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-indigo-600 font-semibold">#{room.room_id.toString().padStart(3, '0')}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Users className="h-4 w-4 text-slate-400" />
                      {room.capacity}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {room.features.map(f => (
                        <span key={f.feature_id} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {f.feature_name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right ">
                    <ActionDropdown 
                      onEdit={() => handleOpenDialog(room)} 
                      onDelete={() => handleDeleteClick(room.room_id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Form Modal */}
      <Modal
        open={isDialogOpen}
        onClose={() => !isSubmitting && setIsDialogOpen(false)}
        title={editingItem ? "Edit Room" : "New Room"}
        description="Configure the room capacity and available equipment."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Capacity</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("capacity", { required: "Capacity is required", min: 1 })}
                type="number"
                placeholder="e.g. 50"
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Available Features</label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
              {availableFeatures.map(feature => (
                <label key={feature.feature_id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    value={feature.feature_id}
                    {...register("feature_ids")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600">{feature.feature_name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsDialogOpen(false)} 
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? "Update Room" : "Save Room"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal[cite: 1] */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this room? This action cannot be undone."
      >
        <div className="flex flex-col gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={confirmDelete} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-red-100 active:scale-95 transition-all">
              Delete Room
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}