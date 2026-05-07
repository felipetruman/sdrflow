'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  LayoutDashboard,
  KanbanSquare,
  Users,
  LogOut,
  UserPlus,
  Megaphone,
  GitBranch,
  Sliders,
  Cpu,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { signOut } from '@/features/auth/actions/signOut'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  index: string
  title: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    index: '01',
    title: 'Operations',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/kanban',    label: 'Kanban',    icon: KanbanSquare },
      { href: '/leads/new', label: 'Novo Lead', icon: UserPlus },
      { href: '/campaigns', label: 'Campanhas', icon: Megaphone },
    ],
  },
  {
    index: '02',
    title: 'Configure',
    items: [
      { href: '/settings/funnel',  label: 'Funil',   icon: GitBranch },
      { href: '/settings/fields',  label: 'Campos',  icon: Sliders },
      { href: '/settings/members', label: 'Membros', icon: Users },
      { href: '/settings/ai',      label: 'IA',      icon: Cpu },
    ],
  },
]

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { workspace } = useWorkspace()
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {open ? (
        <button
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      ) : null}

      <aside
        className={`bg-ink-900 border-r-ink-700 fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="border-b-ink-700 flex h-14 items-center gap-3 border-b px-4">
          <Link
            href="/dashboard"
            className="font-display text-paper hover:text-signal flex items-baseline text-base font-bold tracking-tight transition-colors"
            aria-label="SDRFlow — voltar ao dashboard"
          >
            sdr<span className="text-signal">·</span>flow
          </Link>
          <button
            className="text-paper-muted hover:text-paper ml-auto flex min-h-[40px] min-w-[40px] items-center justify-center rounded-sm transition-colors md:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Workspace switcher */}
        {workspace ? (
          <div className="border-b-ink-700 border-b px-3 py-3">
            <WorkspaceSwitcher current={workspace} />
          </div>
        ) : null}

        {/* Navigation — sectioned with editorial numbering */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4" aria-label="Navegação principal">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 px-3 pb-2">
                <span className="font-mono text-2xs text-paper-fade tracking-[0.18em]">
                  {section.index}
                </span>
                <span className="eyebrow-quiet">{section.title}</span>
              </div>
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className="nav-row"
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? 'text-signal' : ''
                        }`}
                      />
                      <span className="truncate">{label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t-ink-700 border-t p-2">
          <form action={signOut}>
            <button
              type="submit"
              className="text-paper-quiet hover:text-paper hover:bg-ink-800 flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors"
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
