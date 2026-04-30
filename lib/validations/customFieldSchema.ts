import { z } from 'zod'

export const customFieldSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  key: z.string().min(1, 'Chave é obrigatória').max(50).regex(/^[a-z0-9_]+$/, 'Chave deve conter apenas letras minúsculas, números e underscore'),
  field_type: z.enum(['text', 'number', 'date', 'boolean', 'select']),
  options: z.array(z.string()).optional(),
})

export type CustomFieldSchema = z.infer<typeof customFieldSchema>
