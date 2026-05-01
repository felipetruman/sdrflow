## 11. Estrutura de pastas do projeto

A estrutura precisa ser simples, explicável e fácil para os agentes trabalharem sem bagunçar o projeto.

A decisão é organizar por **domínio funcional**, não por tipo genérico de arquivo.

Isso facilita responder:

> “Onde fica a lógica de leads?”
> “Onde fica a lógica de campanhas?”
> “Onde fica a integração com Supabase?”
> “Onde ficam as Edge Functions?”

---

# 11.1 Estrutura geral

```txt
sdrflow-ai/
  app/
    (auth)/
      login/
        page.tsx
      signup/
        page.tsx
    (app)/
      layout.tsx
      dashboard/
        page.tsx
      kanban/
        page.tsx
      leads/
        [leadId]/
          page.tsx
      campaigns/
        page.tsx
      settings/
        fields/
          page.tsx
        funnel/
          page.tsx

  components/
    ui/
    layout/
    common/

  features/
    auth/
    workspaces/
    dashboard/
    leads/
    kanban/
    campaigns/
    custom-fields/
    funnel/
    ai-messages/
    activities/

  lib/
    supabase/
    utils/
    validations/

  types/
    database.ts
    app.ts

  supabase/
    migrations/
      0001_initial_schema.sql
    functions/
      generate-messages/
        index.ts
      send-message-simulated/
        index.ts
      move-lead-stage/
        index.ts
      trigger-generate-messages/
        index.ts

  docs/
    PRD.md
    ARCHITECTURE.md
    DATABASE.md
    EDGE_FUNCTIONS.md
    VIDEO_SCRIPT.md

  .env.example
  README.md
  package.json
```

---

# 11.2 Pasta `app/`

A pasta `app/` contém as rotas do Next.js.

## Decisão

Separar rotas públicas e rotas protegidas.

```txt
app/
  (auth)/
  (app)/
```

## Por quê

Fica claro que:

* `(auth)` é área pública.
* `(app)` é área autenticada.

---

# 11.3 Rotas públicas

```txt
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
```

## Responsabilidade

1. Login.
2. Cadastro.
3. Redirecionamento se já estiver autenticado.
4. Mensagens de erro simples.

## Critério de aceite

Usuário consegue criar conta, entrar e sair.

---

# 11.4 Rotas protegidas

```txt
app/(app)/dashboard/page.tsx
app/(app)/kanban/page.tsx
app/(app)/leads/[leadId]/page.tsx
app/(app)/campaigns/page.tsx
app/(app)/settings/fields/page.tsx
app/(app)/settings/funnel/page.tsx
```

## Responsabilidade

### `dashboard`

Mostra métricas do workspace.

### `kanban`

Tela principal de operação, com leads por etapa.

### `leads/[leadId]`

Detalhe do lead, edição, mensagens geradas e histórico.

### `campaigns`

CRUD de campanhas.

### `settings/fields`

Campos personalizados.

### `settings/funnel`

Configuração de campos obrigatórios por etapa.

---

# 11.5 Pasta `components/`

Componentes genéricos e reutilizáveis.

```txt
components/
  ui/
  layout/
  common/
```

## `components/ui/`

Componentes do shadcn/ui.

Exemplos:

* Button.
* Card.
* Dialog.
* Input.
* Select.
* Tabs.
* Toast.

## `components/layout/`

Componentes de estrutura.

Exemplos:

* AppSidebar.
* AppHeader.
* AppShell.
* WorkspaceSwitcher.
* UserMenu.

## `components/common/`

Componentes genéricos.

Exemplos:

* EmptyState.
* LoadingState.
* ErrorState.
* ConfirmDialog.
* PageHeader.

---

# 11.6 Pasta `features/`

Essa é a pasta mais importante.

Cada domínio tem sua própria área.

```txt
features/
  auth/
  workspaces/
  dashboard/
  leads/
  kanban/
  campaigns/
  custom-fields/
  funnel/
  ai-messages/
  activities/
```

## Por que organizar por feature

Porque o projeto é pequeno, mas tem várias áreas de negócio.

Se tudo ficar em `components/`, vira confusão.

Com `features/`, cada parte do produto fica isolada.

---

# 11.7 Feature `auth`

```txt
features/auth/
  components/
    LoginForm.tsx
    SignupForm.tsx
  actions/
    signIn.ts
    signUp.ts
    signOut.ts
```

## Responsabilidade

1. Login.
2. Cadastro.
3. Logout.
4. Controle de sessão.

---

# 11.8 Feature `workspaces`

```txt
features/workspaces/
  components/
    CreateWorkspaceForm.tsx
    WorkspaceGuard.tsx
  queries/
    getCurrentWorkspace.ts
    getUserWorkspaces.ts
  actions/
    createWorkspace.ts
```

## Responsabilidade

1. Criar workspace.
2. Buscar workspace atual.
3. Garantir que usuário autenticado tenha workspace.
4. Usar RPC `create_workspace_with_defaults`.

---

# 11.9 Feature `dashboard`

```txt
features/dashboard/
  components/
    MetricsCards.tsx
    LeadsByStageChart.tsx
  queries/
    getDashboardMetrics.ts
```

## Responsabilidade

1. Total de leads.
2. Leads por etapa.
3. Campanhas ativas.
4. Mensagens geradas.
5. Mensagens enviadas.

---

# 11.10 Feature `leads`

```txt
features/leads/
  components/
    LeadForm.tsx
    LeadDetailHeader.tsx
    LeadCustomFieldsForm.tsx
    LeadOwnerSelect.tsx
  queries/
    getLeadById.ts
    getLeads.ts
    getLeadCustomValues.ts
  actions/
    createLead.ts
    updateLead.ts
    updateLeadCustomValues.ts
```

## Responsabilidade

1. Criar lead.
2. Editar lead.
3. Visualizar lead.
4. Gerenciar campos personalizados preenchidos.
5. Atribuir responsável.

---

# 11.11 Feature `kanban`

```txt
features/kanban/
  components/
    KanbanBoard.tsx
    KanbanColumn.tsx
    LeadCard.tsx
    MoveLeadDialog.tsx
  hooks/
    useKanbanDnD.ts
  actions/
    moveLeadStage.ts
  queries/
    getKanbanData.ts
```

## Responsabilidade

1. Exibir etapas.
2. Exibir cards de leads.
3. Movimentar lead entre etapas.
4. Chamar Edge Function `move-lead-stage`.
5. Exibir erro de campos obrigatórios faltantes.

---

# 11.12 Feature `campaigns`

```txt
features/campaigns/
  components/
    CampaignForm.tsx
    CampaignList.tsx
    CampaignStatusBadge.tsx
  queries/
    getCampaigns.ts
    getActiveCampaigns.ts
  actions/
    createCampaign.ts
    updateCampaign.ts
```

## Responsabilidade

1. Criar campanha.
2. Editar campanha.
3. Ativar ou inativar campanha.
4. Vincular etapa gatilho.

---

# 11.13 Feature `custom-fields`

```txt
features/custom-fields/
  components/
    CustomFieldForm.tsx
    CustomFieldList.tsx
    DynamicCustomFieldInput.tsx
  queries/
    getCustomFields.ts
  actions/
    createCustomField.ts
    updateCustomField.ts
```

## Responsabilidade

1. Criar campos personalizados.
2. Listar campos do workspace.
3. Renderizar input dinâmico por tipo.
4. Salvar valores nos leads.

---

# 11.14 Feature `funnel`

```txt
features/funnel/
  components/
    RequiredFieldsConfig.tsx
    StageRequiredFieldsPanel.tsx
  queries/
    getFunnelStages.ts
    getStageRequiredFields.ts
  actions/
    updateStageRequiredFields.ts
```

## Responsabilidade

1. Listar etapas.
2. Configurar campos obrigatórios.
3. Misturar campos padrão e personalizados.
4. Salvar regras por etapa.

---

# 11.15 Feature `ai-messages`

```txt
features/ai-messages/
  components/
    GenerateMessagesPanel.tsx
    GeneratedMessageCard.tsx
    MessageHistory.tsx
  actions/
    generateMessages.ts
    sendSimulatedMessage.ts
    copyMessage.ts
  queries/
    getGeneratedMessages.ts
```

## Responsabilidade

1. Chamar Edge Function `generate-messages`.
2. Exibir mensagens geradas.
3. Permitir regenerar.
4. Copiar mensagem.
5. Simular envio.
6. Mostrar histórico de mensagens.

---

# 11.16 Feature `activities`

```txt
features/activities/
  components/
    ActivityTimeline.tsx
    ActivityItem.tsx
  queries/
    getLeadActivities.ts
```

## Responsabilidade

1. Mostrar histórico do lead.
2. Exibir eventos importantes.
3. Ordenar atividades por data.

---

# 11.17 Pasta `lib/`

```txt
lib/
  supabase/
  utils/
  validations/
```

## `lib/supabase/`

```txt
lib/supabase/
  client.ts
  server.ts
  middleware.ts
  types.ts
```

Responsabilidade:

1. Criar cliente Supabase para browser.
2. Criar cliente Supabase para server components/actions.
3. Middleware de autenticação.
4. Tipos gerados do banco.

---

## `lib/utils/`

```txt
lib/utils/
  cn.ts
  formatDate.ts
  slugify.ts
  errors.ts
```

Responsabilidade:

1. Funções utilitárias pequenas.
2. Formatação.
3. Conversão de nomes para keys.
4. Padronização de erros.

---

## `lib/validations/`

```txt
lib/validations/
  leadSchema.ts
  campaignSchema.ts
  customFieldSchema.ts
  workspaceSchema.ts
```

Responsabilidade:

1. Schemas Zod.
2. Validações de formulário.
3. Tipos derivados dos schemas.

---

# 11.18 Pasta `types/`

```txt
types/
  database.ts
  app.ts
```

## `database.ts`

Tipos gerados pelo Supabase.

## `app.ts`

Tipos manuais do domínio.

Exemplos:

```ts
type StandardLeadFieldKey =
  | 'name'
  | 'email'
  | 'phone'
  | 'company'
  | 'job_title'
  | 'lead_source'
  | 'notes';
```

---

# 11.19 Pasta `supabase/`

```txt
supabase/
  migrations/
  functions/
```

## `migrations/`

Guarda os arquivos SQL versionados.

```txt
0001_initial_schema.sql
0002_seed_demo_data.sql
```

## `functions/`

Guarda as Edge Functions.

```txt
generate-messages/
send-message-simulated/
move-lead-stage/
trigger-generate-messages/
```

---

# 11.20 Pasta `docs/`

```txt
docs/
  PRD.md
  ARCHITECTURE.md
  DATABASE.md
  EDGE_FUNCTIONS.md
  VIDEO_SCRIPT.md
```

## Por que criar docs separados

Isso fortalece a entrega.

Mesmo que o README seja o principal, a pasta `docs/` mostra maturidade e organização.

## Conteúdo

### `PRD.md`

Visão de produto, escopo e critérios de aceite.

### `ARCHITECTURE.md`

Arquitetura geral e decisões técnicas.

### `DATABASE.md`

Modelagem do banco, tabelas e RLS.

### `EDGE_FUNCTIONS.md`

Contratos das funções e fluxo da IA.

### `VIDEO_SCRIPT.md`

Roteiro de gravação do vídeo.

---

# 11.21 Padrões de código

## Componentes

Nome em PascalCase:

```txt
LeadForm.tsx
KanbanBoard.tsx
CampaignForm.tsx
```

## Actions

Nome com verbo:

```txt
createLead.ts
updateLead.ts
generateMessages.ts
sendSimulatedMessage.ts
```

## Queries

Nome iniciado com `get`:

```txt
getLeads.ts
getCampaigns.ts
getDashboardMetrics.ts
```

## Hooks

Nome iniciado com `use`:

```txt
useKanbanDnD.ts
```

---

# 11.22 Decisão sobre Server Actions vs Client

Para manter simplicidade:

1. Leitura simples pode usar Supabase Client.
2. Formulários podem usar actions organizadas por feature.
3. Regras críticas usam Edge Functions.

## Regras críticas

Sempre via Edge Function:

1. Gerar mensagens com IA.
2. Enviar mensagem simulada.
3. Mover lead de etapa com validação.
4. Geração automática por gatilho.

---

# 11.23 Como explicar essa estrutura

Use esta resposta:

> Organizei o projeto por domínio funcional, porque a aplicação tem áreas claras: leads, Kanban, campanhas, campos personalizados, mensagens de IA e atividades. Isso evita que a lógica fique espalhada e facilita manutenção. As regras críticas ficam em Supabase Edge Functions, enquanto o frontend fica focado na experiência do usuário. Também separei uma pasta `docs` para documentar produto, arquitetura, banco e funções, porque a prova valoriza decisões técnicas bem justificadas.

---

# 11.24 Primeiro commit ideal

```bash
git add .
git commit -m "chore: initialize Next.js project structure"
```

# 11.25 Commits seguintes sugeridos

```bash
git commit -m "docs: add project PRD and architecture notes"
git commit -m "db: add initial Supabase schema and RLS policies"
git commit -m "feat: add authentication flow"
git commit -m "feat: add workspace onboarding"
git commit -m "feat: add leads CRUD"
git commit -m "feat: add Kanban board"
git commit -m "feat: add campaigns management"
git commit -m "feat: add AI message generation edge function"
git commit -m "feat: add simulated message sending flow"
git commit -m "feat: add required fields validation by stage"
git commit -m "feat: add activity timeline"
git commit -m "docs: complete README and video script"
```

Próxima seção: **TASKS.md com execução em ordem para Claude Code, Codex e OpenCode**.
