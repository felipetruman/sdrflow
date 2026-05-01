## 12. `TASKS.md` com plano de execução

Este arquivo vai guiar o desenvolvimento e evitar que os agentes façam coisas fora do escopo.

A função do `TASKS.md` é transformar o PRD em uma sequência objetiva de implementação.

---

# 12.1 Objetivo do `TASKS.md`

O projeto deve ser construído em blocos, sempre priorizando o fluxo obrigatório da prova:

```text
Cadastro -> Workspace -> Lead -> Kanban -> Campanha -> IA -> Envio simulado -> Dashboard
```

Esse fluxo cobre o núcleo obrigatório: CRM SDR, workspaces, leads, Kanban, campanhas, geração de mensagens com IA e Supabase bem feito. 

---

# 12.2 Regra de execução

Nenhuma feature avançada deve ser iniciada antes do fluxo principal funcionar.

## Ordem de prioridade

1. Banco e Supabase.
2. Auth.
3. Workspace.
4. Leads.
5. Kanban.
6. Campanhas.
7. IA.
8. Envio simulado.
9. Dashboard.
10. Diferenciais.
11. Documentação final.
12. Deploy.

---

# 12.3 Agentes usados

## OpenCode

Agente principal de execução.

Responsável por:

1. Criar estrutura.
2. Implementar features.
3. Fazer commits.
4. Manter ritmo.

## Claude Code

Responsável por:

1. Implementações mais longas.
2. UI.
3. Fluxos do frontend.
4. Ajustes de experiência.

## Codex

Responsável por:

1. Revisar código.
2. Encontrar bugs.
3. Melhorar tipagem.
4. Revisar segurança.
5. Revisar Supabase/RLS.
6. Validar se o projeto atende ao enunciado.

---

# 12.4 `TASKS.md` sugerido

````md
# TASKS | SDRFlow AI

## Regra principal

Construir primeiro o fluxo obrigatório da prova:

Cadastro -> Workspace -> Lead -> Kanban -> Campanha -> Geração IA -> Envio simulado -> Dashboard

Não iniciar diferenciais antes do fluxo principal estar funcional.

---

## Fase 0 | Setup do projeto

### Objetivo

Criar a base técnica do projeto.

### Tasks

- [ ] Criar repositório GitHub `sdrflow-ai`
- [ ] Criar projeto Next.js com TypeScript
- [ ] Instalar Tailwind CSS
- [ ] Instalar shadcn/ui
- [ ] Instalar Supabase client
- [ ] Instalar React Hook Form
- [ ] Instalar Zod
- [ ] Instalar dnd-kit
- [ ] Criar estrutura de pastas por feature
- [ ] Criar `.env.example`
- [ ] Criar pasta `docs`
- [ ] Adicionar PRD inicial
- [ ] Adicionar README inicial

### Critério de aceite

Projeto roda localmente com `npm run dev`.

### Commit sugerido

```bash
git commit -m "chore: initialize project setup"
````

---

## Fase 1 | Supabase e banco

### Objetivo

Criar schema inicial do banco, RLS e funções básicas.

### Tasks

* [x] Criar projeto no Supabase
* [x] Criar migration `0001_initial_schema.sql`
* [x] Criar tipos/enums
* [x] Criar tabela `workspaces`
* [x] Criar tabela `workspace_members`
* [x] Criar tabela `funnel_stages`
* [x] Criar tabela `leads`
* [x] Criar tabela `custom_fields`
* [x] Criar tabela `lead_custom_values`
* [x] Criar tabela `stage_required_fields`
* [x] Criar tabela `campaigns`
* [x] Criar tabela `generated_messages`
* [x] Criar tabela `lead_activities`
* [x] Criar índices principais
* [x] Criar função `is_workspace_member`
* [x] Ativar RLS em todas as tabelas sensíveis
* [x] Criar policies básicas por workspace
* [x] Criar RPC `create_workspace_with_defaults`
* [x] Criar triggers de `updated_at`

### Critério de aceite

Banco aplica migration sem erro e as tabelas aparecem no Supabase.

### Commit sugerido

```bash
git commit -m "db: add initial Supabase schema and RLS policies"
```

---

## Fase 2 | Autenticação

### Objetivo

Permitir cadastro, login, logout e proteção de rotas.

### Tasks

* [x] Configurar Supabase client
* [x] Criar tela de login
* [x] Criar tela de cadastro
* [x] Criar logout
* [x] Criar middleware de sessão
* [x] Proteger rotas internas
* [x] Redirecionar usuário não autenticado para login
* [x] Redirecionar usuário autenticado para dashboard
* [x] Exibir erros de login/cadastro

### Critério de aceite

Usuário consegue criar conta, fazer login, acessar área interna e sair.

### Commit sugerido

```bash
git commit -m "feat: add authentication flow"
```

---

## Fase 3 | Workspace onboarding

### Objetivo

Criar workspace inicial e funil padrão.

### Tasks

* [x] Criar tela de criação de workspace
* [x] Chamar RPC `create_workspace_with_defaults`
* [x] Criar usuário como admin do workspace
* [x] Criar etapas padrão automaticamente
* [x] Criar `WorkspaceGuard`
* [x] Buscar workspace atual do usuário
* [x] Redirecionar para dashboard após criação
* [x] Exibir nome do workspace no layout

### Critério de aceite

Após cadastro, usuário cria workspace e vê o painel interno com funil padrão criado.

### Commit sugerido

```bash
git commit -m "feat: add workspace onboarding"
```

---

## Fase 4 | Layout interno

### Objetivo

Criar a base visual da aplicação.

### Tasks

* [x] Criar `AppLayout`
* [x] Criar sidebar
* [x] Criar header
* [x] Criar menu do usuário
* [x] Criar navegação para Dashboard, Kanban, Campanhas e Configurações
* [x] Criar componentes de loading
* [x] Criar componentes de empty state
* [x] Criar componentes de erro

### Critério de aceite

Usuário autenticado navega entre páginas internas com layout consistente.

### Commit sugerido

```bash
git commit -m "feat: add authenticated app layout"
```

---

## Fase 5 | Leads CRUD

### Objetivo

Criar, listar, editar e visualizar leads.

### Tasks

* [x] Criar schema Zod de lead
* [x] Criar formulário de lead
* [x] Criar ação `createLead`
* [x] Criar ação `updateLead`
* [x] Criar query `getLeads`
* [x] Criar query `getLeadById`
* [x] Criar página de detalhe do lead
* [x] Permitir editar campos padrão
* [x] Permitir selecionar etapa inicial
* [x] Permitir responsável opcional
* [x] Registrar atividade `lead_created`
* [x] Registrar atividade `lead_updated`

### Critério de aceite

Usuário consegue criar lead, editar lead e abrir detalhes.

### Commit sugerido

```bash
git commit -m "feat: add leads CRUD"
```

---

## Fase 6 | Kanban

### Objetivo

Visualizar leads por etapa e mover entre colunas.

### Tasks

* [x] Criar query `getKanbanData`
* [x] Criar `KanbanBoard`
* [x] Criar `KanbanColumn`
* [x] Criar `LeadCard`
* [x] Renderizar etapas em ordem
* [x] Renderizar leads dentro da etapa correta
* [x] Implementar drag and drop com dnd-kit
* [x] Criar Edge Function `move-lead-stage`
* [x] Chamar função ao mover lead
* [x] Atualizar UI após movimentação
* [x] Registrar atividade `stage_changed`

### Critério de aceite

Usuário consegue mover lead entre etapas e a mudança persiste no banco.

### Commit sugerido

```bash
git commit -m "feat: add Kanban board and lead stage movement"
```

---

## Fase 7 | Campos personalizados

### Objetivo

Permitir criar campos adicionais por workspace e preencher no lead.

### Tasks

* [x] Criar schema Zod de campo personalizado
* [x] Criar tela de campos personalizados
* [x] Criar formulário de campo personalizado
* [x] Suportar tipos `text`, `number`, `date`, `boolean`, `select`
* [x] Criar campo com `name`, `key`, `field_type`, `options`
* [x] Listar campos do workspace
* [x] Renderizar campos personalizados no formulário do lead
* [x] Salvar valores em `lead_custom_values`
* [x] Exibir valores personalizados no detalhe do lead
* [x] Incluir campos personalizados no payload da IA

### Critério de aceite

Usuário cria campos personalizados e preenche valores diferentes por lead.

### Commit sugerido

```bash
git commit -m "feat: add custom fields for leads"
```

---

## Fase 8 | Regras de campos obrigatórios por etapa

### Objetivo

Bloquear movimentação de leads quando faltarem dados exigidos.

### Tasks

* [x] Criar tela de configuração do funil
* [x] Listar etapas do workspace
* [x] Listar campos padrão
* [x] Listar campos personalizados
* [x] Permitir marcar campos obrigatórios por etapa
* [x] Salvar em `stage_required_fields`
* [x] Atualizar Edge Function `move-lead-stage`
* [x] Validar campos padrão
* [x] Validar campos personalizados
* [x] Retornar lista de campos faltantes
* [x] Bloquear movimentação quando faltar campo
* [x] Exibir erro amigável no Kanban

### Critério de aceite

Se o usuário tentar mover lead para etapa com campos obrigatórios vazios, o sistema bloqueia e informa os campos faltantes.

### Commit sugerido

```bash
git commit -m "feat: add required fields validation by funnel stage"
```

---

## Fase 9 | Campanhas

### Objetivo

Criar campanhas com contexto e prompt de geração.

### Tasks

* [x] Criar schema Zod de campanha
* [x] Criar página de campanhas
* [x] Criar formulário de campanha
* [x] Criar lista de campanhas
* [x] Criar status ativo/inativo
* [x] Criar campo `context`
* [x] Criar campo `generation_prompt`
* [x] Permitir selecionar etapa gatilho opcional
* [x] Criar campanha no workspace correto
* [x] Editar campanha
* [x] Listar campanhas ativas no detalhe do lead

### Critério de aceite

Usuário cria campanha ativa com contexto e prompt, e ela aparece para geração dentro do lead.

### Commit sugerido

```bash
git commit -m "feat: add campaign management"
```

---

## Fase 10 | Geração de mensagens com IA

### Objetivo

Gerar 3 mensagens personalizadas usando LLM.

### Tasks

* [x] Criar Supabase Edge Function `generate-messages`
* [x] Validar usuário autenticado
* [x] Validar acesso ao workspace
* [x] Buscar lead
* [x] Buscar campanha ativa
* [x] Buscar campos personalizados do lead
* [x] Montar prompt estruturado
* [x] Chamar API da LLM
* [x] Exigir retorno em JSON
* [x] Validar resposta da IA
* [x] Salvar mensagens em `generated_messages`
* [x] Registrar atividade `message_generated`
* [x] Criar painel de geração no detalhe do lead
* [x] Permitir selecionar campanha
* [x] Botão gerar mensagens
* [x] Botão regenerar mensagens
* [x] Exibir loading
* [x] Exibir erro amigável

### Critério de aceite

Usuário seleciona campanha em um lead e recebe 3 mensagens personalizadas salvas no histórico.

### Commit sugerido

```bash
git commit -m "feat: add AI message generation"
```

---

## Fase 11 | Copiar e envio simulado

### Objetivo

Permitir copiar mensagem e simular envio.

### Tasks

* [x] Criar botão copiar
* [x] Copiar conteúdo para clipboard
* [x] Mostrar feedback de sucesso
* [x] Criar Edge Function `send-message-simulated`
* [x] Validar usuário e workspace
* [x] Marcar mensagem como `sent`
* [x] Preencher `sent_at`
* [x] Buscar etapa `Tentando Contato`
* [x] Mover lead para `Tentando Contato`
* [x] Registrar atividade `message_sent`
* [x] Registrar atividade `stage_changed`
* [x] Atualizar UI após envio

### Critério de aceite

Ao clicar em enviar, mensagem é marcada como enviada e o lead vai automaticamente para **Tentando Contato**.

### Commit sugerido

```bash
git commit -m "feat: add simulated message sending"
```

---

## Fase 12 | Histórico de atividades e mensagens

### Objetivo

Dar rastreabilidade ao fluxo do lead.

### Tasks

* [x] Criar query `getLeadActivities`
* [x] Criar componente `ActivityTimeline`
* [x] Criar componente `ActivityItem`
* [x] Exibir atividades no detalhe do lead
* [x] Criar query `getGeneratedMessages`
* [x] Exibir histórico de mensagens geradas
* [x] Separar mensagens por campanha
* [x] Mostrar status da mensagem
* [x] Mostrar se foi manual ou gatilho
* [x] Mostrar data de envio quando existir

### Critério de aceite

O detalhe do lead mostra histórico de ações e mensagens geradas/enviadas.

### Commit sugerido

```bash
git commit -m "feat: add lead activity and message history"
```

---

## Fase 13 | Geração automática por etapa gatilho

### Objetivo

Implementar diferencial de geração automática quando lead entra em etapa configurada.

### Tasks

* [x] Criar Edge Function `trigger-generate-messages`
* [x] Buscar campanhas ativas vinculadas à etapa
* [x] Gerar mensagens para cada campanha encontrada
* [x] Salvar mensagens como `generation_type = trigger`
* [x] Registrar atividade `message_generated`
* [x] Registrar falha como `auto_generation_failed`
* [x] Atualizar `move-lead-stage` para chamar gatilho após movimentação
* [x] Disparar gatilho também quando lead for criado diretamente em etapa gatilho
* [x] Exibir mensagens pré-geradas no detalhe do lead

### Critério de aceite

Quando um lead entra em uma etapa gatilho, o sistema gera mensagens automaticamente e salva no histórico.

### Commit sugerido

```bash
git commit -m "feat: add trigger-based AI message generation"
```

---

## Fase 14 | Dashboard

### Objetivo

Criar visão geral do workspace.

### Tasks

* [x] Criar query `getDashboardMetrics`
* [x] Mostrar total de leads
* [x] Mostrar leads por etapa
* [x] Mostrar campanhas ativas
* [x] Mostrar mensagens geradas
* [x] Mostrar mensagens enviadas
* [x] Criar cards de métricas
* [x] Criar gráfico simples ou lista por etapa
* [x] Garantir filtro por workspace

### Critério de aceite

Dashboard mostra métricas reais do workspace atual.

### Commit sugerido

```bash
git commit -m "feat: add workspace dashboard metrics"
```

---

## Fase 15 | Busca e filtros

### Objetivo

Melhorar usabilidade do Kanban.

### Tasks

* [x] Buscar leads por nome
* [x] Buscar leads por email
* [x] Buscar leads por empresa
* [x] Filtrar por etapa
* [x] Filtrar por responsável
* [x] Atualizar Kanban com filtros
* [x] Criar estado vazio quando nenhum lead for encontrado

### Critério de aceite

Usuário consegue encontrar leads rapidamente.

### Commit sugerido

```bash
git commit -m "feat: add lead search and filters"
```

---

## Fase 16 | Polimento visual e UX

### Objetivo

Deixar o projeto com cara de produto final.

### Tasks

* [x] Revisar telas principais
* [x] Adicionar empty states
* [x] Adicionar loading states
* [x] Adicionar toasts
* [x] Melhorar mensagens de erro
* [x] Padronizar botões
* [x] Padronizar cards
* [x] Revisar responsividade básica
* [x] Adicionar dados de exemplo opcionais
* [x] Testar fluxo completo como usuário real

### Critério de aceite

Aplicação parece estável, clara e testável.

### Commit sugerido

```bash
git commit -m "style: polish UI and user experience"
```

---

## Fase 17 | Segurança e revisão técnica

### Objetivo

Revisar Supabase, RLS e regras críticas antes da entrega.

### Tasks

* [x] Confirmar RLS ativo em todas as tabelas sensíveis
* [x] Testar usuário A sem acesso ao workspace B
* [x] Confirmar que Service Role não está no frontend
* [x] Confirmar que chave da LLM não está no frontend
* [x] Revisar Edge Functions
* [x] Revisar validação de workspace
* [x] Revisar erros da IA
* [x] Revisar logs de atividades
* [x] Rodar lint
* [x] Corrigir erros TypeScript

### Critério de aceite

Projeto não expõe dados entre workspaces e não vaza chaves sensíveis.

### Commit sugerido

```bash
git commit -m "chore: review security and RLS policies"
```

---

## Fase 18 | Deploy

### Objetivo

Publicar aplicação e garantir que o avaliador consiga testar.

### Tasks

* [x] Criar projeto na Vercel
* [x] Conectar GitHub
* [x] Configurar variáveis de ambiente na Vercel
* [x] Configurar variáveis de ambiente no Supabase
* [x] Deploy das Edge Functions
* [x] Testar aplicação publicada
* [x] Criar usuário de teste ou permitir cadastro livre
* [x] Testar fluxo completo no ambiente publicado

### Critério de aceite

Aplicação publicada funciona de ponta a ponta.

### Commit sugerido

```bash
git commit -m "chore: prepare production deployment"
```

---

## Fase 19 | README final

### Objetivo

Documentar o projeto para avaliação.

### Tasks

* [x] Descrição do projeto
* [x] Link do deploy
* [x] Link do vídeo
* [x] Tecnologias utilizadas
* [x] Como rodar localmente
* [x] Variáveis de ambiente
* [x] Como aplicar migrations
* [x] Como fazer deploy das Edge Functions
* [x] Decisões técnicas
* [x] Arquitetura
* [x] Banco de dados
* [x] RLS
* [x] Integração com IA
* [x] Multi-tenancy
* [x] Funcionalidades implementadas
* [x] Checklist obrigatório
* [x] Checklist de diferenciais
* [x] Uso de IA no desenvolvimento
* [x] Desafios encontrados

### Critério de aceite

README permite que o avaliador entenda, rode e avalie o projeto.

### Commit sugerido

```bash
git commit -m "docs: complete project README"
```

---

## Fase 20 | Vídeo de apresentação

### Objetivo

Gravar vídeo de até 10 minutos demonstrando produto e decisões técnicas.

### Tasks

* [x] Escrever roteiro
* [x] Preparar dados de demonstração
* [x] Testar fluxo antes de gravar
* [x] Gravar visão geral
* [x] Gravar fluxo principal
* [x] Mostrar geração IA
* [x] Mostrar envio simulado
* [x] Mostrar RLS/multi-tenancy de forma conceitual
* [x] Mostrar diferenciais
* [x] Publicar no YouTube ou Google Drive
* [x] Adicionar link no README

### Critério de aceite

Vídeo demonstra claramente o fluxo cadastro -> lead -> campanha -> IA.

### Commit sugerido

```bash
git commit -m "docs: add video presentation link"
```

---

## Checklist final antes de enviar

* [x] App publicado
* [x] GitHub atualizado
* [x] README completo
* [x] Vídeo no README
* [x] Cadastro funcionando
* [x] Workspace funcionando
* [x] Kanban funcionando
* [x] Geração IA funcionando
* [x] Envio simulado funcionando
* [x] RLS revisado
* [x] Edge Functions funcionando
* [x] Sem chaves expostas
* [x] Fluxo principal testado em produção

````

---

# 12.5 Como usar com os agentes

## Para OpenCode

Use como executor principal:

```text
Leia o PRD.md e TASKS.md. Execute apenas a próxima fase pendente. Não implemente funcionalidades fora do escopo. Ao finalizar, atualize o checklist da fase e sugira o próximo commit.
````

## Para Claude Code

Use para gerar blocos maiores:

```text
Implemente a Fase X do TASKS.md seguindo a arquitetura definida no PRD.md. Mantenha a estrutura por features. Não crie novas tecnologias nem altere decisões arquiteturais sem justificar.
```

## Para Codex

Use para revisão:

```text
Revise a Fase X já implementada. Verifique bugs, tipagem, segurança, aderência ao PRD, RLS, exposição de variáveis sensíveis e inconsistências com os requisitos da prova.
```

---

# 12.6 Decisão importante

O `TASKS.md` deve ficar no repositório.

Isso mostra para o avaliador que o projeto teve:

1. Planejamento.
2. Execução incremental.
3. Controle de escopo.
4. Commits rastreáveis.
5. Uso profissional de IA.

Próxima seção recomendada: **README completo, já no formato final para o GitHub**.

# TASKS | SDRFlow AI

## Regra principal

Construir primeiro o fluxo obrigatório da prova:

```text
Cadastro -> Workspace -> Lead -> Kanban -> Campanha -> Geração IA -> Envio simulado -> Dashboard
```

Não iniciar diferenciais antes do fluxo principal estar funcional.

---

## Agentes usados

### OpenCode

Agente principal de execução.

Responsável por:

1. Criar estrutura.
2. Implementar features.
3. Fazer commits.
4. Manter ritmo.

### Claude Code

Responsável por:

1. Implementações mais longas.
2. UI.
3. Fluxos do frontend.
4. Ajustes de experiência.

### Codex

Responsável por:

1. Revisar código.
2. Encontrar bugs.
3. Melhorar tipagem.
4. Revisar segurança.
5. Revisar Supabase/RLS.
6. Validar aderência ao PRD.

---

# Fase 0 | Setup do projeto

## Objetivo

Criar a base técnica do projeto.

## Tasks

* [x] Criar repositório GitHub `sdrflow-ai`.
* [x] Criar projeto Next.js com TypeScript.
* [x] Instalar Tailwind CSS.
* [x] Instalar shadcn/ui.
* [x] Instalar Supabase client.
* [x] Instalar React Hook Form.
* [x] Instalar Zod.
* [x] Instalar dnd-kit.
* [x] Criar estrutura de pastas por feature.
* [x] Criar `.env.example`.
* [x] Criar pasta `docs`.
* [x] Adicionar `PRD.md`.
* [x] Adicionar `TASKS.md`.
* [x] Criar README inicial.

## Critério de aceite

Projeto roda localmente com:

```bash
npm run dev
```

## Commit sugerido

```bash
git commit -m "chore: initialize project setup"
```

---

# Fase 1 | Supabase e banco

## Objetivo

Criar schema inicial do banco, RLS e funções básicas.

## Tasks

* [x] Criar projeto no Supabase.
* [x] Criar migration `0001_initial_schema.sql`.
* [x] Criar tipos/enums.
* [x] Criar tabela `workspaces`.
* [x] Criar tabela `workspace_members`.
* [x] Criar tabela `funnel_stages`.
* [x] Criar tabela `leads`.
* [x] Criar tabela `custom_fields`.
* [x] Criar tabela `lead_custom_values`.
* [x] Criar tabela `stage_required_fields`.
* [x] Criar tabela `campaigns`.
* [x] Criar tabela `generated_messages`.
* [x] Criar tabela `lead_activities`.
* [x] Criar índices principais.
* [x] Criar função `is_workspace_member`.
* [x] Ativar RLS em todas as tabelas sensíveis.
* [x] Criar policies básicas por workspace.
* [x] Criar RPC `create_workspace_with_defaults`.
* [x] Criar triggers de `updated_at`.
* [x] Testar migration em ambiente limpo.

## Critério de aceite

Banco aplica migration sem erro e as tabelas aparecem no Supabase.

## Commit sugerido

```bash
git commit -m "db: add initial Supabase schema and RLS policies"
```

---

# Fase 2 | Autenticação

## Objetivo

Permitir cadastro, login, logout e proteção de rotas.

## Tasks

* [x] Configurar Supabase client para browser.
* [x] Configurar Supabase client para server.
* [x] Criar tela de login.
* [x] Criar tela de cadastro.
* [x] Criar logout.
* [x] Criar middleware de sessão.
* [x] Proteger rotas internas.
* [x] Redirecionar usuário não autenticado para login.
* [x] Redirecionar usuário autenticado para dashboard ou onboarding.
* [x] Exibir erros de login/cadastro.

## Critério de aceite

Usuário consegue criar conta, fazer login, acessar área interna e sair.

## Commit sugerido

```bash
git commit -m "feat: add authentication flow"
```

---

# Fase 3 | Workspace onboarding

## Objetivo

Criar workspace inicial e funil padrão.

## Tasks

* [x] Criar tela de criação de workspace.
* [x] Chamar RPC `create_workspace_with_defaults`.
* [x] Criar usuário como admin do workspace.
* [x] Criar etapas padrão automaticamente.
* [x] Criar `WorkspaceGuard`.
* [x] Buscar workspace atual do usuário.
* [x] Redirecionar para dashboard após criação.
* [x] Exibir nome do workspace no layout.

## Critério de aceite

Após cadastro, usuário cria workspace e vê o painel interno com funil padrão criado.

## Commit sugerido

```bash
git commit -m "feat: add workspace onboarding"
```

---

# Fase 4 | Layout interno

## Objetivo

Criar a base visual da aplicação.

## Tasks

* [x] Criar `AppLayout`.
* [x] Criar sidebar.
* [x] Criar header.
* [x] Criar menu do usuário.
* [x] Criar navegação para Dashboard, Kanban, Campanhas e Configurações.
* [x] Criar componentes de loading.
* [x] Criar componentes de empty state.
* [x] Criar componentes de erro.
* [x] Garantir responsividade básica.

## Critério de aceite

Usuário autenticado navega entre páginas internas com layout consistente.

## Commit sugerido

```bash
git commit -m "feat: add authenticated app layout"
```

---

# Fase 5 | Leads CRUD

## Objetivo

Criar, listar, editar e visualizar leads.

## Tasks

* [x] Criar schema Zod de lead.
* [x] Criar formulário de lead.
* [x] Criar ação `createLead`.
* [x] Criar ação `updateLead`.
* [x] Criar query `getLeads`.
* [x] Criar query `getLeadById`.
* [x] Criar página de detalhe do lead.
* [x] Permitir editar campos padrão.
* [x] Permitir selecionar etapa inicial.
* [x] Permitir responsável opcional.
* [x] Registrar atividade `lead_created`.
* [x] Registrar atividade `lead_updated`.

## Critério de aceite

Usuário consegue criar lead, editar lead e abrir detalhes.

## Commit sugerido

```bash
git commit -m "feat: add leads CRUD"
```

---

# Fase 6 | Kanban

## Objetivo

Visualizar leads por etapa e mover entre colunas.

## Tasks

* [x] Criar query `getKanbanData`.
* [x] Criar `KanbanBoard`.
* [x] Criar `KanbanColumn`.
* [x] Criar `LeadCard`.
* [x] Renderizar etapas em ordem.
* [x] Renderizar leads dentro da etapa correta.
* [x] Implementar drag and drop com dnd-kit.
* [x] Criar Edge Function `move-lead-stage`.
* [x] Chamar função ao mover lead.
* [x] Atualizar UI após movimentação.
* [x] Registrar atividade `stage_changed`.

## Critério de aceite

Usuário consegue mover lead entre etapas e a mudança persiste no banco.

## Commit sugerido

```bash
git commit -m "feat: add Kanban board and lead stage movement"
```

---

# Fase 7 | Campos personalizados

## Objetivo

Permitir criar campos adicionais por workspace e preencher no lead.

## Tasks

* [x] Criar schema Zod de campo personalizado.
* [x] Criar tela de campos personalizados.
* [x] Criar formulário de campo personalizado.
* [x] Suportar tipos `text`, `number`, `date`, `boolean`, `select`.
* [x] Criar campo com `name`, `key`, `field_type`, `options`.
* [x] Listar campos do workspace.
* [x] Renderizar campos personalizados no formulário do lead.
* [x] Salvar valores em `lead_custom_values`.
* [x] Exibir valores personalizados no detalhe do lead.
* [x] Incluir campos personalizados no payload da IA.

## Critério de aceite

Usuário cria campos personalizados e preenche valores diferentes por lead.

## Commit sugerido

```bash
git commit -m "feat: add custom fields for leads"
```

---

# Fase 8 | Regras de campos obrigatórios por etapa

## Objetivo

Bloquear movimentação de leads quando faltarem dados exigidos.

## Tasks

* [x] Criar tela de configuração do funil.
* [x] Listar etapas do workspace.
* [x] Listar campos padrão.
* [x] Listar campos personalizados.
* [x] Permitir marcar campos obrigatórios por etapa.
* [x] Salvar em `stage_required_fields`.
* [x] Atualizar Edge Function `move-lead-stage`.
* [x] Validar campos padrão.
* [x] Validar campos personalizados.
* [x] Retornar lista de campos faltantes.
* [x] Bloquear movimentação quando faltar campo.
* [x] Exibir erro amigável no Kanban.

## Critério de aceite

Se o usuário tentar mover lead para etapa com campos obrigatórios vazios, o sistema bloqueia e informa os campos faltantes.

## Commit sugerido

```bash
git commit -m "feat: add required fields validation by funnel stage"
```

---

# Fase 9 | Campanhas

## Objetivo

Criar campanhas com contexto e prompt de geração.

## Tasks

* [x] Criar schema Zod de campanha.
* [x] Criar página de campanhas.
* [x] Criar formulário de campanha.
* [x] Criar lista de campanhas.
* [x] Criar status ativo/inativo.
* [x] Criar campo `context`.
* [x] Criar campo `generation_prompt`.
* [x] Permitir selecionar etapa gatilho opcional.
* [x] Criar campanha no workspace correto.
* [x] Editar campanha.
* [x] Listar campanhas ativas no detalhe do lead.

## Critério de aceite

Usuário cria campanha ativa com contexto e prompt, e ela aparece para geração dentro do lead.

## Commit sugerido

```bash
git commit -m "feat: add campaign management"
```

---

# Fase 10 | Geração de mensagens com IA

## Objetivo

Gerar 3 mensagens personalizadas usando LLM.

## Tasks

* [x] Criar Supabase Edge Function `generate-messages`.
* [x] Validar usuário autenticado.
* [x] Validar acesso ao workspace.
* [x] Buscar lead.
* [x] Buscar campanha ativa.
* [x] Buscar campos personalizados do lead.
* [x] Montar prompt estruturado.
* [x] Chamar API da LLM.
* [x] Exigir retorno em JSON.
* [x] Validar resposta da IA.
* [x] Salvar mensagens em `generated_messages`.
* [x] Registrar atividade `message_generated`.
* [x] Criar painel de geração no detalhe do lead.
* [x] Permitir selecionar campanha.
* [x] Criar botão gerar mensagens.
* [x] Criar botão regenerar mensagens.
* [x] Exibir loading.
* [x] Exibir erro amigável.

## Critério de aceite

Usuário seleciona campanha em um lead e recebe 3 mensagens personalizadas salvas no histórico.

## Commit sugerido

```bash
git commit -m "feat: add AI message generation"
```

---

# Fase 11 | Copiar e envio simulado

## Objetivo

Permitir copiar mensagem e simular envio.

## Tasks

* [x] Criar botão copiar.
* [x] Copiar conteúdo para clipboard.
* [x] Mostrar feedback de sucesso.
* [x] Criar Edge Function `send-message-simulated`.
* [x] Validar usuário e workspace.
* [x] Marcar mensagem como `sent`.
* [x] Preencher `sent_at`.
* [x] Buscar etapa `Tentando Contato`.
* [x] Mover lead para `Tentando Contato`.
* [x] Registrar atividade `message_sent`.
* [x] Registrar atividade `stage_changed`.
* [x] Atualizar UI após envio.

## Critério de aceite

Ao clicar em enviar, mensagem é marcada como enviada e o lead vai automaticamente para **Tentando Contato**.

## Commit sugerido

```bash
git commit -m "feat: add simulated message sending"
```

---

# Fase 12 | Histórico de atividades e mensagens

## Objetivo

Dar rastreabilidade ao fluxo do lead.

## Tasks

* [x] Criar query `getLeadActivities`.
* [x] Criar componente `ActivityTimeline`.
* [x] Criar componente `ActivityItem`.
* [x] Exibir atividades no detalhe do lead.
* [x] Criar query `getGeneratedMessages`.
* [x] Exibir histórico de mensagens geradas.
* [x] Separar mensagens por campanha.
* [x] Mostrar status da mensagem.
* [x] Mostrar se foi manual ou gatilho.
* [x] Mostrar data de envio quando existir.

## Critério de aceite

O detalhe do lead mostra histórico de ações e mensagens geradas/enviadas.

## Commit sugerido

```bash
git commit -m "feat: add lead activity and message history"
```

---

# Fase 13 | Geração automática por etapa gatilho

## Objetivo

Implementar diferencial de geração automática quando lead entra em etapa configurada.

## Tasks

* [x] Criar Edge Function `trigger-generate-messages`.
* [x] Buscar campanhas ativas vinculadas à etapa.
* [x] Gerar mensagens para cada campanha encontrada.
* [x] Salvar mensagens como `generation_type = trigger`.
* [x] Registrar atividade `message_generated`.
* [x] Registrar falha como `auto_generation_failed`.
* [x] Atualizar `move-lead-stage` para chamar gatilho após movimentação.
* [x] Disparar gatilho também quando lead for criado diretamente em etapa gatilho.
* [x] Exibir mensagens pré-geradas no detalhe do lead.

## Critério de aceite

Quando um lead entra em uma etapa gatilho, o sistema gera mensagens automaticamente e salva no histórico.

## Commit sugerido

```bash
git commit -m "feat: add trigger-based AI message generation"
```

---

# Fase 14 | Dashboard

## Objetivo

Criar visão geral do workspace.

## Tasks

* [x] Criar query `getDashboardMetrics`.
* [x] Mostrar total de leads.
* [x] Mostrar leads por etapa.
* [x] Mostrar campanhas ativas.
* [x] Mostrar mensagens geradas.
* [x] Mostrar mensagens enviadas.
* [x] Criar cards de métricas.
* [x] Criar gráfico simples ou lista por etapa.
* [x] Garantir filtro por workspace.

## Critério de aceite

Dashboard mostra métricas reais do workspace atual.

## Commit sugerido

```bash
git commit -m "feat: add workspace dashboard metrics"
```

---

# Fase 15 | Busca e filtros

## Objetivo

Melhorar usabilidade do Kanban.

## Tasks

* [x] Buscar leads por nome.
* [x] Buscar leads por email.
* [x] Buscar leads por empresa.
* [x] Filtrar por etapa.
* [x] Filtrar por responsável.
* [x] Atualizar Kanban com filtros.
* [x] Criar estado vazio quando nenhum lead for encontrado.

## Critério de aceite

Usuário consegue encontrar leads rapidamente.

## Commit sugerido

```bash
git commit -m "feat: add lead search and filters"
```

---

# Fase 16 | Polimento visual e UX

## Objetivo

Deixar o projeto com cara de produto final.

## Tasks

* [x] Revisar telas principais.
* [x] Adicionar empty states.
* [x] Adicionar loading states.
* [x] Adicionar toasts.
* [x] Melhorar mensagens de erro.
* [x] Padronizar botões.
* [x] Padronizar cards.
* [x] Revisar responsividade básica.
* [x] Adicionar dados de exemplo opcionais.
* [x] Testar fluxo completo como usuário real.

## Critério de aceite

Aplicação parece estável, clara e testável.

## Commit sugerido

```bash
git commit -m "style: polish UI and user experience"
```

---

# Fase 17 | Segurança e revisão técnica

## Objetivo

Revisar Supabase, RLS e regras críticas antes da entrega.

## Tasks

* [x] Confirmar RLS ativo em todas as tabelas sensíveis.
* [x] Testar usuário A sem acesso ao workspace B.
* [x] Confirmar que Service Role não está no frontend.
* [x] Confirmar que chave da LLM não está no frontend.
* [x] Revisar Edge Functions.
* [x] Revisar validação de workspace.
* [x] Revisar erros da IA.
* [x] Revisar logs de atividades.
* [x] Rodar lint.
* [x] Corrigir erros TypeScript.

## Critério de aceite

Projeto não expõe dados entre workspaces e não vaza chaves sensíveis.

## Commit sugerido

```bash
git commit -m "chore: review security and RLS policies"
```

---

# Fase 18 | Deploy

## Objetivo

Publicar aplicação e garantir que o avaliador consiga testar.

## Tasks

* [x] Criar projeto na Vercel.
* [x] Conectar GitHub.
* [x] Configurar variáveis de ambiente na Vercel.
* [x] Configurar variáveis de ambiente no Supabase.
* [x] Deploy das Edge Functions.
* [x] Testar aplicação publicada.
* [x] Criar usuário de teste ou permitir cadastro livre.
* [x] Testar fluxo completo no ambiente publicado.

## Critério de aceite

Aplicação publicada funciona de ponta a ponta.

## Commit sugerido

```bash
git commit -m "chore: prepare production deployment"
```

---

# Fase 19 | README final

## Objetivo

Documentar o projeto para avaliação.

## Tasks

* [x] Descrição do projeto.
* [x] Link do deploy.
* [x] Link do vídeo.
* [x] Tecnologias utilizadas.
* [x] Como rodar localmente.
* [x] Variáveis de ambiente.
* [x] Como aplicar migrations.
* [x] Como fazer deploy das Edge Functions.
* [x] Decisões técnicas.
* [x] Arquitetura.
* [x] Banco de dados.
* [x] RLS.
* [x] Integração com IA.
* [x] Multi-tenancy.
* [x] Funcionalidades implementadas.
* [x] Checklist obrigatório.
* [x] Checklist de diferenciais.
* [x] Uso de IA no desenvolvimento.
* [x] Desafios encontrados.

## Critério de aceite

README permite que o avaliador entenda, rode e avalie o projeto.

## Commit sugerido

```bash
git commit -m "docs: complete project README"
```

---

# Fase 20 | Vídeo de apresentação

## Objetivo

Gravar vídeo de até 10 minutos demonstrando produto e decisões técnicas.

## Tasks

* [x] Escrever roteiro.
* [x] Preparar dados de demonstração.
* [x] Testar fluxo antes de gravar.
* [x] Gravar visão geral.
* [x] Gravar fluxo principal.
* [x] Mostrar geração IA.
* [x] Mostrar envio simulado.
* [x] Mostrar RLS/multi-tenancy de forma conceitual.
* [x] Mostrar diferenciais.
* [x] Publicar no YouTube ou Google Drive.
* [x] Adicionar link no README.

## Critério de aceite

Vídeo demonstra claramente o fluxo:

```text
cadastro -> workspace -> lead -> campanha -> IA -> envio simulado
```

## Commit sugerido

```bash
git commit -m "docs: add video presentation link"
```

---

# Checklist final antes de enviar

* [x] App publicado.
* [x] GitHub atualizado.
* [x] README completo.
* [ ] Vídeo no README.
* [x] Cadastro funcionando.
* [x] Login funcionando.
* [x] Workspace funcionando.
* [x] Kanban funcionando.
* [x] Leads funcionando.
* [x] Campanhas funcionando.
* [x] Geração IA funcionando.
* [x] Envio simulado funcionando.
* [x] Dashboard funcionando.
* [x] RLS revisado.
* [x] Edge Functions funcionando.
* [x] Sem chaves expostas.
* [x] Fluxo principal testado em produção.

---

# Prompts para os agentes

## Prompt para OpenCode

```text
Leia docs/PRD.md e docs/TASKS.md. Execute apenas a próxima fase pendente. Não implemente funcionalidades fora do escopo. Ao finalizar, atualize o checklist da fase, rode validações básicas e sugira o próximo commit.
```

## Prompt para Claude Code

```text
Implemente a Fase X do docs/TASKS.md seguindo a arquitetura definida em docs/PRD.md. Mantenha a estrutura por features. Não crie novas tecnologias nem altere decisões arquiteturais sem justificar.
```

## Prompt para Codex

```text
Revise a Fase X já implementada. Verifi
```
