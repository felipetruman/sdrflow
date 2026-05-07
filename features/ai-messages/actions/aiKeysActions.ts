'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addKeySchema = z.object({
  provider: z.enum(['gemini', 'openai']),
  model: z.string().min(1).max(100),
  key_value: z.string().min(20).max(500),
  label: z.string().max(80).optional().nullable(),
  setAsPrimary: z.boolean().optional(),
})

export type AddKeyInput = z.infer<typeof addKeySchema>

export async function validateAndAddAiKey(input: AddKeyInput): Promise<{ error?: string; keyId?: string; status?: 'ok' | 'invalid' | 'rate_limited' }> {
  try {
    const parsed = addKeySchema.safeParse(input)
    if (!parsed.success) return { error: 'Dados inválidos: ' + parsed.error.issues[0]?.message }

    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return { error: 'Não autenticado' }

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace.id)
      .eq('user_id', session.user.id)
      .maybeSingle()
    if (membership?.role !== 'admin') return { error: 'Apenas administradores podem gerenciar chaves' }

    const validation = await validateKeyOnline(parsed.data.provider, parsed.data.model, parsed.data.key_value)

    const nextPriority = await getNextPriority(supabase, workspace.id)

    if (parsed.data.setAsPrimary) {
      await supabase
        .from('ai_api_keys')
        .update({ is_primary: false })
        .eq('workspace_id', workspace.id)
    }

    const { data: inserted, error: insertError } = await supabase
      .from('ai_api_keys')
      .insert({
        workspace_id: workspace.id,
        provider: parsed.data.provider,
        model: parsed.data.model,
        key_value: parsed.data.key_value,
        label: parsed.data.label ?? null,
        priority: nextPriority,
        is_primary: parsed.data.setAsPrimary ?? false,
        is_active: validation.status === 'ok',
        last_status: validation.status,
        last_validated_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError || !inserted) return { error: insertError?.message ?? 'Falha ao salvar chave' }

    revalidatePath('/settings/ai')
    return { keyId: inserted.id, status: validation.status }
  } catch (err) {
    return { error: getErrorMessage(err) }
  }
}

export async function removeAiKey(keyId: string): Promise<{ error?: string }> {
  try {
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const supabase = await createClient()
    const { error } = await supabase
      .from('ai_api_keys')
      .delete()
      .eq('id', keyId)
      .eq('workspace_id', workspace.id)
    if (error) return { error: getErrorMessage(error) }

    revalidatePath('/settings/ai')
    return {}
  } catch (err) {
    return { error: getErrorMessage(err) }
  }
}

export async function setPrimaryAiKey(keyId: string): Promise<{ error?: string }> {
  try {
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const supabase = await createClient()
    const { error: clearError } = await supabase
      .from('ai_api_keys')
      .update({ is_primary: false })
      .eq('workspace_id', workspace.id)
    if (clearError) return { error: getErrorMessage(clearError) }

    const { error: setError } = await supabase
      .from('ai_api_keys')
      .update({ is_primary: true, is_active: true })
      .eq('id', keyId)
      .eq('workspace_id', workspace.id)
    if (setError) return { error: getErrorMessage(setError) }

    revalidatePath('/settings/ai')
    return {}
  } catch (err) {
    return { error: getErrorMessage(err) }
  }
}

export async function toggleAiKeyActive(keyId: string, isActive: boolean): Promise<{ error?: string }> {
  try {
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const supabase = await createClient()
    const { error } = await supabase
      .from('ai_api_keys')
      .update({ is_active: isActive })
      .eq('id', keyId)
      .eq('workspace_id', workspace.id)
    if (error) return { error: getErrorMessage(error) }

    revalidatePath('/settings/ai')
    return {}
  } catch (err) {
    return { error: getErrorMessage(err) }
  }
}

async function validateKeyOnline(
  provider: 'gemini' | 'openai',
  model: string,
  key: string,
): Promise<{ status: 'ok' | 'invalid' | 'rate_limited' }> {
  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ok' }] }] }),
      })
      if (res.status === 200) return { status: 'ok' }
      if (res.status === 429) return { status: 'rate_limited' }
      return { status: 'invalid' }
    }
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ok' }], max_tokens: 5 }),
      })
      if (res.status === 200) return { status: 'ok' }
      if (res.status === 429) return { status: 'rate_limited' }
      return { status: 'invalid' }
    }
  } catch {
    return { status: 'invalid' }
  }
  return { status: 'invalid' }
}

async function getNextPriority(supabase: import('@/lib/supabase/types').SupabaseClientLike, workspaceId: string): Promise<number> {
  const { data } = await supabase
    .from('ai_api_keys')
    .select('priority')
    .eq('workspace_id', workspaceId)
    .order('priority', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data?.priority ?? 0) + 10
}
