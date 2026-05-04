'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { getFunnelStages } from '@/features/funnel/queries/getFunnelStages'
import { createFunnelStage } from '@/features/funnel/actions/createFunnelStage'
import { updateFunnelStage } from '@/features/funnel/actions/updateFunnelStage'
import { deleteFunnelStage } from '@/features/funnel/actions/deleteFunnelStage'
import type { FunnelStage } from '@/types/app'

const COLORS = ['#64748b', '#3b82f6', '#8b5cf6', '#E8B547', '#10b981', '#ef4444', '#ec4899']

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Cor da etapa">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`Cor ${color}`}
          aria-checked={value === color}
          role="radio"
          className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            backgroundColor: color,
            borderColor: value === color ? 'var(--signal)' : 'transparent',
          }}
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

  useEffect(() => {
    void load()
  }, [])

  function startEdit(stage: FunnelStage) {
    setEditingId(stage.id)
    setEditName(stage.name)
    setEditColor(stage.color ?? COLORS[0])
    setErrorMsg('')
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return
    setIsPending(true)
    const result = await updateFunnelStage(editingId, {
      name: editName.trim(),
      color: editColor,
    })
    if (result.error) {
      setErrorMsg(result.error)
      setIsPending(false)
      return
    }
    setEditingId(null)
    await load()
    setIsPending(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir a etapa "${name}"? Ação irreversível.`)) return
    setErrorMsg('')
    setIsPending(true)
    const result = await deleteFunnelStage(id)
    if (result.error) setErrorMsg(result.error)
    else await load()
    setIsPending(false)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setIsPending(true)
    const result = await createFunnelStage({ name: newName.trim(), color: newColor })
    if (result.error) {
      setErrorMsg(result.error)
      setIsPending(false)
      return
    }
    setNewName('')
    setShowAdd(false)
    await load()
    setIsPending(false)
  }

  return (
    <div className="editorial-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-paper text-base font-semibold tracking-tight">
          Etapas do funil
        </h3>
        <button
          type="button"
          onClick={() => {
            setShowAdd(true)
            setErrorMsg('')
          }}
          className="btn-signal text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova etapa
        </button>
      </div>

      {errorMsg ? (
        <p
          role="alert"
          className="text-negative border-negative/30 mb-3 rounded-sm border px-3 py-2 text-sm"
          style={{ backgroundColor: 'var(--negative-bg)' }}
        >
          {errorMsg}
        </p>
      ) : null}

      <div className="space-y-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="bg-ink-900 border-ink-700 hover:border-ink-600 flex items-center gap-3 rounded-sm border px-3 py-2 transition-colors"
          >
            {editingId === stage.id ? (
              <>
                <ColorPicker value={editColor} onChange={setEditColor} />
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void saveEdit()
                  }}
                  className="field flex-1 py-1 text-sm"
                  autoFocus
                  aria-label="Nome da etapa"
                />
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={isPending}
                  className="text-positive hover:text-positive transition-colors disabled:opacity-40"
                  aria-label="Salvar"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-paper-quiet hover:text-paper transition-colors"
                  aria-label="Cancelar"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: stage.color ?? '#64748b' }}
                  aria-hidden
                />
                <span className="text-paper flex-1 text-sm font-medium">{stage.name}</span>
                <span className="text-paper-quiet num-tabular text-2xs">
                  #{stage.order_index + 1}
                </span>
                <button
                  type="button"
                  title="Editar etapa"
                  aria-label="Editar etapa"
                  onClick={() => startEdit(stage)}
                  className="text-paper-quiet hover:text-paper transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Remover etapa"
                  aria-label="Remover etapa"
                  onClick={() => handleDelete(stage.id, stage.name)}
                  disabled={isPending}
                  className="text-paper-quiet hover:text-negative transition-colors disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="bg-ink-800 border-ink-600 mt-3 flex items-center gap-3 rounded-sm border px-3 py-2">
          <ColorPicker value={newColor} onChange={setNewColor} />
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void handleCreate()
            }}
            placeholder="Nome da etapa"
            className="field flex-1 py-1 text-sm"
            autoFocus
            aria-label="Nome da nova etapa"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending || !newName.trim()}
            className="text-positive hover:text-positive transition-colors disabled:opacity-40"
            aria-label="Criar etapa"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAdd(false)
              setNewName('')
            }}
            className="text-paper-quiet hover:text-paper transition-colors"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
