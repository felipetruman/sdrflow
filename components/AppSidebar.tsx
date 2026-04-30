'use client'

import Link from 'next/link'
import { X, LayoutDashboard, KanbanSquare, Settings, Columns3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/features/auth/actions/signOut'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const workspace = useWorkspace()
  return <>
    {open ? <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} aria-label="Fechar menu" /> : null}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-white p-4 transition-transform md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="mb-6 flex items-center justify-between"><div className="text-lg font-semibold">{workspace?.name ?? 'SDRFlow'}</div><button className="md:hidden" onClick={onClose}><X className="h-5 w-5" /></button></div>
      <nav className="space-y-1"><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/dashboard"><LayoutDashboard size={16}/>Dashboard</Link><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/kanban"><KanbanSquare size={16}/>Kanban</Link><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/campanhas"><Columns3 size={16}/>Campanhas</Link><div className="pt-2 text-xs font-semibold uppercase text-zinc-500">Configurações</div><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/configuracoes/campos"><Settings size={16}/>Campos</Link><Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100" href="/configuracoes/funil"><Settings size={16}/>Funil</Link></nav><div className="mt-auto border-t pt-4"><form action={signOut}><Button variant="outline" className="w-full justify-start gap-2"><LogOut size={16}/>Sair</Button></form></div></aside></>
}
