import type { ActivityType, Campaign, CustomField, FunnelStage, GeneratedMessage, Lead, LeadActivity, LeadWithStage, Workspace } from '@/types/app'

const now = new Date('2026-04-30T12:00:00.000Z')
const iso = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString()

export const DEMO_WORKSPACE: Workspace = { id: 'demo-workspace', name: 'Demo Workspace', slug: 'demo-workspace', created_at: iso(60), updated_at: iso(1) }

export const DEMO_STAGES: FunnelStage[] = [
  { id: '11111111-1111-4111-8111-111111111111', workspace_id: DEMO_WORKSPACE.id, name: 'Base', order_index: 1, color: '#94a3b8', created_at: iso(60), updated_at: iso(1) },
  { id: '22222222-2222-4222-8222-222222222222', workspace_id: DEMO_WORKSPACE.id, name: 'Lead Mapeado', order_index: 2, color: '#60a5fa', created_at: iso(60), updated_at: iso(1) },
  { id: '33333333-3333-4333-8333-333333333333', workspace_id: DEMO_WORKSPACE.id, name: 'Tentando Contato', order_index: 3, color: '#f59e0b', created_at: iso(60), updated_at: iso(1) },
  { id: '44444444-4444-4444-8444-444444444444', workspace_id: DEMO_WORKSPACE.id, name: 'Conexão Iniciada', order_index: 4, color: '#a855f7', created_at: iso(60), updated_at: iso(1) },
  { id: '55555555-5555-4555-8555-555555555555', workspace_id: DEMO_WORKSPACE.id, name: 'Desqualificado', order_index: 5, color: '#ef4444', created_at: iso(60), updated_at: iso(1) },
  { id: '66666666-6666-4666-8666-666666666666', workspace_id: DEMO_WORKSPACE.id, name: 'Qualificado', order_index: 6, color: '#22c55e', created_at: iso(60), updated_at: iso(1) },
  { id: '77777777-7777-4777-8777-777777777777', workspace_id: DEMO_WORKSPACE.id, name: 'Reunião Agendada', order_index: 7, color: '#14b8a6', created_at: iso(60), updated_at: iso(1) },
]

export const DEMO_LEADS: Lead[] = [
  { id: 'lead-1', workspace_id: DEMO_WORKSPACE.id, stage_id: '11111111-1111-4111-8111-111111111111', name: 'Marina Almeida', email: 'marina@contabilprime.com.br', phone: '(11) 98888-1234', company: 'Contábil Prime', job_title: 'Head de Operações', source: 'LinkedIn', notes: 'Pediu apresentação do produto com foco em automação.', owner_id: null, status: 'active', created_at: iso(8), updated_at: iso(2) },
  { id: 'lead-2', workspace_id: DEMO_WORKSPACE.id, stage_id: '22222222-2222-4222-8222-222222222222', name: 'Rafael Souza', email: 'rafael@logtechbr.com', phone: '(21) 97777-4567', company: 'LogTech Brasil', job_title: 'Gerente Comercial', source: 'Outbound', notes: 'Interessado em reduzir tempo de prospecção.', owner_id: null, status: 'active', created_at: iso(12), updated_at: iso(1) },
  { id: 'lead-3', workspace_id: DEMO_WORKSPACE.id, stage_id: '33333333-3333-4333-8333-333333333333', name: 'Camila Pereira', email: 'camila@eduvia.com.br', phone: '(31) 96666-7890', company: 'Eduvia', job_title: 'Coordenadora de Growth', source: 'Indicação', notes: 'Sem resposta após 2 tentativas.', owner_id: null, status: 'active', created_at: iso(6), updated_at: iso(1) },
  { id: 'lead-4', workspace_id: DEMO_WORKSPACE.id, stage_id: '44444444-4444-4444-8444-444444444444', name: 'Diego Martins', email: 'diego@saude360.com', phone: '(41) 95555-2222', company: 'Saúde360', job_title: 'Founder', source: 'Evento', notes: 'Aguardando envio de proposta.', owner_id: null, status: 'active', created_at: iso(20), updated_at: iso(1) },
  { id: 'lead-5', workspace_id: DEMO_WORKSPACE.id, stage_id: '66666666-6666-4666-8666-666666666666', name: 'Juliana Costa', email: 'juliana@vendaspro.com.br', phone: '(51) 94444-9876', company: 'Vendas Pro', job_title: 'Diretora de Receita', source: 'Inbound', notes: 'Reunião com time comercial na sexta.', owner_id: null, status: 'active', created_at: iso(15), updated_at: iso(1) },
  { id: 'lead-6', workspace_id: DEMO_WORKSPACE.id, stage_id: '77777777-7777-4777-8777-777777777777', name: 'Pedro Henrique', email: 'pedro@finpulse.com.br', phone: '(85) 93333-3333', company: 'FinPulse', job_title: 'CEO', source: 'Webinar', notes: 'Reunião confirmada para terça 10h.', owner_id: null, status: 'active', created_at: iso(25), updated_at: iso(1) },
]

export const DEMO_CAMPAIGNS: Campaign[] = [
  { id: 'campaign-1', workspace_id: DEMO_WORKSPACE.id, name: 'Campanha Outbound Q2', context: 'Foco em empresas B2B com time comercial pequeno.', generation_prompt: 'Escreva mensagens curtas, consultivas e com CTA para reunião.', trigger_stage_id: '11111111-1111-4111-8111-111111111111', status: 'active', created_at: iso(18), updated_at: iso(2) },
  { id: 'campaign-2', workspace_id: DEMO_WORKSPACE.id, name: 'Reativação de Leads', context: 'Recuperar leads frios dos últimos 90 dias.', generation_prompt: 'Aproxime com empatia e mencione melhoria operacional.', trigger_stage_id: '33333333-3333-4333-8333-333333333333', status: 'inactive', created_at: iso(30), updated_at: iso(10) },
]

export const DEMO_CUSTOM_FIELDS: CustomField[] = [
  { id: 'field-segmento', workspace_id: DEMO_WORKSPACE.id, name: 'Segmento', key: 'segmento', field_type: 'select', options: ['SaaS', 'Serviços', 'Indústria'], created_at: iso(55), updated_at: iso(1) },
  { id: 'field-produto', workspace_id: DEMO_WORKSPACE.id, name: 'Produto de Interesse', key: 'produto_interesse', field_type: 'text', options: null, created_at: iso(55), updated_at: iso(1) },
]

export const DEMO_STAGE_REQUIRED_FIELDS = [
  { id: 'stage-required-1', workspace_id: DEMO_WORKSPACE.id, stage_id: '66666666-6666-4666-8666-666666666666', field_key: 'company', is_custom_field: false, created_at: iso(40) },
  { id: 'stage-required-2', workspace_id: DEMO_WORKSPACE.id, stage_id: '66666666-6666-4666-8666-666666666666', field_key: 'job_title', is_custom_field: false, created_at: iso(40) },
  { id: 'stage-required-3', workspace_id: DEMO_WORKSPACE.id, stage_id: '77777777-7777-4777-8777-777777777777', field_key: 'segmento', is_custom_field: true, created_at: iso(40) },
] as const

export const DEMO_LEAD_CUSTOM_VALUES: { id: string; lead_id: string; custom_field_id: string; value: string | null; created_at: string; updated_at: string }[] = [
  { id: 'lead-custom-1', lead_id: 'lead-5', custom_field_id: 'field-segmento', value: 'Serviços', created_at: iso(12), updated_at: iso(1) },
]

export const DEMO_GENERATED_MESSAGES: GeneratedMessage[] = [
  { id: 'message-1', lead_id: 'lead-5', campaign_id: 'campaign-1', content: 'Juliana, vi que a Vendas Pro está acelerando o time comercial. Posso te mostrar como outras equipes reduziram o tempo de prospecção?', status: 'generated', generation_type: 'manual', sent_at: null, created_at: iso(1), campaign: DEMO_CAMPAIGNS[0] },
  { id: 'message-2', lead_id: 'lead-6', campaign_id: 'campaign-2', content: 'Pedro, retomando nosso papo sobre eficiência operacional: tenho uma ideia rápida para trazer previsibilidade ao pipeline.', status: 'sent', generation_type: 'trigger', sent_at: iso(1), created_at: iso(2), campaign: DEMO_CAMPAIGNS[1] },
]

export const DEMO_ACTIVITIES: LeadActivity[] = [
  { id: 'activity-1', lead_id: 'lead-6', workspace_id: DEMO_WORKSPACE.id, type: 'lead_created', metadata: { lead_name: 'Pedro Henrique' }, created_at: iso(25) },
  { id: 'activity-2', lead_id: 'lead-6', workspace_id: DEMO_WORKSPACE.id, type: 'message_generated', metadata: { campaign_name: 'Reativação de Leads' }, created_at: iso(2) },
  { id: 'activity-3', lead_id: 'lead-5', workspace_id: DEMO_WORKSPACE.id, type: 'stage_changed', metadata: { from: 'Conexão Iniciada', to: 'Qualificado' }, created_at: iso(1) },
]

export const isDemoMode = () => process.env.USE_DEMO_MODE === 'true'

export type DemoState = {
  workspace: Workspace
  stages: FunnelStage[]
  leads: Lead[]
  campaigns: Campaign[]
  customFields: CustomField[]
  stageRequiredFields: typeof DEMO_STAGE_REQUIRED_FIELDS
  leadCustomValues: typeof DEMO_LEAD_CUSTOM_VALUES
  activities: LeadActivity[]
  messages: GeneratedMessage[]
}

export const createDemoState = (): DemoState => ({
  workspace: DEMO_WORKSPACE,
  stages: [...DEMO_STAGES],
  leads: [...DEMO_LEADS],
  campaigns: [...DEMO_CAMPAIGNS],
  customFields: [...DEMO_CUSTOM_FIELDS],
  stageRequiredFields: [...DEMO_STAGE_REQUIRED_FIELDS],
  leadCustomValues: [...DEMO_LEAD_CUSTOM_VALUES],
  activities: [...DEMO_ACTIVITIES],
  messages: [...DEMO_GENERATED_MESSAGES],
})

const state: DemoState = createDemoState()

export const demoStore = {
  getState: () => state,
  reset: () => Object.assign(state, createDemoState()),
  addLead: (lead: Lead) => { state.leads.unshift(lead); return lead },
  updateLead: (id: string, payload: Partial<Lead>) => { const lead = state.leads.find((item) => item.id === id); if (!lead) return null; Object.assign(lead, payload, { updated_at: new Date().toISOString() }); return lead },
  moveLeadStage: (id: string, stageId: string) => {
    const lead = state.leads.find((item) => item.id === id)
    if (!lead) return null

    const standardFieldLabels: Record<string, string> = {
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      company: 'Empresa',
      job_title: 'Cargo',
      source: 'Origem',
      notes: 'Observações',
    }

    const requiredFields = state.stageRequiredFields.filter((field) => field.stage_id === stageId)
    const missingFields = requiredFields.flatMap((field) => {
      if (field.is_custom_field) {
        const customField = state.customFields.find((custom) => custom.key === field.field_key)
        if (!customField) return [field.field_key]
        const customValue = state.leadCustomValues.find((value) => value.lead_id === id && value.custom_field_id === customField.id)?.value
        const empty = customValue === null || customValue === undefined || customValue === ''
        return empty ? [customField.name] : []
      }

      const value = lead[field.field_key as keyof Lead]
      const empty = value === null || value === undefined || value === ''
      return empty ? [standardFieldLabels[field.field_key] ?? field.field_key] : []
    })

    if (missingFields.length) {
      return { success: false, error: 'Campos obrigatórios faltando', missingFields }
    }

    lead.stage_id = stageId
    lead.updated_at = new Date().toISOString()
    return { success: true }
  },
  deleteLead: (id: string) => { const index = state.leads.findIndex((item) => item.id === id); if (index === -1) return null; state.leads.splice(index, 1); return true },
}

export const enrichLeadsWithStage = (leads: Lead[]) => leads.map((lead) => ({ ...lead, stage: state.stages.find((stage) => stage.id === lead.stage_id) ?? state.stages[0] })) as LeadWithStage[]
