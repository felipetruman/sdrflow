'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check, Loader2 } from 'lucide-react'
import { switchWorkspace } from '@/features/workspaces/actions/switchWorkspace'
import { getUserWorkspaces } from '@/features/workspaces/queries/getUserWorkspaces'
import { useToast } from '@/lib/hooks/useToast'
import type { Workspace } from '@/types/app'

interface WorkspaceSwitcherProps {
  current: Workspace
}

export function WorkspaceSwitcher({ current }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    getUserWorkspaces().then((list) => {
      setWorkspaces(list)
      setLoaded(true)
    })
  }, [])

  async function toggleDropdown() {
    if (!open && !loaded) {
      setLoading(true)
      const list = await getUserWorkspaces()
      setWorkspaces(list)
      setLoaded(true)
      setLoading(false)
    }
    setOpen(!open)
  }

  async function handleSwitch(ws: Workspace) {
    if (ws.id === current.id) { setOpen(false); return }
    setSwitching(true)
    try {
      const result = await switchWorkspace(ws.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        router.refresh()
      }
    } catch {
      toast.error('Erro ao trocar de workspace')
    } finally {
      setOpen(false)
      setSwitching(false)
    }
  }

  if (loaded && workspaces.length <= 1) return null

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center gap-1 text-xs transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        {!loaded ? 'Carregando...' : 'Trocar workspace'}
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg py-1 shadow-lg"
            style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
          >
            {loading && (
              <div className="px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>Carregando...</div>
            )}
            {switching && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Loader2 className="h-3 w-3 animate-spin" /> Trocando...
              </div>
            )}
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSwitch(ws)}
                disabled={switching}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors disabled:opacity-40"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="flex-1 text-left truncate">{ws.name}</span>
                {ws.id === current.id && <Check className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
