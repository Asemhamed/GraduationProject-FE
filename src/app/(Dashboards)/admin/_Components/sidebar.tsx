import { Settings, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your services</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin/settings">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800">
            <Settings size={20} />
            <span>Settings</span>
          </Button>
        </Link>
        <Link href="/admin/services">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800">
            <Zap size={20} />
            <span>Services</span>
          </Button>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-xs text-slate-400">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
