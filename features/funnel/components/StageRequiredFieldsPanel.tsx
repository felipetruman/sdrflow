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

  useEffect(() => {
    void (async () => {
      const [stagesData, customData] = await Promise.all([
        getFunnelStages(),
        getCustomFields(),
      ])
      setStages(stagesData)
      setCustomFields(customData)
      setSelectedStage(stagesData[0] ?? null)
    })()
  }, [])

  useEffect(() => {
    if (!selectedStage) return
    void getStageRequiredFields(selectedStage.id).then(setRequiredFields)
  }, [selectedStage])

  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <aside className="editorial-card flex flex-col gap-1 p-2">
        <p className="eyebrow-quiet px-2 pb-2 pt-1">Etapas</p>
        {stages.map((stage) => {
          const isActive = selectedStage?.id === stage.id
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStage(stage)}
              className={`flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-ink-800 text-paper'
                  : 'text-paper-muted hover:bg-ink-800 hover:text-paper'
              }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: stage.color ?? '#64748b' }}
                aria-hidden
              />
              <span className="flex-1 truncate">{stage.name}</span>
              {isActive ? (
                <span
                  className="bg-signal h-1.5 w-1.5 rounded-full"
                  aria-hidden
                />
              ) : null}
            </button>
          )
        })}
      </aside>

      <section className="editorial-card p-5">
        {selectedStage ? (
          <RequiredFieldsConfig
            stageId={selectedStage.id}
            requiredFields={requiredFields}
            customFields={customFields}
          />
        ) : (
          <p className="text-paper-quiet text-sm">Selecione uma etapa.</p>
        )}
      </section>
    </div>
  )
}
