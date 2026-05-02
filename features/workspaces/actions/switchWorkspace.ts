'use server'

import { cookies } from 'next/headers'

export async function switchWorkspace(workspaceId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('sdrflow-workspace-id', workspaceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax',
  })
}
