'use server'

import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/data'

export async function signIn(input: { email: string; password: string }) {
  if (isDemoMode()) return {}
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: input.email, password: input.password })
  if (error) return { error: error.message }
  return {}
}
