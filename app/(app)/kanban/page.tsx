import { KanbanBoard } from '@/features/kanban/components/KanbanBoard'

export default function KanbanPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Funil de Leads</h1>
      <KanbanBoard />
    </div>
  )
}
