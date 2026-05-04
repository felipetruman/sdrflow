import { describe, it, expect, beforeEach } from 'vitest'
import { demoStore } from '@/lib/demo/data'

describe('demoStore — CRUD de Leads', () => {
  beforeEach(() => {
    demoStore.reset()
  })

  it('deve retornar a lista completa de leads', () => {
    const state = demoStore.getState()
    expect(state.leads.length).toBe(6)
  })

  it('deve adicionar um novo lead no início da lista', () => {
    const countBefore = demoStore.getState().leads.length
    demoStore.addLead({
      id: 'new-lead',
      workspace_id: 'demo-workspace',
      stage_id: '11111111-1111-4111-8111-111111111111',
      name: 'Novo Lead',
      email: 'novo@test.com',
      phone: '(11) 99999-0000',
      company: 'Nova Empresa',
      job_title: 'CEO',
      source: 'Outbound',
      notes: 'Lead de teste',
      owner_id: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    const state = demoStore.getState()
    expect(state.leads.length).toBe(countBefore + 1)
    expect(state.leads[0].name).toBe('Novo Lead')
  })

  it('deve atualizar dados de um lead existente', () => {
    const updated = demoStore.updateLead('lead-1', { name: 'Marina Atualizada', phone: '(11) 90000-0000' })
    expect(updated?.name).toBe('Marina Atualizada')
    expect(updated?.phone).toBe('(11) 90000-0000')
  })

  it('deve retornar null ao atualizar lead inexistente', () => {
    const result = demoStore.updateLead('lead-inexistente', { name: 'Teste' })
    expect(result).toBeNull()
  })

  it('deve deletar um lead existente', () => {
    const countBefore = demoStore.getState().leads.length
    const result = demoStore.deleteLead('lead-1')
    expect(result).toBe(true)
    expect(demoStore.getState().leads.length).toBe(countBefore - 1)
  })

  it('deve retornar null ao deletar lead inexistente', () => {
    const result = demoStore.deleteLead('lead-inexistente')
    expect(result).toBeNull()
  })
})
