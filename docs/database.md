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

Isso facilita:

1. Isolamento de dados.
2. RLS consistente.
3. Queries simples.
4. Evolução futura para times e multi-workspace.

---

## 2. Decisão principal

### Multi-tenancy por workspace

Cada workspace representa uma empresa ou equipe.

Um usuário acessa dados apenas dos workspaces em que ele é membro.

Todas as entidades relevantes pertencem a um workspace:

1. `funnel_stages`.
2. `leads`.
3. `custom_fields`.
4. `lead_custom_values`.
5. `stage_required_fields`.
6. `campaigns`.
7. `generated_messages`.
8. `lead_activities`.

### Por que essa decisão

Um CRM pode conter dados comerciais sensíveis. A separação por workspace evita vazamento entre equipes e permite aplicar RLS diretamente no banco.

---

## 3. Tabelas

## 3.1 `workspaces`

Representa uma empresa, equipe ou ambiente de trabalho.

Campos principais:

1. `id`.
2. `name`.
3. `created_by`.
4. `created_at`.
5. `updated_at`.

### Justificativa

É a entidade raiz do sistema. Todas as operações comerciais acontecem dentro de um workspace.

---

## 3.2 `workspace_members`

Representa o vínculo entre usuários e workspaces.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `user_id`.
4. `role`.
5. `created_at`.

Roles:

1. `admin`.
2. `member`.

### Justificativa

Permite que o sistema valide quem pode acessar cada workspace.

Mesmo que o MVP use um workspace por usuário, essa estrutura permite evolução futura para múltiplos membros.

---

## 3.3 `funnel_stages`

Representa as etapas do funil SDR exibidas no Kanban.

Etapas padrão:

1. Base.
2. Lead Mapeado.
3. Tentando Contato.
4. Conexão Iniciada.
5. Desqualificado.
6. Qualificado.
7. Reunião Agendada.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `name`.
4. `position`.
5. `color`.
6. `is_default`.
7. `created_at`.
8. `updated_at`.

### Justificativa

As etapas ficam no banco, não hardcoded no frontend.

Isso permite:

1. Ordenação.
2. Regras de campos obrigatórios por etapa.
3. Campanhas com etapa gatilho.
4. Evolução futura para edição de funil.

---

## 3.4 `leads`

Representa os leads cadastrados no CRM.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `stage_id`.
4. `owner_id`.
5. `name`.
6. `email`.
7. `phone`.
8. `company`.
9. `job_title`.
10. `lead_source`.
11. `notes`.
12. `created_by`.
13. `created_at`.
14. `updated_at`.

### Justificativa

É a entidade central do CRM.

O campo `stage_id` define em qual coluna do Kanban o lead aparece.

O campo `owner_id` é opcional porque um lead pode ou não ter responsável atribuído.

---

## 3.5 `custom_fields`

Define os campos personalizados disponíveis para todos os leads de um workspace.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `name`.
4. `key`.
5. `field_type`.
6. `options`.
7. `required_by_default`.
8. `created_at`.
9. `updated_at`.

Tipos suportados:

1. `text`.
2. `number`.
3. `date`.
4. `boolean`.
5. `select`.

### Justificativa

Campos personalizados ficam em tabela própria para evitar alterações dinâmicas no schema do banco.

---

## 3.6 `lead_custom_values`

Armazena os valores dos campos personalizados para cada lead.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `lead_id`.
4. `custom_field_id`.
5. `value_text`.
6. `value_number`.
7. `value_boolean`.
8. `value_date`.
9. `created_at`.
10. `updated_at`.

### Justificativa

A definição do campo fica separada do valor preenchido em cada lead.

Essa modelagem permite flexibilidade sem transformar tudo em JSON solto.

---

## 3.7 `stage_required_fields`

Define quais campos são obrigatórios para que um lead entre em uma etapa.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `stage_id`.
4. `field_type`.
5. `standard_field_key`.
6. `custom_field_id`.
7. `created_at`.

Tipos:

1. `standard`.
2. `custom`.

### Justificativa

Permite configurar campos obrigatórios tanto para campos padrão quanto para campos personalizados.

Exemplo:

1. Campo padrão obrigatório: `job_title`.
2. Campo personalizado obrigatório: `Segmento`.

---

## 3.8 `campaigns`

Armazena campanhas de abordagem.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `name`.
4. `context`.
5. `generation_prompt`.
6. `status`.
7. `trigger_stage_id`.
8. `created_by`.
9. `created_at`.
10. `updated_at`.

### Justificativa

A campanha separa:

1. `context`: informações comerciais da oferta.
2. `generation_prompt`: instruções para a IA.

Isso deixa claro o que é contexto de negócio e o que é direção de escrita.

---

## 3.9 `generated_messages`

Armazena mensagens geradas pela IA.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `lead_id`.
4. `campaign_id`.
5. `content`.
6. `variation_index`.
7. `generation_type`.
8. `status`.
9. `llm_provider`.
10. `llm_model`.
11. `created_by`.
12. `sent_at`.
13. `created_at`.

Tipos de geração:

1. `manual`.
2. `trigger`.

Status:

1. `generated`.
2. `copied`.
3. `sent`.
4. `failed`.

### Justificativa

Cada variação gerada vira uma linha. Isso facilita histórico, regeneração, envio simulado e métricas.

---

## 3.10 `lead_activities`

Registra histórico de ações no lead.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `lead_id`.
4. `user_id`.
5. `activity_type`.
6. `description`.
7. `metadata`.
8. `created_at`.

Atividades previstas:

1. `lead_created`.
2. `lead_updated`.
3. `stage_changed`.
4. `owner_changed`.
5. `message_generated`.
6. `message_copied`.
7. `message_sent`.
8. `auto_generation_failed`.

### Justificativa

A tabela dá rastreabilidade ao fluxo comercial e melhora a defesa técnica do projeto.

---

## 4. Decisões importantes

## 4.1 Por que não guardar tudo em JSONB

Poderíamos guardar dados customizados em JSONB, mas isso criaria problemas:

1. Validação mais fraca.
2. Filtros mais difíceis.
3. Configuração de campos obrigatórios mais confusa.
4. RLS e relacionamentos menos claros.
5. Explicação técnica pior.

O projeto usa JSONB apenas onde faz sentido:

1. `custom_fields.options`.
2. `lead_activities.metadata`.

## 4.2 Por que usar tabelas relacionais para campos personalizados

A tabela `custom_fields` define os campos.

A tabela `lead_custom_values` guarda os valores por lead.

Isso permite criar campos personalizados sem alterar o schema e sem perder estrutura.

## 4.3 Por que salvar mensagens geradas

Mensagens geradas precisam ser persistidas para:

1. Histórico.
2. Regeneração.
3. Envio simulado.
4. Métricas por campanha.
5. Geração automática por etapa gatilho.

## 4.4 Por que criar RPC para workspace inicial

A função `create_workspace_with_defaults` cria:

1. Workspace.
2. Membership admin.
3. Etapas padrão.

Isso evita que o frontend precise executar várias operações encadeadas e reduz risco de workspace incompleto.

---

## 5. RLS

## 5.1 Regra central

Um usuário só pode acessar dados de workspaces em que ele é membro.

Conceito:

```sql
exists (
  select 1
  from public.workspace_members wm
  where wm.workspace_id = table.workspace_id
    and wm.user_id = auth.uid()
)
```

## 5.2 Helper usado nas policies

```sql
public.is_workspace_member(target_workspace_id uuid)
```

Essa função evita repetir a mesma lógica em todas as policies.

## 5.3 Tabelas protegidas por RLS

1. `workspaces`.
2. `workspace_members`.
3. `funnel_stages`.
4. `leads`.
5. `custom_fields`.
6. `lead_custom_values`.
7. `stage_required_fields`.
8. `campaigns`.
9. `generated_messages`.
10. `lead_activities`.

---

## 6. Migration inicial

Arquivo sugerido:

```text
supabase/migrations/0001_initial_schema.sql
```

```sql
create extension if not exists "pgcrypto";

create type public.workspace_role as enum ('admin', 'member');

create type public.custom_field_type as enum (
  'text',
  'number',
  'date',
  'boolean',
  'select'
);

create type public.campaign_status as enum (
  'active',
  'inactive'
);

create type public.generation_type as enum (
  'manual',
  'trigger'
);

create type public.generated_message_status as enum (
  'generated',
  'copied',
  'sent',
  'failed'
);

create type public.required_field_type as enum (
  'standard',
  'custom'
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default now(),

  unique (workspace_id, user_id)
);

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

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.custom_fields (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  name text not null,
  key text not null,
  field_type public.custom_field_type not null,
  options jsonb,
  required_by_default boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (workspace_id, key)
);

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

create table public.stage_required_fields (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  stage_id uuid not null references public.funnel_stages(id) on delete cascade,

  field_type public.required_field_type not null,
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
  ),

  unique (stage_id, standard_field_key),
  unique (stage_id, custom_field_id)
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  name text not null,
  context text not null,
  generation_prompt text not null,

  status public.campaign_status not null default 'active',
  trigger_stage_id uuid references public.funnel_stages(id) on delete set null,

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.generated_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,

  content text not null,
  variation_index integer not null,

  generation_type public.generation_type not null default 'manual',
  status public.generated_message_status not null default 'generated',

  llm_provider text,
  llm_model text,

  created_by uuid references auth.users(id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

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

create index idx_lead_custom_values_workspace_id
on public.lead_custom_values(workspace_id);

create index idx_lead_custom_values_lead_id
on public.lead_custom_values(lead_id);

create index idx_stage_required_fields_workspace_id
on public.stage_required_fields(workspace_id);

create index idx_campaigns_workspace_id
on public.campaigns(workspace_id);

create index idx_campaigns_trigger_stage_id
on public.campaigns(trigger_stage_id);

create index idx_generated_messages_workspace_id
on public.generated_messages(workspace_id);

create index idx_generated_messages_lead_id
on public.generated_messages(lead_id);

create index idx_generated_messages_campaign_id
on public.generated_messages(campaign_id);

create index idx_lead_activities_workspace_id
on public.lead_activities(workspace_id);

create index idx_lead_activities_lead_id
on public.lead_activities(lead_id);

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

create trigger set_lead_custom_values_updated_at
before update on public.lead_custom_values
for each row execute function public.set_updated_at();

create trigger set_campaigns_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

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

create policy "Users can create workspaces"
on public.workspaces
for insert
to authenticated
with check (created_by = auth.uid());

create policy "Members can view workspaces"
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

create policy "Members can update workspaces"
on public.workspaces
for update
to authenticated
using (public.is_workspace_member(id))
with check (public.is_workspace_member(id));

create policy "Members can view workspace members"
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Users can create own membership"
on public.workspace_members
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Members can update workspace members"
on public.workspace_members
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage funnel stages"
on public.funnel_stages
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage leads"
on public.leads
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage custom fields"
on public.custom_fields
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage lead custom values"
on public.lead_custom_values
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage stage required fields"
on public.stage_required_fields
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage campaigns"
on public.campaigns
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can manage generated messages"
on public.generated_messages
for all
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can view lead activities"
on public.lead_activities
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can create lead activities"
on public.lead_activities
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create or replace function public.create_workspace_with_defaults(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

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

---

## 7. Pontos de atenção

## 7.1 Policy de criação de workspace

Durante a criação do workspace, o usuário ainda não é membro dele.

Por isso, a função `create_workspace_with_defaults` roda como `security definer` e cria o workspace, o membership e as etapas padrão na mesma transação.

## 7.2 Service Role

A chave `SUPABASE_SERVICE_ROLE_KEY` nunca deve estar no frontend.

Ela só pode ser usada em Supabase Edge Functions ou ambiente server-side controlado.

## 7.3 `created_by` e deleção de usuário

Em algumas tabelas, `created_by` usa `on delete set null`, porque o histórico do CRM pode continuar existindo mesmo se um usuário for removido.

Em `workspaces`, `created_by` usa cascade no MVP para simplificar.

Se o projeto evoluir para times reais, pode ser melhor trocar para `set null` e controlar ownership por `workspace_members`.

---

## 8. Como defender essa modelagem

Resposta curta:

> Modelei o banco em torno de workspaces porque isolamento de dados era um requisito central. Cada entidade operacional carrega `workspace_id`, e o acesso é protegido por RLS. Separei campos personalizados em definição e valores para manter flexibilidade sem perder estrutura relacional. As mensagens geradas ficam persistidas para permitir histórico, regeneração, envio simulado e métricas. Também criei histórico de atividades para deixar o fluxo auditável.

---

## 9. Checklist de validação do banco

* [ ] Migration roda sem erro.
* [ ] Todas as tabelas foram criadas.
* [ ] Todos os enums foram criados.
* [ ] RLS está ativo nas tabelas sensíveis.
* [ ] Policies foram criadas.
* [ ] RPC `create_workspace_with_defaults` funciona.
* [ ] Usuário consegue criar workspace.
* [ ] Etapas padrão são criadas automaticamente.
* [ ] Usuário A não acessa dados do usuário B.
* [ ] Leads respeitam `workspace_id`.
* [ ] Campanhas respeitam `workspace_id`.
* [ ] Mensagens geradas respeitam `workspace_id`.
* [ ] Campos personalizados funcionam por workspace.
* [ ] Campos obrigatórios podem ser configurados por etapa.
