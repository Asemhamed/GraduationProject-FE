import {
  Sparkles,
  DoorOpen,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Total Features",
    value: "24",
    change: "+2 this month",
    icon: Sparkles,
    href: "/admin/features",
    gradient: "from-primary to-primary/70",
  },
  {
    title: "Active Rooms",
    value: "12",
    change: "3 available",
    icon: DoorOpen,
    href: "/admin/rooms",
    gradient: "from-accent to-accent/70",
  },
  {
    title: "Instructors",
    value: "18",
    change: "+3 new",
    icon: Users,
    href: "/admin/instructors",
    gradient: "from-amber-500 to-amber-400",
  },
  {
    title: "Courses",
    value: "45",
    change: "8 active",
    icon: BookOpen,
    href: "/admin/courses",
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    title: "Students",
    value: "1,234",
    change: "+156 this week",
    icon: GraduationCap,
    href: "/admin/students",
    gradient: "from-rose-500 to-rose-400",
  },
]

const recentActivities = [
  {
    action: "New student enrolled",
    description: "John Doe enrolled in Web Development",
    time: "2 minutes ago",
  },
  {
    action: "Course completed",
    description: "React Fundamentals course ended",
    time: "1 hour ago",
  },
  {
    action: "New instructor added",
    description: "Dr. Sarah Smith joined the team",
    time: "3 hours ago",
  },
  {
    action: "Room booked",
    description: "Room A101 reserved for Python workshop",
    time: "5 hours ago",
  },
  {
    action: "Feature enabled",
    description: "Live streaming feature activated",
    time: "1 day ago",
  },
]

const upcomingSchedule = [
  {
    course: "JavaScript Basics",
    instructor: "Mark Wilson",
    room: "A101",
    time: "09:00 AM",
  },
  {
    course: "Data Science Intro",
    instructor: "Dr. Emily Chen",
    room: "B203",
    time: "11:00 AM",
  },
  {
    course: "UI/UX Design",
    instructor: "Lisa Anderson",
    room: "C105",
    time: "02:00 PM",
  },
  {
    course: "Machine Learning",
    instructor: "Dr. James Lee",
    room: "A202",
    time: "04:00 PM",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your learning platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
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
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  {stat.change}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/0 transition-all duration-300 group-hover:text-primary group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-md">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Recent Activity</h2>
                <p className="text-sm text-muted-foreground">Latest actions on the platform</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/70 shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Today&apos;s Schedule</h2>
                <p className="text-sm text-muted-foreground">Upcoming classes for today</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {upcomingSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 font-bold text-primary">
                    {schedule.time.split(":")[0]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">{schedule.course}</p>
                    <p className="text-xs text-muted-foreground">
                      {schedule.instructor} &bull; Room {schedule.room}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {schedule.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
