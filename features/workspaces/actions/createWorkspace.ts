'use server'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils/slugify'

export async function createWorkspace(input: { name: string }) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  const user = userData.user
  if (userError || !user) return { error: userError?.message ?? 'Usuário não autenticado' }
  const { data, error } = await supabase.rpc('create_workspace_with_defaults', { p_name: input.name, p_slug: slugify(input.name), p_user_id: user.id })
  if (error) return { error: error.message }
  const id = typeof data === 'string' ? data : (data as { id?: string } | null)?.id
  return { data: id ? { id } : undefined }
}
