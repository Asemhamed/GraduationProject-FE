"use client"

import {
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/timetable", label: "TimeTable", icon: Calendar },
  { href: "/student/enrollment", label: "Enrollment", icon: CheckSquare },
  { href: "/student/profile", label: "Profile", icon: User },
]


export function Sidebar() {

  // return (
  //   <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-60 flex-col border-r bg-background">
  //     <div className="p-6">
  //       <p className="text-lg font-semibold text-foreground">Student Portal</p>
  //       <p className="text-sm text-muted-foreground">Academic Year 2023/24</p>
  //     </div>

  //     <nav className="flex-1 space-y-1 px-3">
  //           <Link
  //             href='/student'
  //             className={cn(
  //               "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
  //               pathname === '/student'
  //                 ? "bg-sidebar-accent text-primary"
  //                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
  //             )}
  //           >
  //             <LayoutDashboard className="h-5 w-5" />
  //             Dashboard
  //           </Link>
  //           <Link
  //             href='/student/timetable'
  //             className={cn(
  //               "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
  //               pathname === '/student/timetable'
  //                 ? "bg-sidebar-accent text-primary"
  //                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
  //             )}
  //           >
  //             <Calendar className="h-5 w-5" />
  //             Timetable
  //           </Link>
  //           <Link
  //             href='/student/enrollment'
  //             className={cn(
  //               "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
  //               pathname === '/student/enrollment'
  //                 ? "bg-sidebar-accent text-primary"
  //                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
  //             )}
  //           >
  //             <CheckSquare className="h-5 w-5" />
  //             Enrollment
  //           </Link>
  //           <Link
  //             href='/student/profile'
  //             className={cn(
  //               "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
  //               pathname === '/student/profile'
  //                 ? "bg-sidebar-accent text-primary"
  //                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
  //             )}
  //           >
  //             <User className="h-5 w-5" />
  //             Profile
  //           </Link>
  //     </nav>

  //     <div className="p-4">
  //       <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
  //         <LogOut className="h-5 w-5" />
  //         Logout
  //       </Button>
  //     </div>
  //   </aside>
  // )
  
   const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-card transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Student Portal</span>
                <span className="text-[10px] text-muted-foreground">Academic Year 2026/27</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${collapsed ? "sr-only" : ""}`}>
            Main Menu
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } ${collapsed ? "justify-center px-2" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${!isActive ? "group-hover:scale-110" : ""}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <div className={`flex items-center gap-3 rounded-xl bg-muted/50 p-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/70 font-semibold text-white shadow-sm">
              A
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">Student User</p>
                <p className="truncate text-xs text-muted-foreground">student@edustudent.com</p>
              </div>
            )}
            {!collapsed && (
              <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Collapse button - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-3 hidden w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className={`hidden flex-shrink-0 transition-all duration-300 md:block ${collapsed ? "w-[72px]" : "w-64"}`} />
    </>
  )

}
