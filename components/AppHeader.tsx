'use client'

import { Menu, Bell, User } from 'lucide-react'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { workspace } = useWorkspace()
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">
          {workspace?.name ?? 'Workspace'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <Bell className="h-5 w-5" />
        </button>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
