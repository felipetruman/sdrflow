import { demoStore } from './data'
import type { SupabaseClientLike, SupabaseQueryBuilder, SupabaseRow, SupabaseTableName } from '@/lib/supabase/types'

const createChain = <T>(table: string): SupabaseQueryBuilder<T> => {
  const chain: SupabaseQueryBuilder<T> = {
    then: (onfulfilled, onrejected) => Promise.resolve({ data: [] as T[] | null, error: null }).then(onfulfilled, onrejected),
    select: () => chain,
    eq: () => chain,
    order: () => chain,
    maybeSingle: async () => ({
      data: table === 'workspace_members' ? ({ workspace_id: demoStore.getState().workspace.id, workspaces: demoStore.getState().workspace } as unknown as T) : null,
      error: null,
    }),
    single: async () => ({ data: null, error: null }),
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
  }
  return chain
}

export function createDemoClient(): SupabaseClientLike {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'demo-user', email: 'demo@sdrflow.ai' } }, error: null }), getSession: async () => ({ data: { session: { user: { id: 'demo-user', email: 'demo@sdrflow.ai' }, access_token: 'demo-token' } }, error: null }), signInWithPassword: async () => ({ data: null, error: null }), signUp: async () => ({ data: null, error: null }), signOut: async () => ({ error: null }) },
    from: <T extends SupabaseTableName>(table: T) => createChain<SupabaseRow<T>>(table),
    functions: { invoke: async () => ({ data: null, error: null }) },
    rpc: async () => ({ data: null, error: null }),
  }
}
