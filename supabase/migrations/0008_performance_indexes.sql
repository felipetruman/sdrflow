-- Performance indexes for SDR Flow
-- Optimizes frequent queries: Kanban listing, search, message generation, dashboard

-- 1. Composite index for Kanban listing (most queried path)
CREATE INDEX IF NOT EXISTS idx_leads_workspace_stage_status
  ON leads(workspace_id, stage_id, status)
  WHERE status = 'active';

-- 2. Full-text search on leads (name, company, email)
CREATE INDEX IF NOT EXISTS idx_leads_fts
  ON leads USING gin(to_tsvector('portuguese', coalesce(name, '') || ' ' || coalesce(company, '') || ' ' || coalesce(email, '')));

-- 3. Campaigns with trigger stage (auto-generation lookup)
CREATE INDEX IF NOT EXISTS idx_campaigns_ws_trigger
  ON campaigns(workspace_id, trigger_stage_id)
  WHERE is_active = true AND trigger_stage_id IS NOT NULL;

-- 4. Messages per lead, ordered by recency
CREATE INDEX IF NOT EXISTS idx_generated_messages_lead_recent
  ON generated_messages(lead_id, created_at DESC);

-- 5. Activities timeline per lead
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_recent
  ON lead_activities(lead_id, created_at DESC);

-- 6. Custom values per lead
CREATE INDEX IF NOT EXISTS idx_lead_custom_values_lookup
  ON lead_custom_values(lead_id, custom_field_id);

-- 7. Stage required fields lookup
CREATE INDEX IF NOT EXISTS idx_stage_required_fields_stage
  ON stage_required_fields(stage_id);

-- Update statistics for query planner
ANALYZE leads;
ANALYZE campaigns;
ANALYZE generated_messages;
ANALYZE lead_activities;
ANALYZE lead_custom_values;
ANALYZE funnel_stages;
