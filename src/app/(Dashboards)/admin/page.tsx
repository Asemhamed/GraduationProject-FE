"use client"

import { useEffect, useState, useCallback } from "react"
import { GetCourses } from "@/ServerActions/Course/GetCourses"
import { GetFeatures } from "@/ServerActions/Feature/GetFeatures"
import { GetInstructors } from "@/ServerActions/Instructor/GetInstructor"
import { GetStudents } from "@/ServerActions/Student/GetStudents"
import { GetRooms } from "@/ServerActions/Room/GetRooms" // ← add this if you have it
import {
  Sparkles,
  DoorOpen,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  features: number
  rooms: number
  instructors: number
  courses: number
  students: number
}

const POLL_INTERVAL = 30_000 

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [prevStats, setPrevStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const [coursesData, instructorsData, featuresData, studentsData, roomsData] =
        await Promise.all([
          GetCourses(0, 1000),
          GetInstructors(0, 1000),
          GetFeatures(0, 1000),
          GetStudents(0, 1000),
          GetRooms(0, 1000), // ← add this if you have it
        ])

      const newStats: DashboardStats = {
        features: featuresData.length,
        rooms: roomsData.length, // replace with GetRooms(...).length if available
        instructors: instructorsData.length,
        courses: coursesData.length,
        students: studentsData.length,
      }

      setStats((prev) => {
        setPrevStats(prev)
        return newStats
      })
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchStats])

  const statCards = stats
    ? [
        {
          title: "Total Features",
          value: stats.features,
          prev: prevStats?.features,
          icon: Sparkles,
          href: "/admin/features",
          gradient: "from-primary to-primary/70",
        },
        {
          title: "Active Rooms",
          value: stats.rooms,
          prev: prevStats?.rooms,
          icon: DoorOpen,
          href: "/admin/rooms",
          gradient: "from-accent to-accent/70",
        },
        {
          title: "Instructors",
          value: stats.instructors,
          prev: prevStats?.instructors,
          icon: Users,
          href: "/admin/instructors",
          gradient: "from-amber-500 to-amber-400",
        },
        {
          title: "Courses",
          value: stats.courses,
          prev: prevStats?.courses,
          icon: BookOpen,
          href: "/admin/courses",
          gradient: "from-emerald-500 to-emerald-400",
        },
        {
          title: "Students",
          value: stats.students,
          prev: prevStats?.students,
          icon: GraduationCap,
          href: "/admin/students",
          gradient: "from-rose-500 to-rose-400",
        },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome back, Admin
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your learning platform today.
          </p>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading && !stats
          ? // Skeleton placeholders
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-8 w-16 rounded bg-muted" />
                    <div className="h-3 w-20 rounded bg-muted" />
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                </div>
              </div>
            ))
          : statCards.map((stat) => {
              const changed =
                stat.prev !== undefined && stat.prev !== stat.value
              const increased =
                stat.prev !== undefined && stat.value > stat.prev

              return (
                <Link
                  key={stat.title}
                  href={stat.href}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>

                      {/* Animated number with change flash */}
                      <p
                        key={stat.value} // re-triggers animation on value change
                        className={`text-3xl font-bold transition-colors duration-500 ${
                          changed
                            ? increased
                              ? "animate-pulse text-emerald-500"
                              : "animate-pulse text-rose-500"
                            : "text-foreground"
                        }`}
                      >
                        {stat.value}
                      </p>

                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>



                  <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/0 transition-all duration-300 group-hover:text-primary group-hover:opacity-100" />
                </Link>
              )
            })}
      </div>
    </div>
  )
}