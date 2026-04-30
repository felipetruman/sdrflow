import { z } from 'zod'

export const campaignSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  context: z.string().min(1, 'Contexto é obrigatório'),
  generation_prompt: z.string().min(1, 'Prompt de geração é obrigatório'),
  trigger_stage_id: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
})

export type CampaignSchema = z.infer<typeof campaignSchema>
