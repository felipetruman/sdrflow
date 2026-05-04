'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { switchWorkspace } from '@/features/workspaces/actions/switchWorkspace'
import { getUserWorkspaces } from '@/features/workspaces/queries/getUserWorkspaces'
import { useToast } from '@/lib/hooks/useToast'
import type { Workspace } from '@/types/app'

interface WorkspaceSwitcherProps {
  current: Workspace
}

export function WorkspaceSwitcher({ current }: WorkspaceSwitcherProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([current])
  const [loaded, setLoaded] = useState(false)
  const [switching, setSwitching] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    getUserWorkspaces()
      .then((list) => {
        setWorkspaces(list)
        setLoaded(true)
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [])

  async function handleSwitch(workspace: Workspace) {
    if (workspace.id === current.id) return
    setSwitching(true)
    try {
      const result = await switchWorkspace(workspace.id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      router.refresh()
    } catch {
      toast.error('Erro ao trocar de workspace')
    } finally {
      setSwitching(false)
    }
  }

  // Hide if only a single workspace
  if (loaded && workspaces.length <= 1) {
    return (
      <div className="text-paper-muted truncate text-sm font-medium">
        {current.name}
      </div>
    )
  }

  const initials = current.name.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-ink-800 hover:bg-ink-700 border-ink-700 text-paper flex w-full items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left text-sm transition-colors"
          aria-label="Trocar workspace"
        >
          <span className="bg-signal-bg text-signal border-signal-deep flex h-7 w-7 shrink-0 items-center justify-center rounded-xs border font-mono text-2xs font-semibold">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{current.name}</span>
            <span className="text-paper-quiet block font-mono text-2xs uppercase tracking-[0.14em]">
              Workspace
            </span>
          </span>
          {switching ? (
            <Loader2 className="text-paper-quiet h-3.5 w-3.5 animate-spin" />
          ) : (
            <ChevronsUpDown className="text-paper-quiet h-3.5 w-3.5" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="eyebrow-quiet">
          Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            disabled={switching}
            onSelect={() => handleSwitch(workspace)}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate">{workspace.name}</span>
            {workspace.id === current.id ? (
              <Check className="text-signal h-3.5 w-3.5" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
