'use client'

import { useState } from 'react'
import { moveLeadStage } from '@/features/kanban/actions/moveLeadStage'

export function MoveLeadDialog({ leadId, stageId, onMoved }: { leadId: string; stageId: string; onMoved?: () => void }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const confirmMove = async () => {
    setLoading(true)
    await moveLeadStage({ leadId, stageId })
    setLoading(false)
    setOpen(false)
    onMoved?.()
  }

  if (!open) return <button className="text-sm text-indigo-600" onClick={() => setOpen(true)}>Mover lead</button>

  return <div className="rounded-lg border p-3"><p className="mb-2 text-sm">Confirmar movimentação?</p><button disabled={loading} onClick={confirmMove} className="rounded bg-indigo-600 px-3 py-1 text-white">{loading ? 'Salvando...' : 'Confirmar'}</button></div>
}
