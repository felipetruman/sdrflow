'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  LayoutDashboard,
  KanbanSquare,
  Users,
  LogOut,
  Zap,
  UserPlus,
  Megaphone,
  GitBranch,
  Sliders,
} from 'lucide-react'
import { signOut } from '@/features/auth/actions/signOut'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/kanban',    label: 'Kanban',    icon: KanbanSquare },
  { href: '/leads/new', label: 'Novo Lead', icon: UserPlus },
  { href: '/campaigns', label: 'Campanhas', icon: Megaphone },
]

const settingsItems = [
  { href: '/settings/funnel',  label: 'Funil',   icon: GitBranch },
  { href: '/settings/fields',  label: 'Campos',  icon: Sliders },
  { href: '/settings/members', label: 'Membros', icon: Users },
]

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useWorkspace()
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {open ? (
        <button
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-dim)',
        }}
      >
        {/* Logo */}
        <div
          className="flex h-14 items-center gap-3 px-4"
          style={{ borderBottom: '1px solid var(--border-dim)' }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'var(--amber)',
              boxShadow: '0 0 12px var(--amber-glow)',
              color: 'var(--text-inverse)',
            }}
          >
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-bold text-white truncate">
              {workspace?.name ?? 'SDRFlow'}
            </div>
            {workspace && <WorkspaceSwitcher current={workspace} />}
          </div>
          <button
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded md:hidden"
            style={{ color: 'var(--text-muted)' }}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Navegação principal">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium transition-all ${
                  active ? 'text-white' : 'hover:text-white'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: 'var(--bg-elevated)',
                        borderLeft: '2px solid var(--amber)',
                        paddingLeft: '10px',
                        paddingRight: '12px',
                        color: '#fff',
                      }
                    : {
                        color: 'var(--text-secondary)',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                      }
                }
              >
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: active ? 'var(--amber)' : undefined }}
                />
                {item.label}
              </Link>
            )
          })}

          <div className="px-3 pt-5 pb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Configurações
            </span>
          </div>

          {settingsItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium transition-all ${
                  active ? 'text-white' : 'hover:text-white'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: 'var(--bg-elevated)',
                        borderLeft: '2px solid var(--amber)',
                        paddingLeft: '10px',
                        paddingRight: '12px',
                        color: '#fff',
                      }
                    : {
                        color: 'var(--text-secondary)',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                      }
                }
              >
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: active ? 'var(--amber)' : undefined }}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-2" style={{ borderTop: '1px solid var(--border-dim)' }}>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
