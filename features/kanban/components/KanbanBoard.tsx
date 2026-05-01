'use client'

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, X } from 'lucide-react'
import { getKanbanData } from '@/features/kanban/queries/getKanbanData'
import { moveLeadStage } from '@/features/kanban/actions/moveLeadStage'
import { deleteLead } from '@/features/leads/actions/deleteLead'
import { useKanbanDnD } from '@/features/kanban/hooks/useKanbanDnD'
import type { FunnelStage, LeadWithStage } from '@/types/app'
import { KanbanColumn } from './KanbanColumn'
import { EmptyState } from '@/components/EmptyState'
import { Columns3 } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { LeadForm } from '@/features/leads/components/LeadForm'

export function KanbanBoard() {
  const sensors = useKanbanDnD()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [leads, setLeads] = useState<LeadWithStage[]>([])
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [sortBy, setSortBy] = useState('recentes')
  const [editingLead, setEditingLead] = useState<LeadWithStage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = async () => {
    const data = await getKanbanData()
    setStages(data.stages)
    setLeads(data.leads)
  }

  useEffect(() => { void load() }, [])

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const search = query.trim().toLowerCase()
    const matchesSearch = !search || [lead.name, lead.email, lead.company].filter(Boolean).some((value) => String(value).toLowerCase().includes(search))
    const matchesStage = !stageFilter || lead.stage_id === stageFilter
    return matchesSearch && matchesStage
  }), [leads, query, stageFilter])

  const sortedLeads = useMemo(() => {
    const leadsCopy = [...filteredLeads]
    switch (sortBy) {
      case 'nome':
        return leadsCopy.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      case 'empresa':
        return leadsCopy.sort((a, b) => String(a.company ?? '').localeCompare(String(b.company ?? ''), 'pt-BR'))
      default:
        return leadsCopy.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    }
  }, [filteredLeads, sortBy])

  const leadsByStage = useMemo(() => stages.map((stage) => ({ stage, leads: sortedLeads.filter((lead) => lead.stage_id === stage.id) })), [stages, sortedLeads])
  const totalFiltered = sortedLeads.length

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
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, email ou empresa" className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3" />
          </div>
          <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="">Todas as etapas</option>
            {stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="recentes">Mais recentes</option>
            <option value="nome">Nome A-Z</option>
            <option value="empresa">Empresa A-Z</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-500">{totalFiltered} leads encontrados</p>
          <button type="button" onClick={() => { setQuery(''); setStageFilter(''); setSortBy('recentes') }} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"><X className="h-4 w-4" />Limpar</button>
          <Link href="/leads/new" className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" />Novo Lead</Link>
        </div>
      </div>
      {totalFiltered === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">Nenhum lead encontrado com esses filtros.</div> : <div className="flex gap-4 overflow-x-auto pb-4"><SortableContext items={stages.map((stage) => stage.id)} strategy={rectSortingStrategy}>{leadsByStage.map(({ stage, leads }) => <KanbanColumn key={stage.id} stage={stage} leads={leads} onEditLead={setEditingLead} onDeleteLead={async (lead) => { setIsDeleting(true); const res = await deleteLead({ id: lead.id }); setIsDeleting(false); if (res.error) alert(res.error); else await load(); router.refresh(); }} />)}</SortableContext></div>}
      {isPending ? <p className="mt-3 text-sm text-slate-500">Movendo lead...</p> : null}
      {isDeleting ? <p className="mt-3 text-sm text-slate-500">Excluindo lead...</p> : null}

      <Modal
        open={Boolean(editingLead)}
        title={editingLead ? `Editar lead: ${editingLead.name}` : 'Editar lead'}
        onClose={() => setEditingLead(null)}
      >
        {editingLead ? (
          <LeadForm
            mode="edit"
            leadId={editingLead.id}
            stages={stages}
            defaultValues={{
              name: editingLead.name,
              email: editingLead.email ?? '',
              company: editingLead.company ?? '',
              job_title: editingLead.job_title ?? '',
              source: editingLead.source ?? '',
              notes: editingLead.notes ?? '',
              stage_id: editingLead.stage_id,
            }}
            onSuccess={async () => {
              setEditingLead(null)
              await load()
              router.refresh()
            }}
          />
        ) : null}
      </Modal>
    </DndContext>
  )
}
