import { describe, it, expect } from 'vitest'
import { campaignSchema } from '@/lib/validations/campaignSchema'

describe('campaignSchema', () => {
  it('deve validar campanha com campos obrigatórios', () => {
    const result = campaignSchema.safeParse({
      name: 'Campanha Q2',
      context: 'Foco em SaaS B2B',
      generation_prompt: 'Tom consultivo e direto',
    })
    expect(result.success).toBe(true)
  })

  it('deve aceitar trigger_stage_id opcional', () => {
    const result = campaignSchema.safeParse({
      name: 'Campanha Q2',
      context: 'Foco em SaaS B2B',
      generation_prompt: 'Tom consultivo',
      trigger_stage_id: '',
    })
    expect(result.success).toBe(true)
  })

  it('deve aceitar trigger_stage_id UUID', () => {
    const result = campaignSchema.safeParse({
      name: 'Campanha Q2',
      context: 'Foco em SaaS B2B',
      generation_prompt: 'Tom consultivo',
      trigger_stage_id: '11111111-1111-4111-8111-111111111111',
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar status inválido', () => {
    const result = campaignSchema.safeParse({
      name: 'Campanha Q2',
      context: 'Foco em SaaS B2B',
      generation_prompt: 'Tom consultivo',
      status: 'invalid',
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar nome vazio', () => {
    const result = campaignSchema.safeParse({
      name: '',
      context: 'Contexto',
      generation_prompt: 'Prompt',
    })
    expect(result.success).toBe(false)
  })
})
