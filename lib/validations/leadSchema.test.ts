import { describe, it, expect } from 'vitest'
import { leadSchema } from '@/lib/validations/leadSchema'

describe('leadSchema', () => {
  it('deve validar lead com campos mínimos', () => {
    const result = leadSchema.safeParse({
      name: 'João Teste',
      stage_id: '11111111-1111-4111-8111-111111111111',
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar lead sem nome', () => {
    const result = leadSchema.safeParse({
      name: '',
      stage_id: '11111111-1111-4111-8111-111111111111',
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar email inválido', () => {
    const result = leadSchema.safeParse({
      name: 'João',
      email: 'invalido',
      stage_id: '11111111-1111-4111-8111-111111111111',
    })
    expect(result.success).toBe(false)
  })

  it('deve aceitar email vazio', () => {
    const result = leadSchema.safeParse({
      name: 'João',
      email: '',
      stage_id: '11111111-1111-4111-8111-111111111111',
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar stage_id não UUID', () => {
    const result = leadSchema.safeParse({
      name: 'João',
      stage_id: 'invalido',
    })
    expect(result.success).toBe(false)
  })

  it('deve aceitar lead com todos os campos preenchidos', () => {
    const result = leadSchema.safeParse({
      name: 'Maria Souza',
      email: 'maria@empresa.com',
      phone: '(11) 99999-8888',
      company: 'ACME Ltda',
      job_title: 'Diretora',
      source: 'LinkedIn',
      notes: 'Lead quente',
      stage_id: '11111111-1111-4111-8111-111111111111',
      owner_id: 'user-123',
    })
    expect(result.success).toBe(true)
  })
})
