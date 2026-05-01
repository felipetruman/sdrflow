import { z } from 'zod'

export const workspaceSchema = z.object({
  name: z.string().min(1, 'Nome do workspace é obrigatório').max(100),
})

export type WorkspaceSchema = z.infer<typeof workspaceSchema>
