import React from 'react'
import Sidebar from './_Components/sidebar'

export default function adminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      {children}
    </div>
  )
}
