'use client'

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getKanbanData } from '@/features/kanban/queries/getKanbanData'
import { moveLeadStage } from '@/features/kanban/actions/moveLeadStage'
import { useKanbanDnD } from '@/features/kanban/hooks/useKanbanDnD'
import type { FunnelStage, LeadWithStage } from '@/types/app'
import { KanbanColumn } from './KanbanColumn'

export function KanbanBoard() {
  const sensors = useKanbanDnD()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [leads, setLeads] = useState<LeadWithStage[]>([])

  const load = async () => {
    const data = await getKanbanData()
    setStages(data.stages)
    setLeads(data.leads)
  }

  useEffect(() => { void load() }, [])

  const leadsByStage = useMemo(() => stages.map((stage) => ({ stage, leads: leads.filter((lead) => lead.stage_id === stage.id) })), [stages, leads])

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return
    const leadId = String(active.id)
    const overId = String(over.id)
    const targetStage = stages.find((stage) => stage.id === overId) ?? leads.find((lead) => lead.id === overId)?.stage
    if (!targetStage) return
    startTransition(async () => {
      await moveLeadStage({ leadId, stageId: targetStage.id })
      await load()
      router.refresh()
    })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        <SortableContext items={stages.map((stage) => stage.id)} strategy={rectSortingStrategy}>
          {leadsByStage.map(({ stage, leads }) => <KanbanColumn key={stage.id} stage={stage} leads={leads} />)}
        </SortableContext>
      </div>
      {isPending ? <p className="mt-3 text-sm text-slate-500">Movendo lead...</p> : null}
    </DndContext>
  )
}
