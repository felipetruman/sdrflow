'use client'

import { Menu, Bell, User } from 'lucide-react'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { workspace } = useWorkspace()
  return (
    <header
      className="flex h-14 items-center justify-between px-4 md:px-6"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-dim)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 transition-colors md:hidden"
          style={{ color: 'var(--text-secondary)' }}
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1
          className="font-display text-sm font-semibold tracking-wide"
          style={{ color: 'var(--text-secondary)' }}
        >
          {workspace?.name ?? 'Workspace'}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--amber)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="rounded-lg p-2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--amber)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          aria-label="Perfil"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
