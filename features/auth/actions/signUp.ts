'use server'

import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/data'

export async function signUp(input: { email: string; password: string }) {
  if (isDemoMode()) return {}
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email: input.email, password: input.password })
  if (error) return { error: 'Não foi possível criar a conta. Verifique o e-mail e tente novamente.' }
  return {}
}
