'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { getFunnelStages } from '@/features/funnel/queries/getFunnelStages'
import { createFunnelStage } from '@/features/funnel/actions/createFunnelStage'
import { updateFunnelStage } from '@/features/funnel/actions/updateFunnelStage'
import { deleteFunnelStage } from '@/features/funnel/actions/deleteFunnelStage'
import type { FunnelStage } from '@/types/app'

const COLORS = ['#64748b', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899']

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-1">
      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
          style={{ backgroundColor: c, borderColor: value === c ? 'var(--amber)' : 'transparent' }}
        />
      ))}
    </div>
  )
}

export function FunnelStageManager() {
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(COLORS[0])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [isPending, setIsPending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const load = async () => {
    const data = await getFunnelStages()
    setStages(data)
  }

  useEffect(() => { void load() }, [])

  const startEdit = (stage: FunnelStage) => {
    setEditingId(stage.id)
    setEditName(stage.name)
    setEditColor(stage.color ?? COLORS[0])
    setErrorMsg('')
  }

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return
    setIsPending(true)
    const result = await updateFunnelStage(editingId, { name: editName.trim(), color: editColor })
    if (result.error) { setErrorMsg(result.error); setIsPending(false); return }
    setEditingId(null)
    await load()
    setIsPending(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir a etapa "${name}"? Ação irreversível.`)) return
    setErrorMsg('')
    setIsPending(true)
    const result = await deleteFunnelStage(id)
    if (result.error) setErrorMsg(result.error)
    else await load()
    setIsPending(false)
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setIsPending(true)
    const result = await createFunnelStage({ name: newName.trim(), color: newColor })
    if (result.error) { setErrorMsg(result.error); setIsPending(false); return }
    setNewName('')
    setShowAdd(false)
    await load()
    setIsPending(false)
  }

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Etapas do Funil</h3>
        <button
          type="button"
          onClick={() => { setShowAdd(true); setErrorMsg('') }}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
          style={{ backgroundColor: 'var(--amber)', color: 'var(--text-inverse)' }}
        >
          <Plus className="h-4 w-4" /> Nova etapa
        </button>
      </div>

      {errorMsg && (
        <p className="mb-3 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}>
          {errorMsg}
        </p>
      )}

      <div className="space-y-2">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ border: '1px solid var(--border-dim)' }}>
            {editingId === stage.id ? (
              <>
                <ColorPicker value={editColor} onChange={setEditColor} />
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') void saveEdit() }}
                  className="sdr-input flex-1 px-2 py-1 text-sm"
                  autoFocus
                />
                <button type="button" onClick={saveEdit} disabled={isPending} className="transition-colors disabled:opacity-40" style={{ color: 'var(--success)' }}>
                  <Check className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: stage.color ?? '#64748b' }} />
                <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stage.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>#{stage.order_index + 1}</span>
                <button type="button" title="Editar etapa" aria-label="Editar etapa" onClick={() => startEdit(stage)} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" title="Remover etapa" aria-label="Remover etapa" onClick={() => handleDelete(stage.id, stage.name)} disabled={isPending} className="transition-colors disabled:opacity-40" style={{ color: 'var(--text-muted)' }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-dim)' }}>
          <ColorPicker value={newColor} onChange={setNewColor} />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void handleCreate() }}
            placeholder="Nome da etapa"
            className="sdr-input flex-1 px-2 py-1 text-sm"
            autoFocus
          />
          <button type="button" onClick={handleCreate} disabled={isPending || !newName.trim()} className="transition-colors disabled:opacity-40" style={{ color: 'var(--success)' }}>
            <Check className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => { setShowAdd(false); setNewName('') }} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
