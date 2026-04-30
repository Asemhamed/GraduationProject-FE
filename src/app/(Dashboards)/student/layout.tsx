import type { ReactNode } from "react"
import { Header } from "./_Components/header"
import { Sidebar } from "./_Components/sidebar"


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
  
        <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
              </div>
            </div>
  )
}
