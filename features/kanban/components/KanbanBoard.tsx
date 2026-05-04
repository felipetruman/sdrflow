'use client'

import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, X, Loader2 } from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'
import { getKanbanData } from '@/features/kanban/queries/getKanbanData'
import { moveLeadStage } from '@/features/kanban/actions/moveLeadStage'
import { deleteLead } from '@/features/leads/actions/deleteLead'
import { useKanbanDnD } from '@/features/kanban/hooks/useKanbanDnD'
import { getWorkspaceMembers } from '@/features/workspaces/queries/getWorkspaceMembers'
import type { FunnelStage, LeadWithStage } from '@/types/app'
import { KanbanColumn } from './KanbanColumn'
import { Modal } from '@/components/Modal'
import { LeadForm } from '@/features/leads/components/LeadForm'

type SortKey = 'recentes' | 'nome' | 'empresa'

interface WorkspaceMember {
  user_id: string
  label: string
}

export function KanbanBoard() {
  const sensors = useKanbanDnD()
  const router = useRouter()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [leads, setLeads] = useState<LeadWithStage[]>([])
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('recentes')
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [editingLead, setEditingLead] = useState<LeadWithStage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = async () => {
    try {
      const data = await getKanbanData()
      setStages(data.stages)
      setLeads(data.leads)
    } catch {
      toast.error('Falha ao carregar o Kanban. Tente recarregar a página.')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  useEffect(() => {
    void getWorkspaceMembers().then(setMembers)
  }, [])

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const search = query.trim().toLowerCase()
        const matchesSearch =
          !search ||
          [lead.name, lead.email, lead.company]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(search))
        const matchesStage = !stageFilter || lead.stage_id === stageFilter
        const matchesOwner = !ownerFilter || lead.owner_id === ownerFilter
        return matchesSearch && matchesStage && matchesOwner
      }),
    [leads, query, stageFilter, ownerFilter],
  )

  const sortedLeads = useMemo(() => {
    const copy = [...filteredLeads]
    switch (sortBy) {
      case 'nome':
        return copy.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      case 'empresa':
        return copy.sort((a, b) =>
          String(a.company ?? '').localeCompare(String(b.company ?? ''), 'pt-BR'),
        )
      default:
        return copy.sort(
          (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
        )
    }
  }, [filteredLeads, sortBy])

  const leadsByStage = useMemo(
    () =>
      stages.map((stage) => ({
        stage,
        leads: sortedLeads.filter((lead) => lead.stage_id === stage.id),
      })),
    [stages, sortedLeads],
  )
  const totalFiltered = sortedLeads.length
  const isFiltered = Boolean(query || stageFilter || ownerFilter || sortBy !== 'recentes')

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return
    const leadId = String(active.id)
    const overId = String(over.id)
    const targetStage =
      stages.find((stage) => stage.id === overId) ??
      leads.find((lead) => lead.id === overId)?.stage
    if (!targetStage) return
    startTransition(async () => {
      const res = await moveLeadStage({ leadId, stageId: targetStage.id })
      if (!res.success) {
        toast.error(res.error ?? 'Erro ao mover lead.')
      } else {
        await load()
        router.refresh()
      }
    })
  }

  function clearFilters() {
    setQuery('')
    setStageFilter('')
    setOwnerFilter('')
    setSortBy('recentes')
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      {/* Toolbar */}
      <div className="bg-ink-900 border-ink-700 mb-4 flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between">
        <div className="grid flex-1 gap-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search
              className="text-paper-quiet pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar nome, email, empresa..."
              aria-label="Buscar leads"
              className="field py-2 pl-9 pr-3"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            aria-label="Filtrar por etapa"
            className="field px-3 py-2"
          >
            <option value="">Todas as etapas</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
          <select
            value={ownerFilter}
            onChange={(event) => setOwnerFilter(event.target.value)}
            aria-label="Filtrar por responsável"
            className="field px-3 py-2"
          >
            <option value="">Todos os responsáveis</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortKey)}
            aria-label="Ordenar leads"
            className="field px-3 py-2"
          >
            <option value="recentes">Mais recentes</option>
            <option value="nome">Nome A-Z</option>
            <option value="empresa">Empresa A-Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-paper-quiet num-tabular hidden whitespace-nowrap text-xs sm:inline">
            <span className="text-paper font-semibold">{totalFiltered}</span> leads
          </span>
          {isFiltered ? (
            <button type="button" onClick={clearFilters} className="btn-ghost text-xs">
              <X className="h-3 w-3" />
              Limpar
            </button>
          ) : null}
          <Link href="/leads/new" className="btn-signal text-xs">
            <Plus className="h-3.5 w-3.5" />
            Novo Lead
          </Link>
        </div>
      </div>

      {/* Board */}
      {totalFiltered === 0 ? (
        <div className="border-ink-700 text-paper-quiet rounded-md border border-dashed p-10 text-center">
          <p className="eyebrow-quiet mb-2">Sem resultados</p>
          <p className="text-sm">Nenhum lead encontrado com esses filtros.</p>
          {isFiltered ? (
            <button type="button" onClick={clearFilters} className="btn-ghost mt-4 inline-flex text-xs">
              <X className="h-3 w-3" />
              Limpar filtros
            </button>
          ) : null}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          <SortableContext items={stages.map((stage) => stage.id)} strategy={rectSortingStrategy}>
            {leadsByStage.map(({ stage, leads: stageLeads }) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={stageLeads}
                onEditLead={setEditingLead}
                onDeleteLead={async (lead) => {
                  setIsDeleting(true)
                  const res = await deleteLead({ id: lead.id })
                  setIsDeleting(false)
                  if (res.error) toast.error(res.error)
                  else await load()
                  router.refresh()
                }}
              />
            ))}
          </SortableContext>
        </div>
      )}

      {/* Async status */}
      <div
        role="status"
        aria-live="polite"
        className="text-paper-quiet mt-3 flex min-h-[1.25rem] items-center gap-2 text-xs"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Movendo lead...
          </>
        ) : null}
        {isDeleting ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Excluindo lead...
          </>
        ) : null}
      </div>

      {/* Edit modal */}
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
              phone: editingLead.phone ?? '',
              company: editingLead.company ?? '',
              job_title: editingLead.job_title ?? '',
              source: editingLead.source ?? '',
              notes: editingLead.notes ?? '',
              stage_id: editingLead.stage_id,
              owner_id: editingLead.owner_id ?? '',
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
