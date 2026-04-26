"use client"

import { useState } from "react"
import { Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileHeaderProps {
  title?: string
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold text-primary">
          {title || "Capital University"}
        </h1>
      </div>
      
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative"
        >
          <Settings 
            className={`h-5 w-5 cursor-pointer text-muted-foreground transition-transform duration-300 ease-in-out ${isMenuOpen ? "rotate-90" : "rotate-0"}`} 
          />
        </Button>

        {/* Settings Dropdown */}
        <div 
          className={`absolute right-0 top-full mt-2 origin-top-right transition-all duration-200 ease-out ${
            isMenuOpen 
              ? "scale-100 opacity-100" 
              : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <div className="w-48 overflow-hidden rounded-lg border bg-background shadow-lg">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 rounded-none px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setIsMenuOpen(false)
                // Handle logout
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}
    </header>
  )
}
