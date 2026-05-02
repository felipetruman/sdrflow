'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'

type Input = { email: string; role: 'admin' | 'member' }

export async function inviteWorkspaceMember(input: Input): Promise<{ error?: string }> {
  try {
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
      .maybeSingle() as { data: { role: string } | null; error: unknown }

    if (myMembership?.role !== 'admin') {
      return { error: 'Apenas administradores podem convidar membros' }
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) return { error: 'Configuração de servidor indisponível' }

    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const adminClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)

    const { data: usersData } = await adminClient.auth.admin.listUsers()
    const existingUser = usersData?.users?.find((u) => u.email === input.email.toLowerCase())

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
      .eq('workspace_id', workspace.id)
      .eq('user_id', invitedUserId)
      .maybeSingle() as { data: { id: string } | null; error: unknown }

    if (alreadyMember) return { error: 'Este usuário já é membro do workspace' }

    const { error: insertError } = await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspace.id, user_id: invitedUserId, role: input.role })

    if (insertError) throw insertError

    revalidatePath('/settings/members')
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
