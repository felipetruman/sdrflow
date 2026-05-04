import { KanbanBoard } from '@/features/kanban/components/KanbanBoard'

export default function KanbanPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-2 pb-4">
        <p className="eyebrow">Pipeline</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Funil de Leads
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Arraste leads entre etapas. Filtros aplicam em todas as colunas.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <KanbanBoard />
    </div>
  )
}
