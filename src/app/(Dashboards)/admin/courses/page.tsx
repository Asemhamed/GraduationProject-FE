"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import { Badge, DataPageLayout } from "../_Components/data-page-layout"

interface Course {
  id: number
  name: string
  instructor: string
  department: string
  duration: string
  students: number
  status: string
  level: string
}

const initialCourses: Course[] = [
  {
    id: 1,
    name: "JavaScript Fundamentals",
    instructor: "Mark Wilson",
    department: "Web Development",
    duration: "8 weeks",
    students: 45,
    status: "Active",
    level: "Beginner",
  },
  {
    id: 2,
    name: "Machine Learning Basics",
    instructor: "Dr. Sarah Smith",
    department: "Computer Science",
    duration: "12 weeks",
    students: 32,
    status: "Active",
    level: "Intermediate",
  },
  {
    id: 3,
    name: "Data Science with Python",
    instructor: "Dr. Emily Chen",
    department: "Data Science",
    duration: "10 weeks",
    students: 28,
    status: "Active",
    level: "Intermediate",
  },
  {
    id: 4,
    name: "UI/UX Design Principles",
    instructor: "Lisa Anderson",
    department: "Design",
    duration: "6 weeks",
    students: 38,
    status: "Completed",
    level: "Beginner",
  },
  {
    id: 5,
    name: "Advanced React Development",
    instructor: "Mark Wilson",
    department: "Web Development",
    duration: "8 weeks",
    students: 22,
    status: "Active",
    level: "Advanced",
  },
  {
    id: 6,
    name: "Calculus for Engineers",
    instructor: "Prof. Michael Brown",
    department: "Mathematics",
    duration: "16 weeks",
    students: 55,
    status: "Active",
    level: "Intermediate",
  },
  {
    id: 7,
    name: "Introduction to AI",
    instructor: "Dr. James Lee",
    department: "Computer Science",
    duration: "10 weeks",
    students: 0,
    status: "Upcoming",
    level: "Beginner",
  },
]

const columns = [
  { key: "name", label: "Course Name" },
  { key: "instructor", label: "Instructor" },
  { key: "department", label: "Department" },
  { key: "duration", label: "Duration" },
  { key: "students", label: "Students" },
  {
    key: "level",
    label: "Level",
    render: (item: Course) => (
      <Badge
        variant="outline"
        className={
          item.level === "Beginner"
            ? "border-accent text-accent"
            : item.level === "Intermediate"
            ? "border-primary text-primary"
            : "border-rose-500 text-rose-500"
        }
      >
        {item.level}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item: Course) => (
      <Badge
        variant={
          item.status === "Active"
            ? "default"
            : item.status === "Completed"
            ? "secondary"
            : "outline"
        }
        className={
          item.status === "Active"
            ? "bg-accent text-white"
            : item.status === "Upcoming"
            ? "bg-primary/10 text-primary border-primary/20"
            : ""
        }
      >
        {item.status}
      </Badge>
    ),
  },
]

const formFields = [
  { key: "name", label: "Course Name", type: "text" as const, placeholder: "Enter course name" },
  { key: "instructor", label: "Instructor", type: "text" as const, placeholder: "Instructor name" },
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
  { key: "duration", label: "Duration", type: "text" as const, placeholder: "e.g., 8 weeks" },
  {
    key: "level",
    label: "Level",
    type: "select" as const,
    options: [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Active", value: "Active" },
      { label: "Upcoming", value: "Upcoming" },
      { label: "Completed", value: "Completed" },
    ],
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)

  const handleAdd = (item: Partial<Course>) => {
    const newCourse: Course = {
      id: Date.now(),
      name: item.name || "",
      instructor: item.instructor || "",
      department: item.department || "",
      duration: item.duration || "",
      students: 0,
      status: item.status || "Upcoming",
      level: item.level || "Beginner",
    }
    setCourses([...courses, newCourse])
  }

  const handleEdit = (item: Course) => {
    setCourses(courses.map((c) => (c.id === item.id ? item : c)))
  }

  const handleDelete = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  return (
    <DataPageLayout
      title="Courses"
      description="Manage course catalog and curriculum"
      icon={<BookOpen className="h-6 w-6 text-white" />}
      columns={columns}
      data={courses}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
