'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'

export async function updateLeadCustomValues(leadId: string, values: Record<string, string>) {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    if (!user) return { error: 'Não autenticado' }

    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('workspace_id', workspace.id)
      .maybeSingle()
    if (!lead) return { error: 'Lead não encontrado neste workspace' }

    const entries = Object.entries(values)
    if (entries.length === 0) return {}

    const fieldIds = entries.map(([id]) => id)
    const { data: validFields } = await supabase
      .from('custom_fields')
      .select('id')
      .eq('workspace_id', workspace.id)
      .in('id', fieldIds)
    const validIds = new Set((validFields ?? []).map((f) => f.id))
    const invalidIds = fieldIds.filter((id) => !validIds.has(id))
    if (invalidIds.length > 0) return { error: 'Campos personalizados inválidos' }

    const { error } = await supabase
      .from('lead_custom_values')
      .upsert(
        entries.map(([custom_field_id, value]) => ({
          lead_id: leadId,
          custom_field_id,
          value: value?.trim() || null,
        })),
        { onConflict: 'lead_id,custom_field_id' },
      )
    if (error) throw error
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
