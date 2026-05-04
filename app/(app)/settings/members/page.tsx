import { WorkspaceMembersPanel } from '@/features/workspaces/components/WorkspaceMembersPanel'

export default function MembersSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <header className="space-y-2 pb-4">
        <p className="eyebrow">Configuração</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Membros do Workspace
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Convide novos membros e gerencie permissões dentro do seu workspace.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <WorkspaceMembersPanel />
    </div>
  )
}
