export type LeadStatus = 'active' | 'inactive' | 'converted' | 'lost'
export type CampaignStatus = 'active' | 'inactive'
export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'select'
export type MessageStatus = 'generated' | 'sent' | 'copied'
export type GenerationType = 'manual' | 'trigger'
export type ActivityType =
  | 'lead_created'
  | 'lead_updated'
  | 'stage_changed'
  | 'message_generated'
  | 'message_sent'
  | 'auto_generation_failed'
export type MemberRole = 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface FunnelStage {
  id: string
  workspace_id: string
  name: string
  order_index: number
  color: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  workspace_id: string
  stage_id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  job_title: string | null
  source: string | null
  notes: string | null
  owner_id: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
}

export interface LeadWithStage extends Lead {
  stage: FunnelStage
}

export interface CustomField {
  id: string
  workspace_id: string
  name: string
  key: string
  field_type: FieldType
  options: string[] | null
  created_at: string
  updated_at: string
}

export interface LeadCustomValue {
  id: string
  lead_id: string
  custom_field_id: string
  value: string | null
  custom_field?: CustomField
}

export interface Campaign {
  id: string
  workspace_id: string
  name: string
  context: string
  generation_prompt: string
  trigger_stage_id: string | null
  status: CampaignStatus
  created_at: string
  updated_at: string
}

export interface GeneratedMessage {
  id: string
  lead_id: string
  campaign_id: string
  content: string
  status: MessageStatus
  generation_type: GenerationType
  sent_at: string | null
  created_at: string
  campaign?: Campaign
}

export interface LeadActivity {
  id: string
  lead_id: string
  workspace_id: string
  type: ActivityType
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface StageRequiredField {
  id: string
  workspace_id: string
  stage_id: string
  field_key: string
  is_custom_field: boolean
}

export interface KanbanData {
  stages: FunnelStage[]
  leads: LeadWithStage[]
}

export interface DashboardMetrics {
  totalLeads: number
  leadsByStage: { stage_id: string; stage_name: string; count: number }[]
  activeCampaigns: number
  totalMessagesGenerated: number
  totalMessagesSent: number
  leadsLast7Days: number
  leadsLast30Days: number
  messagesByCampaign: { campaign_id: string; campaign_name: string; count: number }[]
  stageConversionRates: { from_stage: string; to_stage: string; rate: number }[]
}
