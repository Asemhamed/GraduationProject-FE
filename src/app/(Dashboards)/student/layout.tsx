import type { ReactNode } from "react"
import { Header } from "./_Components/header"
import { MobileHeader } from "./_Components/mobile-header"
import { Sidebar } from "./_Components/sidebar"
import { BottomNav } from "./_Components/bottom-nav"


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Header />
      </div>
      
      <MobileHeader />
      
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <main className="min-h-screen p-4 pb-24 pt-4 md:ml-60 md:p-8 md:pt-24">{children}</main>
      
      <BottomNav />
    </div>
  )
}
