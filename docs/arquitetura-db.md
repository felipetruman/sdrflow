## 8. Arquitetura do banco de dados

A modelagem do banco foi desenhada para suportar o CRM SDR com isolamento por workspace, campos personalizados, Kanban, campanhas, geração de mensagens com IA e histórico de atividades.

A decisão principal é: **todas as entidades operacionais pertencem a um workspace**.

---

## 8.1 Tabelas principais

### 8.1.1 `workspaces`

Representa uma empresa, equipe ou ambiente de trabalho.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `name` | text | Nome |
| `slug` | text UNIQUE | Slug para URL |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

### 8.1.2 `workspace_members`

Vínculo entre usuários e workspaces.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `user_id` | uuid | Usuário Supabase Auth |
| `role` | member_role enum | `admin` ou `member` |
| `created_at` | timestamptz | Criação |

### 8.1.3 `funnel_stages`

Etapas do funil SDR.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `name` | text | Nome da etapa |
| `order_index` | integer | Ordem no Kanban |
| `color` | text | Cor da coluna |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

Etapas padrão: Base, Lead Mapeado, Tentando Contato, Conexão Iniciada, Desqualificado, Qualificado, Reunião Agendada.

### 8.1.4 `leads`

Leads cadastrados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `stage_id` | uuid FK | Etapa atual |
| `name` | text | Nome |
| `email` | text | Email |
| `phone` | text | Telefone |
| `company` | text | Empresa |
| `job_title` | text | Cargo |
| `source` | text | Origem |
| `notes` | text | Observações |
| `owner_id` | uuid | Responsável (opcional) |
| `status` | lead_status enum | `active`, `inactive`, `converted`, `lost` |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

### 8.1.5 `custom_fields`

Campos personalizados por workspace.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `name` | text | Nome visível |
| `key` | text | Chave interna |
| `field_type` | field_type enum | `text`, `number`, `date`, `boolean`, `select` |
| `options` | jsonb | Opções para select |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

### 8.1.6 `lead_custom_values`

Valores dos campos personalizados por lead.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `lead_id` | uuid FK | Lead |
| `custom_field_id` | uuid FK | Campo personalizado |
| `value` | text | Valor (string universal) |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

**Decisão do MVP:** usamos uma coluna `value text` universal para simplificar. Valores numéricos, booleanos e datas são serializados como string.

### 8.1.7 `stage_required_fields`

Campos obrigatórios por etapa.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `stage_id` | uuid FK | Etapa |
| `field_key` | text | Nome da coluna ou ID do custom field |
| `is_custom_field` | boolean | `true` se for custom field |
| `created_at` | timestamptz | Criação |

Exemplo: campo padrão obrigatório `field_key = 'job_title'`, `is_custom_field = false`. Campo personalizado obrigatório `field_key = '<custom_field_id>'`, `is_custom_field = true`.

### 8.1.8 `campaigns`

Campanhas de abordagem.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `workspace_id` | uuid FK | Workspace |
| `name` | text | Nome |
| `context` | text | Contexto comercial |
| `generation_prompt` | text | Instruções para IA |
| `trigger_stage_id` | uuid FK | Etapa gatilho (opcional) |
| `status` | campaign_status enum | `active` ou `inactive` |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

### 8.1.9 `generated_messages`

Mensagens geradas pela IA.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `lead_id` | uuid FK | Lead |
| `campaign_id` | uuid FK | Campanha |
| `content` | text | Texto da mensagem |
| `status` | message_status enum | `generated`, `sent`, `copied` |
| `generation_type` | generation_type enum | `manual` ou `trigger` |
| `sent_at` | timestamptz | Data de envio |
| `created_at` | timestamptz | Criação |

**Nota:** `workspace_id` não está nesta tabela; o acesso é controlado via RLS com subquery em `leads`.

### 8.1.10 `lead_activities`

Histórico de ações.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Identificador |
| `lead_id` | uuid FK | Lead |
| `workspace_id` | uuid FK | Workspace |
| `type` | activity_type enum | Tipo da atividade |
| `metadata` | jsonb | Dados extras |
| `created_at` | timestamptz | Criação |

Atividades: `lead_created`, `lead_updated`, `stage_changed`, `message_generated`, `message_sent`, `auto_generation_failed`.

---

## 8.2 Relacionamentos

- `workspaces` → `workspace_members` (1:N)
- `workspaces` → `funnel_stages` (1:N)
- `workspaces` → `leads` (1:N)
- `workspaces` → `custom_fields` (1:N)
- `workspaces` → `campaigns` (1:N)
- `funnel_stages` → `leads` (1:N)
- `leads` → `lead_custom_values` (1:N)
- `custom_fields` → `lead_custom_values` (1:N)
- `leads` → `generated_messages` (1:N)
- `campaigns` → `generated_messages` (1:N)
- `leads` → `lead_activities` (1:N)

---

## 8.3 Estratégia de RLS

Regra central: usuário só acessa dados de workspaces em que é membro.

Função helper:
```sql
is_workspace_member(p_workspace_id uuid, p_user_id uuid) returns boolean
```

Todas as tabelas operacionais têm RLS ativo e policies que usam essa função.

---

## 8.4 Decisão sobre campos obrigatórios por etapa

A validação acontece na Edge Function `move-lead-stage`. Antes de atualizar `stage_id`, a função:

1. Busca campos obrigatórios em `stage_required_fields`.
2. Verifica campos padrão no lead.
3. Verifica campos personalizados em `lead_custom_values`.
4. Se faltar algo, retorna erro com lista de campos faltantes.
5. Se estiver completo, atualiza etapa e registra atividade.

---

## 8.5 Como explicar o banco

> Modelei o banco em torno de workspaces porque o isolamento de dados era um requisito central. Cada entidade operacional carrega `workspace_id`, e o acesso é protegido por RLS. Separei campos personalizados em definição (`custom_fields`) e valores (`lead_custom_values`) para manter flexibilidade sem perder estrutura relacional. As mensagens geradas ficam persistidas para permitir histórico, regeneração e envio simulado. Também criei histórico de atividades para deixar o fluxo auditável.
