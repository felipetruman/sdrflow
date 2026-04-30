import { WorkspaceGuard } from '@/features/workspaces/components/WorkspaceGuard'
import { AppLayout as ShellLayout } from '@/components/AppLayout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceGuard><ShellLayout>{children}</ShellLayout></WorkspaceGuard>
}
