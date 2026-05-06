'use server'

import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/data'

export type AiStatus = {
  configured: boolean
  model: string
  baseUrl: string
  mode: 'cloud' | 'demo'
}

export async function getAiStatus(): Promise<AiStatus> {
  if (isDemoMode()) {
    return { configured: false, model: 'template-local', baseUrl: 'n/a', mode: 'demo' }
  }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.functions.invoke<{ configured: boolean; model: string; baseUrl: string }>('ai-status', { body: {} })
    if (error || !data) {
      return { configured: false, model: 'desconhecido', baseUrl: 'desconhecido', mode: 'cloud' }
    }
    return { ...data, mode: 'cloud' }
  } catch {
    return { configured: false, model: 'desconhecido', baseUrl: 'desconhecido', mode: 'cloud' }
  }
}
