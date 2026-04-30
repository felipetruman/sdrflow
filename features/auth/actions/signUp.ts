'use server'

import { createClient } from '@/lib/supabase/server'

export async function signUp(input: { email: string; password: string }) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email: input.email, password: input.password })
  if (error) return { error: error.message }
  return {}
}
