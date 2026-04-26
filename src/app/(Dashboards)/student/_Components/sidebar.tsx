"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, CheckSquare, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-60 flex-col border-r bg-background">
      <div className="p-6">
        <p className="text-lg font-semibold text-foreground">Student Portal</p>
        <p className="text-sm text-muted-foreground">Academic Year 2023/24</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
            <Link
              href='/student'
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === '/student'
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href='/student/timetable'
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === '/student/timetable'
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Calendar className="h-5 w-5" />
              Timetable
            </Link>
            <Link
              href='/student/enrollment'
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === '/student/enrollment'
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <CheckSquare className="h-5 w-5" />
              Enrollment
            </Link>
            <Link
              href='/student/profile'
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === '/student/profile'
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
      </nav>

      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
