"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/student/timetable", label: "TIMETABLE", icon: Calendar },
  { href: "/student/enrollment", label: "ENROLLMENT", icon: GraduationCap },
  { href: "/student/profile", label: "PROFILE", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full p-2 transition-colors",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn(isActive && "font-semibold")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
