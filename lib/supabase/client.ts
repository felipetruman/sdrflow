import { createBrowserClient } from '@supabase/ssr'
import { createDemoClient } from '@/lib/demo/client'
import { isDemoMode } from '@/lib/demo/data'
import type { SupabaseClientLike } from './types'

export function createClient(): SupabaseClientLike {
  if (isDemoMode()) return createDemoClient()
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as SupabaseClientLike
}
