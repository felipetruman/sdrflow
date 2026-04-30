'use server'

import { createClient } from '@/lib/supabase/server'

export async function signIn(input: { email: string; password: string }) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: input.email, password: input.password })
  if (error) return { error: error.message }
  return {}
}
