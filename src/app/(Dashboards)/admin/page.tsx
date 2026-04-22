'use client'

import { useState } from 'react'


export default function Admin() {

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg text-slate-600">Welcome to the admin dashboard. Here you can manage your services and settings.</p>
        </div>
      </main>
    </div>
  )
}
