import { describe, it, expect, beforeEach } from 'vitest'
import { demoStore } from '@/lib/demo/data'
import type { Lead } from '@/types/app'

describe('moveLeadStage — validação de campos obrigatórios', () => {
  beforeEach(() => {
    demoStore.reset()
  })

  it('deve mover lead quando não há campos obrigatórios na etapa destino', () => {
    const result = demoStore.moveLeadStage('lead-1', '22222222-2222-4222-8222-222222222222')
    expect(result).toEqual({ success: true })
  })

  it('deve bloquear transição para Qualificado quando campos padrão estão vazios', () => {
    demoStore.updateLead('lead-1', { company: '', job_title: '' })
    const result = demoStore.moveLeadStage('lead-1', '66666666-6666-4666-8666-666666666666')
    expect(result?.success).toBe(false)
    expect((result as { missingFields?: string[] })?.missingFields?.length).toBeGreaterThan(0)
  })

  it('deve permitir transição para Qualificado quando campos padrão estão preenchidos', () => {
    const lead = demoStore.updateLead('lead-1', { company: 'ACME Ltda', job_title: 'Head de Operações' })
    expect(lead?.company).toBe('ACME Ltda')
    expect(lead?.job_title).toBe('Head de Operações')

    const result = demoStore.moveLeadStage('lead-1', '66666666-6666-4666-8666-666666666666')
    expect(result?.success).toBe(true)
  })

  it('deve bloquear transição para Reunião Agendada quando custom field "segmento" está vazio', () => {
    const result = demoStore.moveLeadStage('lead-1', '77777777-7777-4777-8777-777777777777')
    expect(result?.success).toBe(false)
    expect((result as { missingFields: string[] })?.missingFields).toContain('segmento')
  })

  it('deve retornar null para lead inexistente', () => {
    const result = demoStore.moveLeadStage('lead-inexistente', '11111111-1111-4111-8111-111111111111')
    expect(result).toBeNull()
  })
})
