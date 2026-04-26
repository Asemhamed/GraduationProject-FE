import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, GraduationCap, Clock } from "lucide-react"

const stats = [
  { title: "Enrolled Courses", value: "6", icon: BookOpen, color: "text-blue-600" },
  { title: "Total Credits", value: "20", icon: GraduationCap, color: "text-green-600" },
  { title: "Upcoming Classes", value: "3", icon: Calendar, color: "text-purple-600" },
  { title: "Study Hours", value: "24h", icon: Clock, color: "text-orange-600" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">Welcome back, Student!</h1>
        <p className="mt-1 text-sm text-muted-foreground md:mt-2 md:text-base">
          Here&apos;s an overview of your academic progress.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 md:p-6 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground md:text-sm">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { course: "CS 401", task: "AI Project Submission", date: "Apr 28, 2024" },
              { course: "IT 350", task: "Cloud Security Report", date: "Apr 30, 2024" },
              { course: "IS 210", task: "Database Design Quiz", date: "May 2, 2024" },
            ].map((deadline, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-foreground">{deadline.task}</p>
                  <p className="text-sm text-muted-foreground">{deadline.course}</p>
                </div>
                <span className="text-sm text-muted-foreground">{deadline.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Final Exam Schedule Released", time: "2 hours ago" },
              { title: "Library Extended Hours", time: "1 day ago" },
              { title: "Summer Registration Opens", time: "3 days ago" },
            ].map((announcement, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <p className="font-medium text-foreground">{announcement.title}</p>
                <span className="text-sm text-muted-foreground">{announcement.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
