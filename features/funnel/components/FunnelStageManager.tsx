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
          style={{ backgroundColor: c, borderColor: value === c ? '#0f172a' : 'transparent' }}
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

  const handleDelete = async (id: string) => {
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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Etapas do Funil</h3>
        <button
          type="button"
          onClick={() => { setShowAdd(true); setErrorMsg('') }}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" /> Nova etapa
        </button>
      </div>

      {errorMsg && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</p>}

      <div className="space-y-2">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
            {editingId === stage.id ? (
              <>
                <ColorPicker value={editColor} onChange={setEditColor} />
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') void saveEdit() }}
                  className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                  autoFocus
                />
                <button type="button" onClick={saveEdit} disabled={isPending} className="text-green-600 hover:text-green-800 disabled:opacity-40">
                  <Check className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: stage.color ?? '#64748b' }} />
                <span className="flex-1 text-sm font-medium text-slate-700">{stage.name}</span>
                <span className="text-xs text-slate-400">#{stage.order_index + 1}</span>
                <button type="button" title="Editar etapa" aria-label="Editar etapa" onClick={() => startEdit(stage)} className="text-slate-400 hover:text-slate-700">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" title="Remover etapa" aria-label="Remover etapa" onClick={() => handleDelete(stage.id)} disabled={isPending} className="text-slate-400 hover:text-red-600 disabled:opacity-40">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
          <ColorPicker value={newColor} onChange={setNewColor} />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void handleCreate() }}
            placeholder="Nome da etapa"
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
            autoFocus
          />
          <button type="button" onClick={handleCreate} disabled={isPending || !newName.trim()} className="text-green-600 hover:text-green-800 disabled:opacity-40">
            <Check className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => { setShowAdd(false); setNewName('') }} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
