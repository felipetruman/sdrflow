-- 0001_initial_schema.sql
-- Schema inicial do SDRFlow AI

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos/Enums
CREATE TYPE lead_status AS ENUM ('active', 'inactive', 'converted', 'lost');
CREATE TYPE campaign_status AS ENUM ('active', 'inactive');
CREATE TYPE field_type AS ENUM ('text', 'number', 'date', 'boolean', 'select');
CREATE TYPE message_status AS ENUM ('generated', 'sent', 'copied');
CREATE TYPE generation_type AS ENUM ('manual', 'trigger');
CREATE TYPE activity_type AS ENUM (
  'lead_created',
  'lead_updated',
  'stage_changed',
  'message_generated',
  'message_sent',
  'auto_generation_failed'
);
CREATE TYPE member_role AS ENUM ('admin', 'member');

-- Tabelas

CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE workspace_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role member_role DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE funnel_stages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES funnel_stages(id) ON DELETE RESTRICT,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  job_title text,
  source text,
  notes text,
  owner_id uuid,
  status lead_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE custom_fields (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  key text NOT NULL,
  field_type field_type NOT NULL,
  options jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, key)
);

CREATE TABLE lead_custom_values (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  custom_field_id uuid NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lead_id, custom_field_id)
);

CREATE TABLE stage_required_fields (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES funnel_stages(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  is_custom_field boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, stage_id, field_key)
);

CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  context text NOT NULL,
  generation_prompt text NOT NULL,
  trigger_stage_id uuid REFERENCES funnel_stages(id) ON DELETE SET NULL,
  status campaign_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE generated_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  content text NOT NULL,
  status message_status DEFAULT 'generated',
  generation_type generation_type DEFAULT 'manual',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE lead_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  type activity_type NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_leads_workspace ON leads(workspace_id);
CREATE INDEX idx_leads_stage ON leads(stage_id);
CREATE INDEX idx_leads_owner ON leads(owner_id);
CREATE INDEX idx_funnel_stages_workspace ON funnel_stages(workspace_id);
CREATE INDEX idx_custom_fields_workspace ON custom_fields(workspace_id);
CREATE INDEX idx_lead_custom_values_lead ON lead_custom_values(lead_id);
CREATE INDEX idx_campaigns_workspace ON campaigns(workspace_id);
CREATE INDEX idx_generated_messages_lead ON generated_messages(lead_id);
CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);

-- Função is_workspace_member
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id AND user_id = p_user_id
  );
$$;

-- RPC: criar workspace com funil padrão
CREATE OR REPLACE FUNCTION create_workspace_with_defaults(
  p_name text,
  p_slug text,
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id uuid;
BEGIN
  INSERT INTO workspaces (name, slug)
  VALUES (p_name, p_slug)
  RETURNING id INTO v_workspace_id;

  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, p_user_id, 'admin');

  INSERT INTO funnel_stages (workspace_id, name, order_index, color)
  VALUES
    (v_workspace_id, 'Base', 0, '#94a3b8'),
    (v_workspace_id, 'Lead Mapeado', 1, '#60a5fa'),
    (v_workspace_id, 'Tentando Contato', 2, '#f59e0b'),
    (v_workspace_id, 'Conexão Iniciada', 3, '#10b981'),
    (v_workspace_id, 'Desqualificado', 4, '#ef4444'),
    (v_workspace_id, 'Qualificado', 5, '#8b5cf6'),
    (v_workspace_id, 'Reunião Agendada', 6, '#ec4899');

  RETURN v_workspace_id;
END;
$$;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER funnel_stages_updated_at BEFORE UPDATE ON funnel_stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER custom_fields_updated_at BEFORE UPDATE ON custom_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER lead_custom_values_updated_at BEFORE UPDATE ON lead_custom_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_custom_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_required_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Políticas workspaces
CREATE POLICY workspaces_select ON workspaces
  FOR SELECT USING (is_workspace_member(id, auth.uid()));
CREATE POLICY workspaces_insert ON workspaces
  FOR INSERT WITH CHECK (true);
CREATE POLICY workspaces_update ON workspaces
  FOR UPDATE USING (is_workspace_member(id, auth.uid()));

-- Políticas workspace_members
CREATE POLICY workspace_members_select ON workspace_members
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY workspace_members_insert ON workspace_members
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));

-- Políticas funnel_stages
CREATE POLICY funnel_stages_select ON funnel_stages
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY funnel_stages_insert ON funnel_stages
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY funnel_stages_update ON funnel_stages
  FOR UPDATE USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY funnel_stages_delete ON funnel_stages
  FOR DELETE USING (is_workspace_member(workspace_id, auth.uid()));

-- Políticas leads
CREATE POLICY leads_select ON leads
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY leads_insert ON leads
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY leads_update ON leads
  FOR UPDATE USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY leads_delete ON leads
  FOR DELETE USING (is_workspace_member(workspace_id, auth.uid()));

-- Políticas custom_fields
CREATE POLICY custom_fields_select ON custom_fields
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY custom_fields_insert ON custom_fields
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY custom_fields_update ON custom_fields
  FOR UPDATE USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY custom_fields_delete ON custom_fields
  FOR DELETE USING (is_workspace_member(workspace_id, auth.uid()));

-- Políticas lead_custom_values
CREATE POLICY lead_custom_values_select ON lead_custom_values
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_custom_values.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );
CREATE POLICY lead_custom_values_insert ON lead_custom_values
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_custom_values.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );
CREATE POLICY lead_custom_values_update ON lead_custom_values
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_custom_values.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );

-- Políticas stage_required_fields
CREATE POLICY stage_required_fields_select ON stage_required_fields
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY stage_required_fields_insert ON stage_required_fields
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY stage_required_fields_update ON stage_required_fields
  FOR UPDATE USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY stage_required_fields_delete ON stage_required_fields
  FOR DELETE USING (is_workspace_member(workspace_id, auth.uid()));

-- Políticas campaigns
CREATE POLICY campaigns_select ON campaigns
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY campaigns_insert ON campaigns
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY campaigns_update ON campaigns
  FOR UPDATE USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY campaigns_delete ON campaigns
  FOR DELETE USING (is_workspace_member(workspace_id, auth.uid()));

-- Políticas generated_messages
CREATE POLICY generated_messages_select ON generated_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = generated_messages.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );
CREATE POLICY generated_messages_insert ON generated_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = generated_messages.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );
CREATE POLICY generated_messages_update ON generated_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = generated_messages.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );

-- Políticas lead_activities
CREATE POLICY lead_activities_select ON lead_activities
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY lead_activities_insert ON lead_activities
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
