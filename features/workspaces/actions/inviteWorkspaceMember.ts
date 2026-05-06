'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'
import { isDemoMode } from '@/lib/demo/data'

type Input = { email: string; role: 'admin' | 'member' }

export type InviteWorkspaceMemberResult = { error?: string; info?: string }

export async function inviteWorkspaceMember(input: Input): Promise<InviteWorkspaceMemberResult> {
  try {
    if (isDemoMode()) {
      // demo mode: feature not supported — surface as info, not error
      void input
      return { info: 'Convite de membros disponível apenas no modo cloud (Supabase).' }
    }
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    if (!user) return { error: 'Não autenticado' }

    const { data: myMembership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace.id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (myMembership?.role !== 'admin') {
      return { error: 'Apenas administradores podem convidar membros' }
    }

    const workspaceId = workspace.id

    const { data: existingInvites } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('role', 'member')
    const currentMemberCount = (existingInvites?.length ?? 0) + 1
    if (currentMemberCount > 50) return { error: 'Limite de membros atingido (50)' }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) return { error: 'Configuração de servidor indisponível' }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) return { error: 'URL do Supabase não configurada' }

    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseAnonKey) return { error: 'Chave pública do Supabase não configurada' }

    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey)

    let existingUser: { id: string; email?: string | null } | undefined
    let page = 1
    while (!existingUser) {
      const { data: pageData } = await adminClient.auth.admin.listUsers({ page, perPage: 100 })
      const users = pageData?.users ?? []
      if (users.length === 0) break
      existingUser = users.find((u) => u.email === input.email.toLowerCase())
      if (users.length < 100) break
      page++
    }

    let invitedUserId: string

    if (existingUser) {
      invitedUserId = existingUser.id
    } else {
      const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(input.email)
      if (inviteError) return { error: inviteError.message }
      if (!inviteData?.user?.id) return { error: 'Erro ao criar convite' }
      invitedUserId = inviteData.user.id
    }

    const { data: alreadyMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', invitedUserId)
      .maybeSingle()

    if (alreadyMember) return { error: 'Este usuário já é membro do workspace' }

    const { error: insertError } = await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspaceId, user_id: invitedUserId, role: input.role })

    if (insertError) throw insertError

    revalidatePath('/settings/members')
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
