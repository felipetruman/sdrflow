import { WorkspaceMembersPanel } from '@/features/workspaces/components/WorkspaceMembersPanel'

export default function MembersSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Membros do Workspace</h1>
      <WorkspaceMembersPanel />
    </div>
  )
}
