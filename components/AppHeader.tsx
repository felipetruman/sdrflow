'use client'

import { Menu } from 'lucide-react'
import { useWorkspace } from '@/features/workspaces/components/WorkspaceGuard'

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) { const workspace = useWorkspace(); return <header className="flex h-16 items-center justify-between border-b bg-white px-4"><button className="md:hidden" onClick={onMenuClick}><Menu /></button><div className="font-medium">{workspace?.name ?? 'Workspace'}</div><div className="text-sm text-zinc-600">Menu do usuário</div></header> }
