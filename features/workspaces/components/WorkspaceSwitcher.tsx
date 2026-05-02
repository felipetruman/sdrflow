'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'
import { switchWorkspace } from '@/features/workspaces/actions/switchWorkspace'
import { getUserWorkspaces } from '@/features/workspaces/queries/getUserWorkspaces'
import type { Workspace } from '@/types/app'

interface WorkspaceSwitcherProps {
  current: Workspace
}

export function WorkspaceSwitcher({ current }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggleDropdown() {
    if (!open && workspaces.length === 0) {
      setLoading(true)
      const list = await getUserWorkspaces()
      setWorkspaces(list)
      setLoading(false)
    }
    setOpen(!open)
  }

  async function handleSwitch(ws: Workspace) {
    setOpen(false)
    if (ws.id === current.id) return
    await switchWorkspace(ws.id)
    router.refresh()
  }

  if (workspaces.length <= 1 && !loading) return null

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        Trocar workspace
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-lg">
            {loading && (
              <div className="px-3 py-2 text-xs text-slate-400">Carregando...</div>
            )}
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSwitch(ws)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <span className="flex-1 text-left truncate">{ws.name}</span>
                {ws.id === current.id && <Check className="h-3.5 w-3.5 text-green-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
