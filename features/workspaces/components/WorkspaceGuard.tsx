'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Workspace } from '@/types/app'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { CreateWorkspaceForm } from './CreateWorkspaceForm'

interface WorkspaceContextValue {
  workspace: Workspace | null
  refresh: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue>({ workspace: null, refresh: async () => {} })
export const useWorkspace = () => useContext(WorkspaceContext)

export function WorkspaceGuard({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const w = await getCurrentWorkspace()
      setWorkspace(w)
    } catch {
      setError(true)
      setWorkspace(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-3 text-sm" style={{ color: 'var(--error)' }}>Erro ao carregar workspace.</p>
          <button onClick={refresh} className="btn-amber rounded-lg px-4 py-2 text-sm font-medium">
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }
  if (!workspace) return <CreateWorkspaceForm />
  return <WorkspaceContext.Provider value={{ workspace, refresh }}>{children}</WorkspaceContext.Provider>
}
