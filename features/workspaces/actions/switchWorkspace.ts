'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function switchWorkspace(workspaceId: string): Promise<{ error?: string }> {
  if (!workspaceId) return { error: 'ID do workspace inválido' }

  try {
    const supabase = await createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    if (!user) return { error: 'Não autenticado' }

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .eq('workspace_id', workspaceId)
      .maybeSingle()

    if (!membership) return { error: 'Sem acesso a este workspace' }

    const cookieStore = await cookies()
    cookieStore.set('sdrflow-workspace-id', workspaceId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    })
    return {}
  } catch (error) {
    return { error: 'Erro ao trocar de workspace' }
  }
}
