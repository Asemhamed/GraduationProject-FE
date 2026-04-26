"use client"

import { useState } from "react"
import { DepartmentFilter } from "../_Components/department-filter"
import { CourseCard } from "../_Components/course-card"

const departments = ["All Departments", "CS", "IS", "IT", "AI"]

const initialCourses = [
  {
    id: 1,
    courseCode: "CS 401",
    credits: 3,
    title: "Advanced Artificial Intelligence",
    description: "Deep learning architectures, neural network optimization, and practical applications in computer vision and NLP.",
    department: "CS",
    isEnrolled: true,
  },
  {
    id: 2,
    courseCode: "IT 350",
    credits: 4,
    title: "Cloud Infrastructure & Security",
    description: "Design and implementation of secure enterprise cloud environments using AWS, Azure, and GCP platforms.",
    department: "IT",
    isEnrolled: false,
  },
  {
    id: 3,
    courseCode: "IS 210",
    credits: 3,
    title: "Database Management Systems",
    description: "Relational algebra, SQL, database design theory, and practical implementation of enterprise database solutions.",
    department: "IS",
    isEnrolled: false,
  },
  {
    id: 4,
    courseCode: "AI 301",
    credits: 4,
    title: "Machine Learning Fundamentals",
    description: "Supervised and unsupervised learning algorithms, model evaluation, and feature engineering techniques.",
    department: "AI",
    isEnrolled: false,
  },
  {
    id: 5,
    courseCode: "CS 320",
    credits: 3,
    title: "Software Engineering Principles",
    description: "Software development lifecycle, agile methodologies, and best practices for building scalable applications.",
    department: "CS",
    isEnrolled: true,
  },
  {
    id: 6,
    courseCode: "IT 420",
    credits: 3,
    title: "Network Security Fundamentals",
    description: "Comprehensive overview of network vulnerabilities, cryptographic protocols, firewalls, and intrusion detection.",
    department: "IT",
    isEnrolled: true,
  },
]

export default function EnrollmentPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [courses, setCourses] = useState(initialCourses)

  const filteredCourses =
    selectedDepartment === "All Departments"
      ? courses
      : courses.filter((course) => course.department === selectedDepartment)

  const enrolledCredits = courses
    .filter((course) => course.isEnrolled)
    .reduce((sum, course) => sum + course.credits, 0)

  const toggleEnroll = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, isEnrolled: !course.isEnrolled } : course
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Mobile Credit Tracker */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Term Credits</p>
            <p className="text-xs text-muted-foreground">Fall 2024 Semester</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{enrolledCredits}</span>
            <span className="text-muted-foreground"> / 18</span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" 
            style={{ width: `${(enrolledCredits / 18) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden items-start justify-between gap-8 md:flex">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Course Enrollment</h1>
          <p className="mt-2 text-muted-foreground">
            Select and register for your upcoming semester courses.
          </p>
        </div>
        <div className="min-w-[200px] rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">CREDIT TRACKER</span>
            <div>
              <span className="text-2xl font-bold text-primary">{enrolledCredits}</span>
              <span className="text-muted-foreground"> / 18</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" 
              style={{ width: `${(enrolledCredits / 18) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Department Filter */}
      <div className="hidden md:block">
        <DepartmentFilter
          departments={departments}
          selected={selectedDepartment}
          onSelect={setSelectedDepartment}
        />
      </div>

      {/* Course Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            courseCode={course.courseCode}
            credits={course.credits}
            title={course.title}
            description={course.description}
            isEnrolled={course.isEnrolled}
            onToggleEnroll={() => toggleEnroll(course.id)}
          />
        ))}
      </div>
    </div>
  )
}
