"use client"

import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/features": "Features",
  "/admin/rooms": "Rooms",
  "/admin/instructors": "Instructors",
  "/admin/courses": "Courses",
  "/admin/students": "Students",
}

export function AdminHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4 pl-14 md:pl-0">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-10 w-64 rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 font-semibold text-white shadow-sm md:flex">
          A
        </div>
      </div>
    </header>
  )
}
