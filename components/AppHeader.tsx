'use client'

import { Menu, Bell, User, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'

interface AppHeaderProps {
  onMenuClick: () => void
  onCommandClick: () => void
}

const ROUTE_TITLES: Record<string, { eyebrow: string; title: string }> = {
  '/dashboard':         { eyebrow: 'Visão geral',     title: 'Dashboard' },
  '/kanban':            { eyebrow: 'Pipeline',        title: 'Kanban' },
  '/leads/new':         { eyebrow: 'Novo registro',   title: 'Novo Lead' },
  '/campaigns':         { eyebrow: 'Outbound',        title: 'Campanhas' },
  '/campaigns/new':     { eyebrow: 'Outbound',        title: 'Nova Campanha' },
  '/settings/funnel':   { eyebrow: 'Configuração',    title: 'Funil' },
  '/settings/fields':   { eyebrow: 'Configuração',    title: 'Campos' },
  '/settings/members':  { eyebrow: 'Configuração',    title: 'Membros' },
  '/settings/ai':       { eyebrow: 'Configuração',    title: 'Integração IA' },
}

function resolveRouteMeta(pathname: string): { eyebrow: string; title: string } {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  if (pathname.startsWith('/leads/')) return { eyebrow: 'Detalhe', title: 'Lead' }
  return { eyebrow: 'SDR', title: 'Workspace' }
}

export function AppHeader({ onMenuClick, onCommandClick }: AppHeaderProps) {
  const { workspace } = useWorkspace()
  const pathname = usePathname()
  const route = resolveRouteMeta(pathname)

  return (
    <header className="bg-ink-950/80 border-b-ink-700 sticky top-0 z-20 flex h-14 items-center gap-4 border-b px-4 backdrop-blur-md md:px-6">
      <button
        className="text-paper-muted hover:text-paper flex min-h-[40px] min-w-[40px] items-center justify-center rounded-sm transition-colors md:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 items-baseline gap-3">
        <span className="text-paper-quiet hidden font-mono text-2xs uppercase tracking-[0.18em] md:inline">
          {route.eyebrow}
        </span>
        <span className="bg-ink-700 hidden h-3 w-px md:inline-block" aria-hidden />
        <h1 className="font-display text-paper truncate text-base font-semibold tracking-tight">
          {route.title}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Command palette trigger */}
        <button
          onClick={onCommandClick}
          className="bg-ink-900 hover:bg-ink-800 border-ink-700 hover:border-ink-600 text-paper-muted hidden items-center gap-2 rounded-sm border px-3 py-1.5 text-sm transition-colors md:flex"
          aria-label="Abrir paleta de comandos"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Buscar</span>
          <kbd className="bg-ink-800 border-ink-600 text-paper-quiet ml-2 rounded-xs border px-1.5 py-0.5 font-mono text-2xs">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={onCommandClick}
          className="text-paper-muted hover:text-paper flex h-9 w-9 items-center justify-center rounded-sm transition-colors md:hidden"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          className="text-paper-muted hover:text-paper flex h-9 w-9 items-center justify-center rounded-sm transition-colors"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          className="text-paper-muted hover:text-paper flex h-9 w-9 items-center justify-center rounded-sm transition-colors"
          aria-label={workspace?.name ?? 'Perfil'}
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
