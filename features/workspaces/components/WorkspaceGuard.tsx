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

  const refresh = useCallback(async () => {
    setLoading(true)
    const w = await getCurrentWorkspace()
    setWorkspace(w)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  if (loading) return <div className="p-6">Carregando...</div>
  if (!workspace) return <CreateWorkspaceForm />
  return <WorkspaceContext.Provider value={{ workspace, refresh }}>{children}</WorkspaceContext.Provider>
}
