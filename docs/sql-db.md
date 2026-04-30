## 9. SQL inicial do banco

Abaixo está a primeira versão do schema para o Supabase. A ideia é usar esse arquivo como base da migration:

`supabase/migrations/0001_initial_schema.sql`

Ele cobre:

1. Workspaces.
2. Membros.
3. Funil.
4. Leads.
5. Campos personalizados.
6. Regras de campos obrigatórios.
7. Campanhas.
8. Mensagens geradas.
9. Histórico de atividades.
10. RLS base.

---

# 9.1 Extensões e tipos

```sql
create extension if not exists "pgcrypto";

create type workspace_role as enum ('admin', 'member');

create type custom_field_type as enum (
  'text',
  'number',
  'date',
  'boolean',
  'select'
);

create type campaign_status as enum (
  'active',
  'inactive'
);

create type generation_type as enum (
  'manual',
  'trigger'
);

create type generated_message_status as enum (
  'generated',
  'copied',
  'sent',
  'failed'
);

create type required_field_type as enum (
  'standard',
  'custom'
);
```

## Justificativa

Enums deixam o banco mais previsível e evitam strings soltas espalhadas pelo sistema.

Isso ajuda principalmente em:

1. Status de campanha.
2. Status de mensagem.
3. Tipo de campo personalizado.
4. Papel do usuário no workspace.

---

# 9.2 Tabela `workspaces`

```sql
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Por que essa tabela existe

Ela é a raiz do multi-tenancy.

Tudo que pertence a uma empresa ou equipe será ligado a um `workspace_id`.

---

# 9.3 Tabela `workspace_members`

```sql
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role workspace_role not null default 'member',
  created_at timestamptz not null default now(),

  unique (workspace_id, user_id)
);
```

## Por que essa tabela existe

Mesmo que no MVP cada usuário use apenas um workspace, essa tabela deixa o sistema preparado para equipe.

Também é a base das policies de RLS.

---

# 9.4 Tabela `funnel_stages`

```sql
create table public.funnel_stages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  position integer not null,
  color text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (workspace_id, name),
  unique (workspace_id, position)
);
```

## Decisão

As etapas ficam no banco, não no frontend.

Isso permite configurar regras por etapa e usar etapa gatilho nas campanhas.

---

# 9.5 Tabela `leads`

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  stage_id uuid not null references public.funnel_stages(id) on delete restrict,
  owner_id uuid references auth.users(id) on delete set null,

  name text not null,
  email text,
  phone text,
  company text,
  job_title text,
  lead_source text,
  notes text,

  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Decisão

`owner_id` é opcional porque o requisito permite lead sem responsável.

`stage_id` controla a posição do lead no Kanban.

---

# 9.6 Tabela `custom_fields`

```sql
create table public.custom_fields (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  name text not null,
  key text not null,
  field_type custom_field_type not null,
  options jsonb,

  required_by_default boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (workspace_id, key)
);
```

## Decisão

O campo `key` será usado internamente para identificar o campo de forma estável.

Exemplo:

* Nome visível: `Faturamento Anual`
* Key: `faturamento_anual`

---

# 9.7 Tabela `lead_custom_values`

```sql
create table public.lead_custom_values (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  custom_field_id uuid not null references public.custom_fields(id) on delete cascade,

  value_text text,
  value_number numeric,
  value_boolean boolean,
  value_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (lead_id, custom_field_id)
);
```

## Decisão

Valores ficam separados por tipo, em vez de jogar tudo em JSON.

Isso facilita validação, leitura e explicação técnica.

---

# 9.8 Tabela `stage_required_fields`

```sql
create table public.stage_required_fields (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  stage_id uuid not null references public.funnel_stages(id) on delete cascade,

  field_type required_field_type not null,
  standard_field_key text,
  custom_field_id uuid references public.custom_fields(id) on delete cascade,

  created_at timestamptz not null default now(),

  constraint required_field_reference_check check (
    (
      field_type = 'standard'
      and standard_field_key is not null
      and custom_field_id is null
    )
    or
    (
      field_type = 'custom'
      and custom_field_id is not null
      and standard_field_key is null
    )
  )
);
```

## Decisão

Essa tabela permite exigir tanto campos padrão quanto personalizados.

Exemplos:

Campo padrão obrigatório:

```text
field_type = standard
standard_field_key = job_title
```

Campo personalizado obrigatório:

```text
field_type = custom
custom_field_id = id do campo Segmento
```

---

# 9.9 Tabela `campaigns`

```sql
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  name text not null,
  context text not null,
  generation_prompt text not null,

  status campaign_status not null default 'active',
  trigger_stage_id uuid references public.funnel_stages(id) on delete set null,

  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Decisão

A campanha separa:

1. `context`: informações comerciais.
2. `generation_prompt`: instruções para IA.

Isso deixa claro o que é conteúdo de negócio e o que é direção de escrita.

---

# 9.10 Tabela `generated_messages`

```sql
create table public.generated_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,

  content text not null,
  variation_index integer not null,

  generation_type generation_type not null default 'manual',
  status generated_message_status not null default 'generated',

  llm_provider text,
  llm_model text,

  created_by uuid references auth.users(id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
```

## Decisão

Cada variação da IA vira uma linha.

Isso permite:

1. Histórico.
2. Regeneração sem apagar mensagens antigas.
3. Marcar qual mensagem foi enviada.
4. Dashboard por campanha.

---

# 9.11 Tabela `lead_activities`

```sql
create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,

  user_id uuid references auth.users(id) on delete set null,

  activity_type text not null,
  description text not null,
  metadata jsonb,

  created_at timestamptz not null default now()
);
```

## Decisão

O histórico deixa o projeto mais defensável.

Ele prova que o sistema não apenas altera dados, mas registra o fluxo comercial.

---

# 9.12 Índices importantes

```sql
create index idx_workspace_members_user_id
on public.workspace_members(user_id);

create index idx_workspace_members_workspace_id
on public.workspace_members(workspace_id);

create index idx_funnel_stages_workspace_id
on public.funnel_stages(workspace_id);

create index idx_leads_workspace_id
on public.leads(workspace_id);

create index idx_leads_stage_id
on public.leads(stage_id);

create index idx_leads_owner_id
on public.leads(owner_id);

create index idx_custom_fields_workspace_id
on public.custom_fields(workspace_id);

create index idx_lead_custom_values_lead_id
on public.lead_custom_values(lead_id);

create index idx_campaigns_workspace_id
on public.campaigns(workspace_id);

create index idx_campaigns_trigger_stage_id
on public.campaigns(trigger_stage_id);

create index idx_generated_messages_lead_id
on public.generated_messages(lead_id);

create index idx_generated_messages_campaign_id
on public.generated_messages(campaign_id);

create index idx_lead_activities_lead_id
on public.lead_activities(lead_id);
```

---

# 9.13 Função helper para RLS

```sql
create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;
```

## Por que usar helper

Evita repetir lógica grande em todas as policies.

Também deixa mais fácil explicar:

> Todas as tabelas validam se o usuário autenticado é membro do workspace daquela linha.

---

# 9.14 Ativar RLS

```sql
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.funnel_stages enable row level security;
alter table public.leads enable row level security;
alter table public.custom_fields enable row level security;
alter table public.lead_custom_values enable row level security;
alter table public.stage_required_fields enable row level security;
alter table public.campaigns enable row level security;
alter table public.generated_messages enable row level security;
alter table public.lead_activities enable row level security;
```

---

# 9.15 Policies de `workspaces`

```sql
create policy "Users can view their workspaces"
on public.workspaces
for select
using (
  public.is_workspace_member(id)
);

create policy "Users can create workspaces"
on public.workspaces
for insert
with check (
  created_by = auth.uid()
);

create policy "Workspace members can update workspace"
on public.workspaces
for update
using (
  public.is_workspace_member(id)
)
with check (
  public.is_workspace_member(id)
);
```

## Observação importante

A criação do workspace precisa criar também o registro em `workspace_members`.

Isso pode ser feito pela aplicação ou por uma função RPC.

Para o MVP, eu prefiro uma função RPC para evitar inconsistência.

---

# 9.16 Policies de `workspace_members`

```sql
create policy "Members can view workspace members"
on public.workspace_members
for select
using (
  public.is_workspace_member(workspace_id)
);

create policy "Users can create their own initial membership"
on public.workspace_members
for insert
with check (
  user_id = auth.uid()
);

create policy "Members can update workspace members"
on public.workspace_members
for update
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);
```

## Decisão de MVP

Ainda não vamos criar convite avançado.

Mas a tabela já suporta múltiplos membros e roles.

---

# 9.17 Policies das tabelas por workspace

As próximas policies seguem o mesmo padrão: o usuário pode acessar a linha se for membro do workspace.

```sql
create policy "Members can manage funnel stages"
on public.funnel_stages
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can manage leads"
on public.leads
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can manage custom fields"
on public.custom_fields
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can manage lead custom values"
on public.lead_custom_values
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can manage stage required fields"
on public.stage_required_fields
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can manage campaigns"
on public.campaigns
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can manage generated messages"
on public.generated_messages
for all
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

create policy "Members can view lead activities"
on public.lead_activities
for select
using (
  public.is_workspace_member(workspace_id)
);

create policy "Members can create lead activities"
on public.lead_activities
for insert
with check (
  public.is_workspace_member(workspace_id)
);
```

---

# 9.18 Função para criar workspace inicial

```sql
create or replace function public.create_workspace_with_defaults(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
begin
  insert into public.workspaces (name, created_by)
  values (workspace_name, auth.uid())
  returning id into new_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, auth.uid(), 'admin');

  insert into public.funnel_stages (workspace_id, name, position, color, is_default)
  values
    (new_workspace_id, 'Base', 1, '#64748b', true),
    (new_workspace_id, 'Lead Mapeado', 2, '#2563eb', true),
    (new_workspace_id, 'Tentando Contato', 3, '#f59e0b', true),
    (new_workspace_id, 'Conexão Iniciada', 4, '#8b5cf6', true),
    (new_workspace_id, 'Desqualificado', 5, '#ef4444', true),
    (new_workspace_id, 'Qualificado', 6, '#22c55e', true),
    (new_workspace_id, 'Reunião Agendada', 7, '#14b8a6', true);

  return new_workspace_id;
end;
$$;
```

## Por que criar essa função

Ela garante que o workspace nasça completo:

1. Workspace criado.
2. Usuário como admin.
3. Etapas padrão criadas.

Sem isso, o frontend precisaria fazer várias operações em sequência, aumentando risco de erro.

---

# 9.19 Função para atualizar `updated_at`

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

create trigger set_funnel_stages_updated_at
before update on public.funnel_stages
for each row execute function public.set_updated_at();

create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger set_custom_fields_updated_at
before update on public.custom_fields
for each row execute function public.set_updated_at();

create trigger set_campaigns_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create trigger set_lead_custom_values_updated_at
before update on public.lead_custom_values
for each row execute function public.set_updated_at();
```

---

# 9.20 Ponto crítico para explicar

Esse schema foi desenhado para parecer simples, mas com maturidade suficiente.

A defesa é:

> Eu preferi uma estrutura relacional clara, com `workspace_id` em todas as entidades operacionais, porque isso simplifica o isolamento por workspace e facilita aplicar RLS. Campos personalizados foram separados em definição e valores para evitar alterar schema dinamicamente. Mensagens geradas ficam persistidas para permitir histórico, regeneração e envio simulado. A função de criação de workspace evita inconsistência no onboarding e já cria o funil padrão exigido pela prova.

Próxima seção: **Edge Functions e contratos de API**.
