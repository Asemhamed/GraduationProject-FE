"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, X } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataPageLayoutProps<T extends { id: number }> {
  title: string
  description: string
  icon: React.ReactNode
  columns: Column<T>[]
  data: T[]
  formFields: {
    key: string
    label: string
    type: "text" | "email" | "number" | "select" | "textarea"
    placeholder?: string
    options?: { label: string; value: string }[]
  }[]
  // onAdd: (item: Partial<T>) => void
  // onEdit: (item: T) => void
  // onDelete: (id: number) => void
}

// Custom Dropdown Component
function ActionDropdown({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-border bg-card p-1 shadow-lg">
          <button
            onClick={() => {
              onEdit()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// Custom Modal Component
function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description: string
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Badge Component
export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline" | "destructive"
  className?: string
}) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-muted-foreground",
    outline: "border border-border text-foreground",
    destructive: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
interface Feature {
  id: number
  feature_id?: number
  feature_name: string
  name?: string
}


export function DataPageLayout<T extends { id: number }>({
  title,
  description,
  icon,
  columns,
  data,
  formFields

}: DataPageLayoutProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

    const onAdd = (item: Partial<Feature>) => {
    // const newFeature: Feature = {
    //   id: features.length > 0 ? Math.max(...features.map(f => f.id || 0)) + 1 : 1,
    //   feature_id: features.length > 0 ? Math.max(...features.map(f => f.feature_id || 0)) + 1 : 1,
    //   feature_name: item.feature_name || "",
    // }
    // setFeatures([...features, newFeature])
  }

  const onEdit = (item: Feature) => {
    //setFeatures(features.map((f) => (f.id === item.id ? item : f)))
  }

  const onDelete = (id: number) => {
    // setFeatures(features.filter((f) => f.id !== id))
  }

  const handleOpenDialog = (item?: T) => {
    if (item) {
      setEditingItem(item)
      const newFormData: Record<string, string> = {}
      formFields.forEach((field) => {
        newFormData[field.key] = String((item as Record<string, unknown>)[field.key] || "")
      })
      setFormData(newFormData)
    } else {
      setEditingItem(null)
      setFormData({})
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (editingItem) {
      // onEdit({ ...editingItem, ...formData } as T)
    } else {
      onAdd(formData as Partial<T>)
    }
    setIsDialogOpen(false)
    setFormData({})
    setEditingItem(null)
  }

  const getValue = (item: T, key: string): unknown => {
    return (item as Record<string, unknown>)[key]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:shadow-primary/25"
        >
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">All {title}</h2>
            <p className="text-sm text-muted-foreground">{data.length} total entries</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="p-5">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="w-[70px] pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-8 text-center">
                        <p className="text-muted-foreground">No data found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="group transition-colors hover:bg-muted/50">
                        {columns.map((column) => (
                          <td key={String(column.key)} className="py-4 text-sm text-foreground">
                            {column.render
                              ? column.render(item)
                              : String(getValue(item, String(column.key)) || "")}
                          </td>
                        ))}
                        <td className="py-4 text-right">
                          <ActionDropdown
                            onEdit={() => handleOpenDialog(item)}
                            onDelete={() => onDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No data found</p>
              </div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="space-y-3 rounded-xl border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      {columns.slice(0, 2).map((column) => (
                        <div key={String(column.key)}>
                          {column.render ? (
                            column.render(item)
                          ) : (
                            <p
                              className={
                                column.key === columns[0].key
                                  ? "font-medium text-foreground"
                                  : "text-sm text-muted-foreground"
                              }
                            >
                              {String(getValue(item, String(column.key)) || "")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <ActionDropdown
                      onEdit={() => handleOpenDialog(item)}
                      onDelete={() => onDelete(item.id)}
                    />
                  </div>
                  {columns.length > 2 && (
                    <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                      {columns.slice(2).map((column) => (
                        <div key={String(column.key)} className="text-xs">
                          <span className="text-muted-foreground">{column.label}: </span>
                          {column.render ? (
                            column.render(item)
                          ) : (
                            <span className="text-foreground">
                              {String(getValue(item, String(column.key)) || "")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? "Edit" : "Add New"} ${title.slice(0, -1)}`}
        description={
          editingItem
            ? `Update the ${title.toLowerCase().slice(0, -1)} details below.`
            : `Fill in the details to add a new ${title.toLowerCase().slice(0, -1)}.`
        }
      >
        <div className="space-y-4">
          {formFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label htmlFor={field.key} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="min-h-[80px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:shadow-primary/25"
            >
              {editingItem ? "Save Changes" : "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
