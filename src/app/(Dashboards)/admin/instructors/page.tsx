"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { Badge, DataPageLayout } from "../_Components/data-page-layout"

interface Instructor {
  id: number
  name: string
  email: string
  department: string
  specialization: string
  courses: number
  status: string
  joinedAt: string
}

const initialInstructors: Instructor[] = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    email: "sarah.smith@edu.com",
    department: "Computer Science",
    specialization: "Machine Learning",
    courses: 4,
    status: "Active",
    joinedAt: "2022-06-15",
  },
  {
    id: 2,
    name: "Mark Wilson",
    email: "mark.wilson@edu.com",
    department: "Web Development",
    specialization: "JavaScript",
    courses: 6,
    status: "Active",
    joinedAt: "2021-09-01",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    email: "emily.chen@edu.com",
    department: "Data Science",
    specialization: "Statistics",
    courses: 3,
    status: "Active",
    joinedAt: "2023-01-10",
  },
  {
    id: 4,
    name: "Lisa Anderson",
    email: "lisa.anderson@edu.com",
    department: "Design",
    specialization: "UI/UX Design",
    courses: 5,
    status: "On Leave",
    joinedAt: "2020-03-20",
  },
  {
    id: 5,
    name: "Dr. James Lee",
    email: "james.lee@edu.com",
    department: "Computer Science",
    specialization: "AI & Robotics",
    courses: 2,
    status: "Active",
    joinedAt: "2023-08-01",
  },
  {
    id: 6,
    name: "Prof. Michael Brown",
    email: "michael.brown@edu.com",
    department: "Mathematics",
    specialization: "Calculus",
    courses: 4,
    status: "Active",
    joinedAt: "2019-11-15",
  },
]

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const columns = [
  {
    key: "name",
    label: "Instructor",
    render: (item: Instructor) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-white shadow-sm">
          {getInitials(item.name)}
        </div>
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      </div>
    ),
  },
  { key: "department", label: "Department" },
  { key: "specialization", label: "Specialization" },
  { key: "courses", label: "Courses" },
  {
    key: "status",
    label: "Status",
    render: (item: Instructor) => (
      <Badge
        variant={item.status === "Active" ? "default" : "secondary"}
        className={
          item.status === "Active"
            ? "bg-accent text-white"
            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
        }
      >
        {item.status}
      </Badge>
    ),
  },
  { key: "joinedAt", label: "Joined" },
]

const formFields = [
  { key: "name", label: "Full Name", type: "text" as const, placeholder: "Enter instructor name" },
  { key: "email", label: "Email", type: "email" as const, placeholder: "instructor@edu.com" },
  {
    key: "department",
    label: "Department",
    type: "select" as const,
    options: [
      { label: "Computer Science", value: "Computer Science" },
      { label: "Web Development", value: "Web Development" },
      { label: "Data Science", value: "Data Science" },
      { label: "Design", value: "Design" },
      { label: "Mathematics", value: "Mathematics" },
    ],
  },
  { key: "specialization", label: "Specialization", type: "text" as const, placeholder: "e.g., Machine Learning" },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Active", value: "Active" },
      { label: "On Leave", value: "On Leave" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
]

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors)

  const handleAdd = (item: Partial<Instructor>) => {
    const newInstructor: Instructor = {
      id: Date.now(),
      name: item.name || "",
      email: item.email || "",
      department: item.department || "",
      specialization: item.specialization || "",
      courses: 0,
      status: item.status || "Active",
      joinedAt: new Date().toISOString().split("T")[0],
    }
    setInstructors([...instructors, newInstructor])
  }

  const handleEdit = (item: Instructor) => {
    setInstructors(instructors.map((i) => (i.id === item.id ? item : i)))
  }

  const handleDelete = (id: number) => {
    setInstructors(instructors.filter((i) => i.id !== id))
  }

  return (
    <DataPageLayout
      title="Instructors"
      description="Manage teaching staff and faculty"
      icon={<Users className="h-6 w-6 text-white" />}
      columns={columns}
      data={instructors}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
