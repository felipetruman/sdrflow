# Checklist de Gravação — Vídeo SDRFlow AI

**Duração alvo: até 10 min**
**Resolução: 1920×1080**
**Browser: Chrome/Edge limpo, modo anônimo (sem extensões)**

---

## 0. Pré-gravação (5 min antes)

- [ ] Fechar Slack, e-mail, notificações do sistema (modo Não Perturbe)
- [ ] Abrir terminal limpo em `~/freedomdigitalhub/workspace/products/sdrflow`
- [ ] Subir build de produção local: `pnpm build && pnpm start` (porta 3000)
  - alternativa: usar direto `https://sdrflow.vercel.app`
- [ ] Limpar cookies do domínio (`localhost:3000` ou `sdrflow.vercel.app`)
- [ ] Abrir VSCode em janela secundária com:
  - `supabase/migrations/0001_initial_schema.sql` aberto
  - `supabase/functions/generate-messages/index.ts` aberto
  - `features/leads/actions/createLead.ts` aberto
  - `features/kanban/components/KanbanBoard.tsx` aberto
- [ ] Preparar 1 e-mail descartável real (ex: `avaliador+demo@sdrflow.com`)
- [ ] Testar microfone, ajustar volume

---

## 1. Abertura (0:00 – 0:45)

**Tela:** desktop limpo + slide ou tela inicial do navegador.

| Falar | Mostrar |
|---|---|
| "SDRFlow AI: mini CRM para times de pré-vendas com geração de mensagens por IA" | logo do projeto / landing |
| "Resolve dispersão operacional: leads em planilhas, etapas desconectadas, mensagens sem contexto" | — |
| "Stack 100% Vibe Coding / AI-assisted: Next.js + Supabase + Edge Functions" | — |
| URL ao vivo: `sdrflow.vercel.app` | endereço na barra |

**Ação:** abrir `https://sdrflow.vercel.app/`

---

## 2. Arquitetura (0:45 – 1:45)

**Tela:** alternar VSCode + browser.

| Falar | Mostrar (arquivo / botão) |
|---|---|
| "10 tabelas, RLS em todas, multi-tenancy por workspace_id" | `supabase/migrations/0001_initial_schema.sql` (linhas 25-130) |
| "Função SECURITY DEFINER `is_workspace_member` reusada em 33 políticas" | `0001_initial_schema.sql` linha 142 |
| "4 Edge Functions: generate, move, send, trigger" | `supabase/functions/` no explorer |
| "LLM compatível OpenAI + fallback local — chave nunca sai do Edge" | `supabase/functions/generate-messages/index.ts` linhas 115-140 |

---

## 3. Fluxo principal — demo ao vivo (1:45 – 6:30)

### 3.1 Cadastro (1:45 – 2:15)

**URL:** `/signup`

- [ ] Clicar em "Criar conta"
- [ ] Preencher: e-mail + senha (mín. 8 chars)
- [ ] Clicar **"Criar conta"** (botão signal)
- [ ] **Falar:** "Supabase Auth nativo, e-mail vai precisar confirmar"
- [ ] Confirmar e-mail (alt+tab no inbox)

### 3.2 Onboarding workspace (2:15 – 2:35)

**URL:** redirecionado para `/dashboard` ou tela de criação de workspace

- [ ] Se aparecer `CreateWorkspaceForm`: digitar nome do workspace ("Equipe Demo")
- [ ] Clicar **"Criar workspace"**
- [ ] **Falar:** "RPC `create_workspace_with_defaults` cria workspace + membership admin + 7 etapas padrão em uma transação"

### 3.3 Tour rápido pela interface (2:35 – 2:55)

**URL:** `/dashboard`

- [ ] Apontar sidebar: Operations (Dashboard, Kanban, Novo Lead, Campanhas) + Configure (Funil, Campos, Membros)
- [ ] **Falar:** "Editorial Noir: design system próprio, Syne + DM Sans + JetBrains Mono"
- [ ] Mostrar empty state do dashboard

### 3.4 Cadastrar lead (2:55 – 3:25)

**URL:** `/leads/new`

- [ ] Clicar **"Novo Lead"** na sidebar
- [ ] Preencher:
  - Nome: `Carolina Mendes`
  - Email: `carolina@acme.com`
  - Telefone: `(11) 98765-4321`
  - Empresa: `Acme Corp`
  - Cargo: `Diretora de Marketing`
  - Origem: `LinkedIn`
  - Etapa: `Base`
- [ ] Mostrar campos personalizados: `Segmento` + `Produto de Interesse`
- [ ] **Falar:** "Custom fields são por workspace, com tipos validados (text, number, date, boolean, select)"
- [ ] Clicar **"Criar lead"**

### 3.5 Visualizar Kanban (3:25 – 3:50)

**URL:** `/kanban`

- [ ] Clicar **"Kanban"** na sidebar
- [ ] **Falar:** "7 etapas padrão, drag-and-drop com dnd-kit, busca + filtros (etapa, responsável), 3 modos de ordenação"
- [ ] Demonstrar:
  - Buscar pelo nome "Carolina"
  - Filtrar por etapa "Base"
  - Limpar filtros

### 3.6 Criar campanha com gatilho (3:50 – 4:30)

**URL:** `/campaigns/new`

- [ ] Clicar **"Campanhas"** → **"Nova campanha"**
- [ ] Preencher:
  - Nome: `Black Friday 2026`
  - Contexto: *"SaaS B2B com desconto de 30% em planos anuais até 30/11. Foco em diretores de marketing/operações que querem otimizar funil de vendas."*
  - Prompt de geração: *"Escreva mensagem de prospecção curta (até 4 linhas), tom consultivo, em português. Use o nome e o cargo do lead. CTA: agendar 15min."*
  - Etapa gatilho: **Lead Mapeado**
  - Status: Ativa
- [ ] Clicar **"Criar campanha"**
- [ ] **Falar:** "Etapa gatilho dispara `trigger-generate-messages` em background quando o lead entra"

### 3.7 Geração manual de mensagem com IA (4:30 – 5:30)

**URL:** `/leads/<id-da-Carolina>`

- [ ] Voltar ao Kanban → clicar no card "Carolina Mendes"
- [ ] Mostrar `LeadDetailHeader` (etapa atual, dono, dados)
- [ ] No painel "Inteligência" → selecionar campanha **"Black Friday 2026"**
- [ ] Clicar **"Gerar mensagens"**
- [ ] **Falar:** "Edge Function valida auth, membership no workspace, monta prompt com contexto + lead + custom fields, chama LLM via env vars"
- [ ] Aguardar 3 mensagens aparecerem (cada `GeneratedMessageCard`)
- [ ] **Demonstrar regenerar:** clicar de novo em "Gerar mensagens"

### 3.8 Envio simulado + auto-mover etapa (5:30 – 6:00)

**Mesma página: lead detail**

- [ ] Em uma das mensagens, clicar **"Copiar"** → mostrar feedback
- [ ] Em outra mensagem, clicar **"Enviar"**
- [ ] **Falar:** "Envio simulado: marca status='sent', registra timestamp, move o lead automaticamente para 'Tentando Contato'"
- [ ] Voltar ao Kanban (sidebar) → mostrar Carolina **agora** em "Tentando Contato"

### 3.9 Regras de transição (6:00 – 6:30)

**URL:** `/settings/funnel`

- [ ] Sidebar → **Funil**
- [ ] Selecionar etapa **"Lead Mapeado"** no painel "Campos obrigatórios por etapa"
- [ ] Marcar checkboxes: **Cargo**, **Empresa**
- [ ] **Falar:** "Validação roda na Edge Function `move-lead-stage`, considera campos padrão e personalizados"
- [ ] Voltar ao Kanban
- [ ] Tentar arrastar um lead sem cargo para "Lead Mapeado"
- [ ] **Mostrar toast:** *"Campos obrigatórios faltando. Campos faltando: Empresa, Cargo."*
- [ ] **Falar:** "Bloqueio garante qualidade dos dados antes da geração de mensagens"

---

## 4. Diferenciais (6:30 – 8:45)

### 4.1 Geração automática por gatilho (6:30 – 7:00)

- [ ] Voltar ao Kanban
- [ ] Arrastar lead **com todos os campos** para "Lead Mapeado"
- [ ] Abrir o lead → mostrar mensagens **já geradas** com badge `auto`
- [ ] **Falar:** "Disparo em background, sem bloquear UX"

### 4.2 Edição de funil (7:00 – 7:20)

**URL:** `/settings/funnel`

- [ ] Clicar **"Nova etapa"** → criar etapa "Pós-Venda" com cor verde
- [ ] Editar etapa existente → mudar nome
- [ ] Tentar deletar etapa que tem leads → mostrar bloqueio
- [ ] **Falar:** "ON DELETE RESTRICT no FK do banco + validação no action"

### 4.3 Multi-workspace + membros (7:20 – 7:50)

- [ ] Header → clicar **WorkspaceSwitcher**
- [ ] **Falar:** "Um usuário pode estar em N workspaces, switch sem logout"
- [ ] Sidebar → **Membros** (`/settings/members`)
- [ ] Mostrar painel `WorkspaceMembersPanel`
- [ ] **Falar:** "Convite por e-mail, papéis admin/membro, validação de papel no action"

### 4.4 Histórico de atividades (7:50 – 8:10)

- [ ] Abrir lead detail → mostrar `ActivityTimeline`
- [ ] **Falar:** "Cada ação registra em `lead_activities`: criação, edição, mudança de etapa, mensagem gerada, mensagem enviada"

### 4.5 Métricas avançadas (8:10 – 8:45)

**URL:** `/dashboard`

- [ ] Apontar `MetricsCards`: Pipeline Total, Esta Semana, 30 Dias, Captura Semanal, Campanhas, Mensagens, Envio (taxa)
- [ ] Mostrar `LeadsByStageChart`: distribuição por etapa com %
- [ ] Mostrar `AdvancedMetrics`: Conversão entre etapas + Mensagens por campanha
- [ ] **Falar:** "Tudo escopado por workspace_id, queries paralelas com count exact"

---

## 5. Encerramento (8:45 – 10:00)

| Falar | Mostrar |
|---|---|
| "RLS em 10 tabelas, 33 políticas + 3 migrations de hardening" | VSCode aberto em `0004_security_fixes.sql` |
| "TypeScript strict, conventional commits, feature-based folders" | terminal: `git log --oneline | head -10` |
| "29 commits, 4 PRs revisados (Editorial Noir, Analytics, Security, Toast fix)" | aba GitHub `/pulls?state=closed` |
| "Repo: github.com/felipetruman/sdrflow" | URL do repo |
| "Deploy: sdrflow.vercel.app" | URL prod |
| "Obrigado!" | logo |

---

## 6. Pós-gravação

- [ ] Cortar erros e silêncios longos (CapCut/DaVinci/Descript)
- [ ] Adicionar legenda em PT-BR (importante: avaliador pode pular trechos)
- [ ] Verificar duração ≤ 10 min
- [ ] Exportar 1080p, MP4, H.264, ~15-30 Mbps
- [ ] Upload no YouTube **NÃO LISTADO** (não público, não privado — link compartilhado)
  - alternativa: Google Drive com permissão "qualquer um com o link pode visualizar"
- [ ] Adicionar link no README seção 11 ou criar seção 16
- [ ] Commit + push do README atualizado
- [ ] Verificar link funcionando em janela anônima

---

## Cheat-sheet de URLs e elementos

| Tela | URL | Elemento principal |
|---|---|---|
| Landing | `/` | Hero + CTA |
| Cadastro | `/signup` | `SignupForm` |
| Login | `/login` | `LoginForm` |
| Esqueci senha | `/forgot-password` | `ForgotPasswordForm` |
| Dashboard | `/dashboard` | `MetricsCards`, `LeadsByStageChart`, `AdvancedMetrics` |
| Kanban | `/kanban` | `KanbanBoard` (busca + filtros + drag-and-drop) |
| Novo lead | `/leads/new` | `LeadForm` |
| Detalhe lead | `/leads/[id]` | `LeadDetailHeader`, `GenerateMessagesPanel`, `MessageHistory`, `ActivityTimeline` |
| Campanhas | `/campaigns` | `CampaignList` |
| Nova campanha | `/campaigns/new` | `CampaignForm` |
| Settings — Funil | `/settings/funnel` | `FunnelStageManager`, `RequiredFieldsConfig` |
| Settings — Campos | `/settings/fields` | `CustomFieldList`, `CustomFieldForm` |
| Settings — Membros | `/settings/members` | `WorkspaceMembersPanel` |

## Diretórios para mostrar no VSCode

| Caminho | O que destacar |
|---|---|
| `app/(app)/` | Rotas autenticadas |
| `app/(auth)/` | Rotas públicas (signup/login/forgot/reset) |
| `features/` | Feature-based folders: `auth`, `leads`, `kanban`, `campaigns`, `funnel`, `custom-fields`, `workspaces`, `dashboard`, `ai-messages`, `activities` |
| `supabase/migrations/0001_initial_schema.sql` | Schema + RLS |
| `supabase/functions/` | 4 Edge Functions |
| `lib/demo/data.ts` | Modo demo paralelo |
| `lib/validations/` | Schemas Zod |
| `tests/e2e/` | Suite Playwright |

## Mensagens-chave para narrar

1. "Stack 100% Vibe Coding com Claude Code, Codex e OpenCode — Next.js manual em vez de no-code para controlar Server Actions, RLS e o design system."
2. "Multi-tenancy por workspace_id + RLS em todas as 10 tabelas — isolamento garantido pelo banco, não pelo aplicativo."
3. "Edge Function como gateway de IA — chave nunca sai do Supabase."
4. "Modo demo paralelo ao cloud — avaliador testa sem precisar de credenciais."
5. "Disparo automático de mensagens por etapa gatilho — UX não bloqueia."
