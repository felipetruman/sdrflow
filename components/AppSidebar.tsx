'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  LayoutDashboard,
  KanbanSquare,
  Columns3,
  Users,
  Settings,
  LogOut,
  Zap,
  UserPlus,
} from 'lucide-react'
import { signOut } from '@/features/auth/actions/signOut'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/kanban', label: 'Kanban', icon: KanbanSquare },
  { href: '/leads/new', label: 'Novo Lead', icon: Users },
  { href: '/campaigns', label: 'Campanhas', icon: Columns3 },
]

const settingsItems = [
  { href: '/settings/funnel', label: 'Funil', icon: Settings },
  { href: '/settings/fields', label: 'Campos', icon: Settings },
  { href: '/settings/members', label: 'Membros', icon: UserPlus },
]

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useWorkspace()
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {open ? (
        <button
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo / Workspace */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <Zap className="h-5 w-5 text-slate-900" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{workspace?.name ?? 'SDRFlow'}</div>
            <div className="text-xs text-slate-500">CRM para SDRs</div>
            {workspace && <WorkspaceSwitcher current={workspace} />}
          </div>
          <button className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          <div className="pt-4 pb-2">
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Configurações
            </div>
          </div>

          {settingsItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
