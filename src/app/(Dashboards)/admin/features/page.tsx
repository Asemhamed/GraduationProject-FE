"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Badge, DataPageLayout } from "../_Components/data-page-layout"

interface Feature {
  id: number
  name: string
  description: string
  status: string
  category: string
  createdAt: string
}

const initialFeatures: Feature[] = [
  {
    id: 1,
    name: "Live Streaming",
    description: "Real-time video streaming for online classes",
    status: "Active",
    category: "Video",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Discussion Forums",
    description: "Student and instructor discussion boards",
    status: "Active",
    category: "Communication",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Quiz Builder",
    description: "Create and manage course quizzes",
    status: "Active",
    category: "Assessment",
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    name: "Certificate Generator",
    description: "Auto-generate course completion certificates",
    status: "Beta",
    category: "Documents",
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    name: "AI Assistant",
    description: "AI-powered learning assistant for students",
    status: "Development",
    category: "AI",
    createdAt: "2024-02-10",
  },
  {
    id: 6,
    name: "Progress Tracking",
    description: "Track student progress across courses",
    status: "Active",
    category: "Analytics",
    createdAt: "2024-01-20",
  },
]

const columns = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  {
    key: "status",
    label: "Status",
    render: (item: Feature) => (
      <Badge
        variant={
          item.status === "Active"
            ? "default"
            : item.status === "Beta"
            ? "secondary"
            : "outline"
        }
        className={
          item.status === "Active"
            ? "bg-accent text-white"
            : item.status === "Beta"
            ? "bg-primary/10 text-primary"
            : ""
        }
      >
        {item.status}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Created" },
]

const formFields = [
  { key: "name", label: "Feature Name", type: "text" as const, placeholder: "Enter feature name" },
  { key: "description", label: "Description", type: "textarea" as const, placeholder: "Enter feature description" },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: [
      { label: "Video", value: "Video" },
      { label: "Communication", value: "Communication" },
      { label: "Assessment", value: "Assessment" },
      { label: "Documents", value: "Documents" },
      { label: "AI", value: "AI" },
      { label: "Analytics", value: "Analytics" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Active", value: "Active" },
      { label: "Beta", value: "Beta" },
      { label: "Development", value: "Development" },
    ],
  },
]

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures)

  const handleAdd = (item: Partial<Feature>) => {
    const newFeature: Feature = {
      id: Date.now(),
      name: item.name || "",
      description: item.description || "",
      status: item.status || "Development",
      category: item.category || "",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setFeatures([...features, newFeature])
  }

  const handleEdit = (item: Feature) => {
    setFeatures(features.map((f) => (f.id === item.id ? item : f)))
  }

  const handleDelete = (id: number) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  return (
    <DataPageLayout
      title="Features"
      description="Manage platform features and capabilities"
      icon={<Sparkles className="h-6 w-6 text-white" />}
      columns={columns}
      data={features}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
