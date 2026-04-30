import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  job_title: z.string().max(200).optional().or(z.literal('')),
  source: z.string().max(200).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  stage_id: z.string().uuid('Etapa inválida'),
  owner_id: z.string().uuid().optional().or(z.literal('')),
})

export type LeadSchema = z.infer<typeof leadSchema>
