# DATABASE | SDRFlow AI

## 1. Visão geral

O banco do SDRFlow AI foi modelado para suportar um Mini CRM SDR com:

1. Autenticação via Supabase Auth.
2. Workspaces isolados.
3. Leads em Kanban.
4. Campos personalizados por workspace.
5. Campanhas de abordagem.
6. Geração de mensagens com IA.
7. Histórico de mensagens.
8. Histórico de atividades.
9. Regras de campos obrigatórios por etapa.
10. Row Level Security.

A decisão central é que todas as entidades operacionais carregam `workspace_id`.

---

## 2. Tabelas

### 2.1 `workspaces`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador do workspace |
| `name` | text | Nome da empresa/equipe |
| `slug` | text UNIQUE | Slug para URL |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

### 2.2 `workspace_members`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace vinculado |
| `user_id` | uuid | Usuário do Supabase Auth |
| `role` | member_role enum | `admin` ou `member` |
| `created_at` | timestamptz | Data de criação |

### 2.3 `funnel_stages`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `name` | text | Nome da etapa |
| `order_index` | integer | Ordem no Kanban |
| `color` | text | Cor da coluna |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

Etapas padrão criadas automaticamente: Base, Lead Mapeado, Tentando Contato, Conexão Iniciada, Desqualificado, Qualificado, Reunião Agendada.

### 2.4 `leads`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `stage_id` | uuid FK | Etapa atual no funil |
| `name` | text | Nome do lead |
| `email` | text | Email |
| `phone` | text | Telefone |
| `company` | text | Empresa |
| `job_title` | text | Cargo |
| `source` | text | Origem do lead |
| `notes` | text | Observações |
| `owner_id` | uuid | Responsável (opcional) |
| `status` | lead_status enum | `active`, `inactive`, `converted`, `lost` |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

### 2.5 `custom_fields`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `name` | text | Nome visível |
| `key` | text UNIQUE(workspace) | Chave interna |
| `field_type` | field_type enum | `text`, `number`, `date`, `boolean`, `select` |
| `options` | jsonb | Opções para campo `select` |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

### 2.6 `lead_custom_values`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `lead_id` | uuid FK | Lead |
| `custom_field_id` | uuid FK | Campo personalizado |
| `value` | text | Valor (string universal) |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

**Nota:** No MVP, usamos uma coluna `value text` universal para simplificar. Valores numéricos, booleanos e datas são serializados como string.

### 2.7 `stage_required_fields`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `stage_id` | uuid FK | Etapa do funil |
| `field_key` | text | Nome da coluna (ex: `job_title`) ou ID do custom field |
| `is_custom_field` | boolean | `true` se `field_key` for um custom field ID |
| `created_at` | timestamptz | Data de criação |

### 2.8 `campaigns`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `name` | text | Nome da campanha |
| `context` | text | Contexto comercial |
| `generation_prompt` | text | Instruções para a IA |
| `trigger_stage_id` | uuid FK | Etapa gatilho (opcional) |
| `status` | campaign_status enum | `active` ou `inactive` |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

### 2.9 `generated_messages`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `lead_id` | uuid FK | Lead |
| `campaign_id` | uuid FK | Campanha |
| `content` | text | Texto da mensagem |
| `status` | message_status enum | `generated`, `sent`, `copied` |
| `generation_type` | generation_type enum | `manual` ou `trigger` |
| `sent_at` | timestamptz | Data de envio |
| `created_at` | timestamptz | Data de criação |

**Nota:** `workspace_id` não está nesta tabela; o acesso é controlado via RLS fazendo JOIN implícito com `leads`.

### 2.10 `lead_activities`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Identificador |
| `lead_id` | uuid FK | Lead |
| `workspace_id` | uuid FK | Workspace |
| `type` | activity_type enum | Tipo da atividade |
| `metadata` | jsonb | Dados extras (JSONB) |
| `created_at` | timestamptz | Data de criação |

Tipos de atividade: `lead_created`, `lead_updated`, `stage_changed`, `message_generated`, `message_sent`, `auto_generation_failed`.

---

## 3. Enums

```sql
CREATE TYPE lead_status AS ENUM ('active', 'inactive', 'converted', 'lost');
CREATE TYPE campaign_status AS ENUM ('active', 'inactive');
CREATE TYPE field_type AS ENUM ('text', 'number', 'date', 'boolean', 'select');
CREATE TYPE message_status AS ENUM ('generated', 'sent', 'copied');
CREATE TYPE generation_type AS ENUM ('manual', 'trigger');
CREATE TYPE activity_type AS ENUM (
  'lead_created', 'lead_updated', 'stage_changed',
  'message_generated', 'message_sent', 'auto_generation_failed'
);
CREATE TYPE member_role AS ENUM ('admin', 'member');
```

---

## 4. RLS

RLS está habilitado em todas as tabelas operacionais. A função helper:

```sql
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id uuid, p_user_id uuid)
RETURNS boolean
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id AND user_id = p_user_id
  );
$$;
```

Políticas padrão: usuário pode acessar/manipular dados se for membro do workspace.

---

## 5. RPCs

```sql
CREATE OR REPLACE FUNCTION create_workspace_with_defaults(
  p_name text, p_slug text, p_user_id uuid
) RETURNS uuid
```

Cria workspace, membership admin e 7 etapas padrão em uma transação.

---

## 6. Decisões importantes

1. **Campos personalizados com `value text`** — No MVP, usamos uma coluna string universal para simplificar. Em produção, poderia evoluir para colunas tipadas (`value_text`, `value_number`, etc.).
2. **`generated_messages` sem `workspace_id`** — O RLS protege via políticas que fazem subquery em `leads`.
3. **`source` em vez de `lead_source`** — Nomenclatura mais curta, suficiente para o contexto.
4. **`status` no lead** — Permite marcar lead como inativo, convertido ou perdido sem movê-lo de etapa.
5. **`slug` no workspace** — Permite URLs amigáveis no futuro.
