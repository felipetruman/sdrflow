import { demoStore } from './data'

export function createDemoClient() {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'demo-user', email: 'demo@sdrflow.ai' } }, error: null }) },
    from(table: string) {
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        order: () => chain,
        maybeSingle: async () => ({ data: table === 'workspace_members' ? { workspace_id: demoStore.getState().workspace.id, workspaces: demoStore.getState().workspace } : null, error: null }),
        single: async () => ({ data: null, error: null }),
        insert: async () => ({ data: null, error: null }),
        update: () => chain,
      }
      return chain
    },
  }
}
