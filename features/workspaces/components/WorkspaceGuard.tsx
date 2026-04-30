'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Workspace } from '@/types/app'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { CreateWorkspaceForm } from './CreateWorkspaceForm'

const WorkspaceContext = createContext<Workspace | null>(null)
export const useWorkspace = () => useContext(WorkspaceContext)

export function WorkspaceGuard({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { getCurrentWorkspace().then((w) => { setWorkspace(w); setLoading(false) }) }, [])
  if (loading) return <div className="p-6">Carregando...</div>
  if (!workspace) return <CreateWorkspaceForm />
  return <WorkspaceContext.Provider value={workspace}>{children}</WorkspaceContext.Provider>
}
