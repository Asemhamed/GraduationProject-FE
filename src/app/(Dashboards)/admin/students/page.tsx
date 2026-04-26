"use client"

import { useState } from "react"
import { GraduationCap } from "lucide-react"
import { Badge, DataPageLayout } from "../_Components/data-page-layout"

interface Student {
  id: number
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  progress: number
  status: string
  enrolledAt: string
}

const initialStudents: Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@student.edu",
    enrolledCourses: 3,
    completedCourses: 1,
    progress: 65,
    status: "Active",
    enrolledAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@student.edu",
    enrolledCourses: 2,
    completedCourses: 2,
    progress: 100,
    status: "Active",
    enrolledAt: "2023-09-01",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    enrolledCourses: 4,
    completedCourses: 0,
    progress: 25,
    status: "Active",
    enrolledAt: "2024-02-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@student.edu",
    enrolledCourses: 1,
    completedCourses: 0,
    progress: 45,
    status: "Active",
    enrolledAt: "2024-01-20",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@student.edu",
    enrolledCourses: 5,
    completedCourses: 3,
    progress: 80,
    status: "Active",
    enrolledAt: "2023-06-15",
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah.brown@student.edu",
    enrolledCourses: 2,
    completedCourses: 1,
    progress: 55,
    status: "Inactive",
    enrolledAt: "2023-11-01",
  },
  {
    id: 7,
    name: "Chris Martinez",
    email: "chris.martinez@student.edu",
    enrolledCourses: 3,
    completedCourses: 2,
    progress: 90,
    status: "Active",
    enrolledAt: "2023-08-20",
  },
  {
    id: 8,
    name: "Amanda Lee",
    email: "amanda.lee@student.edu",
    enrolledCourses: 1,
    completedCourses: 0,
    progress: 15,
    status: "Active",
    enrolledAt: "2024-03-01",
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
    label: "Student",
    render: (item: Student) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/70 text-xs font-semibold text-white shadow-sm">
          {getInitials(item.name)}
        </div>
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      </div>
    ),
  },
  { key: "enrolledCourses", label: "Enrolled" },
  { key: "completedCourses", label: "Completed" },
  {
    key: "progress",
    label: "Progress",
    render: (item: Student) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>
        <span className="w-8 text-xs text-muted-foreground">{item.progress}%</span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item: Student) => (
      <Badge
        variant={item.status === "Active" ? "default" : "secondary"}
        className={item.status === "Active" ? "bg-accent text-white" : ""}
      >
        {item.status}
      </Badge>
    ),
  },
  { key: "enrolledAt", label: "Enrolled" },
]

const formFields = [
  { key: "name", label: "Full Name", type: "text" as const, placeholder: "Enter student name" },
  { key: "email", label: "Email", type: "email" as const, placeholder: "student@edu.com" },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
      { label: "Graduated", value: "Graduated" },
    ],
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents)

  const handleAdd = (item: Partial<Student>) => {
    const newStudent: Student = {
      id: Date.now(),
      name: item.name || "",
      email: item.email || "",
      enrolledCourses: 0,
      completedCourses: 0,
      progress: 0,
      status: item.status || "Active",
      enrolledAt: new Date().toISOString().split("T")[0],
    }
    setStudents([...students, newStudent])
  }

  const handleEdit = (item: Student) => {
    setStudents(students.map((s) => (s.id === item.id ? item : s)))
  }

  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id))
  }

  return (
    <DataPageLayout
      title="Students"
      description="Manage student enrollment and records"
      icon={<GraduationCap className="h-6 w-6 text-white" />}
      columns={columns}
      data={students}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
