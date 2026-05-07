'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { isDemoMode } from '@/lib/demo/data'

export type AiKeySummary = {
  id: string
  provider: 'gemini' | 'openai'
  model: string
  masked: string
  label: string | null
  priority: number
  is_primary: boolean
  is_active: boolean
  last_validated_at: string | null
  last_status: 'ok' | 'invalid' | 'rate_limited' | 'unknown' | null
}

export type AiStatus = {
  mode: 'cloud' | 'demo'
  configured: boolean
  primaryProvider: 'gemini' | 'openai' | null
  primaryModel: string | null
  totalKeys: number
  activeKeys: number
  keys: AiKeySummary[]
}

const DEMO_STATUS: AiStatus = {
  mode: 'demo',
  configured: false,
  primaryProvider: null,
  primaryModel: null,
  totalKeys: 0,
  activeKeys: 0,
  keys: [],
}

export async function getAiStatus(): Promise<AiStatus> {
  if (isDemoMode()) return DEMO_STATUS

  try {
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { ...DEMO_STATUS, mode: 'cloud' }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('ai_api_keys')
      .select('id, provider, model, key_value, label, priority, is_primary, is_active, last_validated_at, last_status')
      .eq('workspace_id', workspace.id)
      .order('is_primary', { ascending: false })
      .order('priority', { ascending: true })

    if (error || !data) return { ...DEMO_STATUS, mode: 'cloud' }

    const keys: AiKeySummary[] = data.map((k) => ({
      id: k.id,
      provider: k.provider as 'gemini' | 'openai',
      model: k.model,
      masked: maskKey(k.key_value),
      label: k.label,
      priority: k.priority,
      is_primary: k.is_primary,
      is_active: k.is_active,
      last_validated_at: k.last_validated_at,
      last_status: k.last_status as AiKeySummary['last_status'],
    }))

    const primary = keys.find((k) => k.is_primary && k.is_active)
    const activeKeys = keys.filter((k) => k.is_active).length

    return {
      mode: 'cloud',
      configured: activeKeys > 0,
      primaryProvider: primary?.provider ?? null,
      primaryModel: primary?.model ?? null,
      totalKeys: keys.length,
      activeKeys,
      keys,
    }
  } catch {
    return { ...DEMO_STATUS, mode: 'cloud' }
  }
}

function maskKey(key: string): string {
  if (key.length <= 12) return '****'
  return `${key.slice(0, 8)}…${key.slice(-4)}`
}
