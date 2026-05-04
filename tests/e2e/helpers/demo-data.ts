export const DEMO_CREDENTIALS = { email: 'demo@sdrflow.ai', password: 'demo123' }

export const DEMO_STAGES = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Base', order: 1 },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Lead Mapeado', order: 2 },
  { id: '33333333-3333-4333-8333-333333333333', name: 'Tentando Contato', order: 3 },
  { id: '44444444-4444-4444-8444-444444444444', name: 'Conexão Iniciada', order: 4 },
  { id: '55555555-5555-4555-8555-555555555555', name: 'Desqualificado', order: 5 },
  { id: '66666666-6666-4666-8666-666666666666', name: 'Qualificado', order: 6 },
  { id: '77777777-7777-4777-8777-777777777777', name: 'Reunião Agendada', order: 7 },
]

export const DEMO_LEADS = [
  { id: 'lead-1', name: 'Marina Almeida', company: 'Contábil Prime', stage: 'Base' },
  { id: 'lead-2', name: 'Rafael Souza', company: 'LogTech Brasil', stage: 'Lead Mapeado' },
  { id: 'lead-3', name: 'Camila Pereira', company: 'Eduvia', stage: 'Tentando Contato' },
  { id: 'lead-4', name: 'Diego Martins', company: 'Saúde360', stage: 'Conexão Iniciada' },
  { id: 'lead-5', name: 'Juliana Costa', company: 'Vendas Pro', stage: 'Qualificado' },
  { id: 'lead-6', name: 'Pedro Henrique', company: 'FinPulse', stage: 'Reunião Agendada' },
]

export const DEMO_CAMPAIGNS = [
  { id: 'campaign-1', name: 'Campanha Outbound Q2', status: 'active' },
  { id: 'campaign-2', name: 'Reativação de Leads', status: 'inactive' },
]
