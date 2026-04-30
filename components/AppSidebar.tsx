'use client'

import Link from 'next/link'
import { LayoutDashboard, KanbanSquare, Settings, Columns3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/features/auth/actions/signOut'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'

export function AppSidebar() {
  const workspace = useWorkspace()
  return <aside className="flex h-full w-64 flex-col border-r bg-white p-4"><div className="mb-6"><div className="text-lg font-semibold">{workspace?.name ?? 'SDRFlow'}</div></div><nav className="space-y-1"><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/dashboard"><LayoutDashboard size={16}/>Dashboard</Link><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/kanban"><KanbanSquare size={16}/>Kanban</Link><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/campanhas"><Columns3 size={16}/>Campanhas</Link><div className="pt-2 text-xs font-semibold uppercase text-zinc-500">Configurações</div><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/configuracoes/campos"><Settings size={16}/>Campos</Link><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/configuracoes/funil"><Settings size={16}/>Funil</Link></nav><div className="mt-auto border-t pt-4"><form action={signOut}><Button variant="outline" className="w-full justify-start gap-2"><LogOut size={16}/>Sair</Button></form></div></aside>
}
