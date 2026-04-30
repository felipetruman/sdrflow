'use client'

import { useEffect, useState } from 'react'
import { getFunnelStages } from '@/features/funnel/queries/getFunnelStages'
import { getStageRequiredFields } from '@/features/funnel/queries/getStageRequiredFields'
import { getCustomFields } from '@/features/custom-fields/queries/getCustomFields'
import type { CustomField, FunnelStage, StageRequiredField } from '@/types/app'
import { RequiredFieldsConfig } from './RequiredFieldsConfig'

export function StageRequiredFieldsPanel() {
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null)
  const [requiredFields, setRequiredFields] = useState<StageRequiredField[]>([])

  useEffect(() => { void (async () => { const [stagesData, customData] = await Promise.all([getFunnelStages(), getCustomFields()]); setStages(stagesData); setCustomFields(customData); setSelectedStage(stagesData[0] ?? null) })() }, [])
  useEffect(() => { if (!selectedStage) return; void getStageRequiredFields(selectedStage.id).then(setRequiredFields) }, [selectedStage])

  return <div className="grid gap-4 md:grid-cols-[240px_1fr]"><aside className="space-y-2 rounded-xl border p-4">{stages.map((stage) => <button key={stage.id} onClick={() => setSelectedStage(stage)} className={`block w-full rounded px-3 py-2 text-left ${selectedStage?.id === stage.id ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>{stage.name}</button>)}</aside><section>{selectedStage ? <RequiredFieldsConfig stageId={selectedStage.id} requiredFields={requiredFields} customFields={customFields} /> : <p>Selecione uma etapa.</p>}</section></div>
}
