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

* [ ] Criar projeto no Supabase
* [ ] Criar migration `0001_initial_schema.sql`
* [ ] Criar tipos/enums
* [ ] Criar tabela `workspaces`
* [ ] Criar tabela `workspace_members`
* [ ] Criar tabela `funnel_stages`
* [ ] Criar tabela `leads`
* [ ] Criar tabela `custom_fields`
* [ ] Criar tabela `lead_custom_values`
* [ ] Criar tabela `stage_required_fields`
* [ ] Criar tabela `campaigns`
* [ ] Criar tabela `generated_messages`
* [ ] Criar tabela `lead_activities`
* [ ] Criar índices principais
* [ ] Criar função `is_workspace_member`
* [ ] Ativar RLS em todas as tabelas sensíveis
* [ ] Criar policies básicas por workspace
* [ ] Criar RPC `create_workspace_with_defaults`
* [ ] Criar triggers de `updated_at`

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

* [ ] Configurar Supabase client
* [ ] Criar tela de login
* [ ] Criar tela de cadastro
* [ ] Criar logout
* [ ] Criar middleware de sessão
* [ ] Proteger rotas internas
* [ ] Redirecionar usuário não autenticado para login
* [ ] Redirecionar usuário autenticado para dashboard
* [ ] Exibir erros de login/cadastro

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

* [ ] Criar tela de criação de workspace
* [ ] Chamar RPC `create_workspace_with_defaults`
* [ ] Criar usuário como admin do workspace
* [ ] Criar etapas padrão automaticamente
* [ ] Criar `WorkspaceGuard`
* [ ] Buscar workspace atual do usuário
* [ ] Redirecionar para dashboard após criação
* [ ] Exibir nome do workspace no layout

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

* [ ] Criar `AppLayout`
* [ ] Criar sidebar
* [ ] Criar header
* [ ] Criar menu do usuário
* [ ] Criar navegação para Dashboard, Kanban, Campanhas e Configurações
* [ ] Criar componentes de loading
* [ ] Criar componentes de empty state
* [ ] Criar componentes de erro

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

* [ ] Criar schema Zod de lead
* [ ] Criar formulário de lead
* [ ] Criar ação `createLead`
* [ ] Criar ação `updateLead`
* [ ] Criar query `getLeads`
* [ ] Criar query `getLeadById`
* [ ] Criar página de detalhe do lead
* [ ] Permitir editar campos padrão
* [ ] Permitir selecionar etapa inicial
* [ ] Permitir responsável opcional
* [ ] Registrar atividade `lead_created`
* [ ] Registrar atividade `lead_updated`

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

* [ ] Criar query `getKanbanData`
* [ ] Criar `KanbanBoard`
* [ ] Criar `KanbanColumn`
* [ ] Criar `LeadCard`
* [ ] Renderizar etapas em ordem
* [ ] Renderizar leads dentro da etapa correta
* [ ] Implementar drag and drop com dnd-kit
* [ ] Criar Edge Function `move-lead-stage`
* [ ] Chamar função ao mover lead
* [ ] Atualizar UI após movimentação
* [ ] Registrar atividade `stage_changed`

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

* [ ] Criar schema Zod de campo personalizado
* [ ] Criar tela de campos personalizados
* [ ] Criar formulário de campo personalizado
* [ ] Suportar tipos `text`, `number`, `date`, `boolean`, `select`
* [ ] Criar campo com `name`, `key`, `field_type`, `options`
* [ ] Listar campos do workspace
* [ ] Renderizar campos personalizados no formulário do lead
* [ ] Salvar valores em `lead_custom_values`
* [ ] Exibir valores personalizados no detalhe do lead
* [ ] Incluir campos personalizados no payload da IA

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

* [ ] Criar tela de configuração do funil
* [ ] Listar etapas do workspace
* [ ] Listar campos padrão
* [ ] Listar campos personalizados
* [ ] Permitir marcar campos obrigatórios por etapa
* [ ] Salvar em `stage_required_fields`
* [ ] Atualizar Edge Function `move-lead-stage`
* [ ] Validar campos padrão
* [ ] Validar campos personalizados
* [ ] Retornar lista de campos faltantes
* [ ] Bloquear movimentação quando faltar campo
* [ ] Exibir erro amigável no Kanban

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

* [ ] Criar schema Zod de campanha
* [ ] Criar página de campanhas
* [ ] Criar formulário de campanha
* [ ] Criar lista de campanhas
* [ ] Criar status ativo/inativo
* [ ] Criar campo `context`
* [ ] Criar campo `generation_prompt`
* [ ] Permitir selecionar etapa gatilho opcional
* [ ] Criar campanha no workspace correto
* [ ] Editar campanha
* [ ] Listar campanhas ativas no detalhe do lead

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

* [ ] Criar Supabase Edge Function `generate-messages`
* [ ] Validar usuário autenticado
* [ ] Validar acesso ao workspace
* [ ] Buscar lead
* [ ] Buscar campanha ativa
* [ ] Buscar campos personalizados do lead
* [ ] Montar prompt estruturado
* [ ] Chamar API da LLM
* [ ] Exigir retorno em JSON
* [ ] Validar resposta da IA
* [ ] Salvar mensagens em `generated_messages`
* [ ] Registrar atividade `message_generated`
* [ ] Criar painel de geração no detalhe do lead
* [ ] Permitir selecionar campanha
* [ ] Botão gerar mensagens
* [ ] Botão regenerar mensagens
* [ ] Exibir loading
* [ ] Exibir erro amigável

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

* [ ] Criar botão copiar
* [ ] Copiar conteúdo para clipboard
* [ ] Mostrar feedback de sucesso
* [ ] Criar Edge Function `send-message-simulated`
* [ ] Validar usuário e workspace
* [ ] Marcar mensagem como `sent`
* [ ] Preencher `sent_at`
* [ ] Buscar etapa `Tentando Contato`
* [ ] Mover lead para `Tentando Contato`
* [ ] Registrar atividade `message_sent`
* [ ] Registrar atividade `stage_changed`
* [ ] Atualizar UI após envio

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

* [ ] Criar query `getLeadActivities`
* [ ] Criar componente `ActivityTimeline`
* [ ] Criar componente `ActivityItem`
* [ ] Exibir atividades no detalhe do lead
* [ ] Criar query `getGeneratedMessages`
* [ ] Exibir histórico de mensagens geradas
* [ ] Separar mensagens por campanha
* [ ] Mostrar status da mensagem
* [ ] Mostrar se foi manual ou gatilho
* [ ] Mostrar data de envio quando existir

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

* [ ] Criar Edge Function `trigger-generate-messages`
* [ ] Buscar campanhas ativas vinculadas à etapa
* [ ] Gerar mensagens para cada campanha encontrada
* [ ] Salvar mensagens como `generation_type = trigger`
* [ ] Registrar atividade `message_generated`
* [ ] Registrar falha como `auto_generation_failed`
* [ ] Atualizar `move-lead-stage` para chamar gatilho após movimentação
* [ ] Disparar gatilho também quando lead for criado diretamente em etapa gatilho
* [ ] Exibir mensagens pré-geradas no detalhe do lead

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

* [ ] Criar query `getDashboardMetrics`
* [ ] Mostrar total de leads
* [ ] Mostrar leads por etapa
* [ ] Mostrar campanhas ativas
* [ ] Mostrar mensagens geradas
* [ ] Mostrar mensagens enviadas
* [ ] Criar cards de métricas
* [ ] Criar gráfico simples ou lista por etapa
* [ ] Garantir filtro por workspace

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

* [ ] Buscar leads por nome
* [ ] Buscar leads por email
* [ ] Buscar leads por empresa
* [ ] Filtrar por etapa
* [ ] Filtrar por responsável
* [ ] Atualizar Kanban com filtros
* [ ] Criar estado vazio quando nenhum lead for encontrado

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

* [ ] Revisar telas principais
* [ ] Adicionar empty states
* [ ] Adicionar loading states
* [ ] Adicionar toasts
* [ ] Melhorar mensagens de erro
* [ ] Padronizar botões
* [ ] Padronizar cards
* [ ] Revisar responsividade básica
* [ ] Adicionar dados de exemplo opcionais
* [ ] Testar fluxo completo como usuário real

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

* [ ] Confirmar RLS ativo em todas as tabelas sensíveis
* [ ] Testar usuário A sem acesso ao workspace B
* [ ] Confirmar que Service Role não está no frontend
* [ ] Confirmar que chave da LLM não está no frontend
* [ ] Revisar Edge Functions
* [ ] Revisar validação de workspace
* [ ] Revisar erros da IA
* [ ] Revisar logs de atividades
* [ ] Rodar lint
* [ ] Corrigir erros TypeScript

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

* [ ] Criar projeto na Vercel
* [ ] Conectar GitHub
* [ ] Configurar variáveis de ambiente na Vercel
* [ ] Configurar variáveis de ambiente no Supabase
* [ ] Deploy das Edge Functions
* [ ] Testar aplicação publicada
* [ ] Criar usuário de teste ou permitir cadastro livre
* [ ] Testar fluxo completo no ambiente publicado

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

* [ ] Descrição do projeto
* [ ] Link do deploy
* [ ] Link do vídeo
* [ ] Tecnologias utilizadas
* [ ] Como rodar localmente
* [ ] Variáveis de ambiente
* [ ] Como aplicar migrations
* [ ] Como fazer deploy das Edge Functions
* [ ] Decisões técnicas
* [ ] Arquitetura
* [ ] Banco de dados
* [ ] RLS
* [ ] Integração com IA
* [ ] Multi-tenancy
* [ ] Funcionalidades implementadas
* [ ] Checklist obrigatório
* [ ] Checklist de diferenciais
* [ ] Uso de IA no desenvolvimento
* [ ] Desafios encontrados

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

* [ ] Escrever roteiro
* [ ] Preparar dados de demonstração
* [ ] Testar fluxo antes de gravar
* [ ] Gravar visão geral
* [ ] Gravar fluxo principal
* [ ] Mostrar geração IA
* [ ] Mostrar envio simulado
* [ ] Mostrar RLS/multi-tenancy de forma conceitual
* [ ] Mostrar diferenciais
* [ ] Publicar no YouTube ou Google Drive
* [ ] Adicionar link no README

### Critério de aceite

Vídeo demonstra claramente o fluxo cadastro -> lead -> campanha -> IA.

### Commit sugerido

```bash
git commit -m "docs: add video presentation link"
```

---

## Checklist final antes de enviar

* [ ] App publicado
* [ ] GitHub atualizado
* [ ] README completo
* [ ] Vídeo no README
* [ ] Cadastro funcionando
* [ ] Workspace funcionando
* [ ] Kanban funcionando
* [ ] Geração IA funcionando
* [ ] Envio simulado funcionando
* [ ] RLS revisado
* [ ] Edge Functions funcionando
* [ ] Sem chaves expostas
* [ ] Fluxo principal testado em produção

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

* [ ] Criar repositório GitHub `sdrflow-ai`.
* [ ] Criar projeto Next.js com TypeScript.
* [ ] Instalar Tailwind CSS.
* [ ] Instalar shadcn/ui.
* [ ] Instalar Supabase client.
* [ ] Instalar React Hook Form.
* [ ] Instalar Zod.
* [ ] Instalar dnd-kit.
* [ ] Criar estrutura de pastas por feature.
* [ ] Criar `.env.example`.
* [ ] Criar pasta `docs`.
* [ ] Adicionar `PRD.md`.
* [ ] Adicionar `TASKS.md`.
* [ ] Criar README inicial.

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

* [ ] Criar projeto no Supabase.
* [ ] Criar migration `0001_initial_schema.sql`.
* [ ] Criar tipos/enums.
* [ ] Criar tabela `workspaces`.
* [ ] Criar tabela `workspace_members`.
* [ ] Criar tabela `funnel_stages`.
* [ ] Criar tabela `leads`.
* [ ] Criar tabela `custom_fields`.
* [ ] Criar tabela `lead_custom_values`.
* [ ] Criar tabela `stage_required_fields`.
* [ ] Criar tabela `campaigns`.
* [ ] Criar tabela `generated_messages`.
* [ ] Criar tabela `lead_activities`.
* [ ] Criar índices principais.
* [ ] Criar função `is_workspace_member`.
* [ ] Ativar RLS em todas as tabelas sensíveis.
* [ ] Criar policies básicas por workspace.
* [ ] Criar RPC `create_workspace_with_defaults`.
* [ ] Criar triggers de `updated_at`.
* [ ] Testar migration em ambiente limpo.

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

* [ ] Configurar Supabase client para browser.
* [ ] Configurar Supabase client para server.
* [ ] Criar tela de login.
* [ ] Criar tela de cadastro.
* [ ] Criar logout.
* [ ] Criar middleware de sessão.
* [ ] Proteger rotas internas.
* [ ] Redirecionar usuário não autenticado para login.
* [ ] Redirecionar usuário autenticado para dashboard ou onboarding.
* [ ] Exibir erros de login/cadastro.

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

* [ ] Criar tela de criação de workspace.
* [ ] Chamar RPC `create_workspace_with_defaults`.
* [ ] Criar usuário como admin do workspace.
* [ ] Criar etapas padrão automaticamente.
* [ ] Criar `WorkspaceGuard`.
* [ ] Buscar workspace atual do usuário.
* [ ] Redirecionar para dashboard após criação.
* [ ] Exibir nome do workspace no layout.

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

* [ ] Criar `AppLayout`.
* [ ] Criar sidebar.
* [ ] Criar header.
* [ ] Criar menu do usuário.
* [ ] Criar navegação para Dashboard, Kanban, Campanhas e Configurações.
* [ ] Criar componentes de loading.
* [ ] Criar componentes de empty state.
* [ ] Criar componentes de erro.
* [ ] Garantir responsividade básica.

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

* [ ] Criar schema Zod de lead.
* [ ] Criar formulário de lead.
* [ ] Criar ação `createLead`.
* [ ] Criar ação `updateLead`.
* [ ] Criar query `getLeads`.
* [ ] Criar query `getLeadById`.
* [ ] Criar página de detalhe do lead.
* [ ] Permitir editar campos padrão.
* [ ] Permitir selecionar etapa inicial.
* [ ] Permitir responsável opcional.
* [ ] Registrar atividade `lead_created`.
* [ ] Registrar atividade `lead_updated`.

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

* [ ] Criar query `getKanbanData`.
* [ ] Criar `KanbanBoard`.
* [ ] Criar `KanbanColumn`.
* [ ] Criar `LeadCard`.
* [ ] Renderizar etapas em ordem.
* [ ] Renderizar leads dentro da etapa correta.
* [ ] Implementar drag and drop com dnd-kit.
* [ ] Criar Edge Function `move-lead-stage`.
* [ ] Chamar função ao mover lead.
* [ ] Atualizar UI após movimentação.
* [ ] Registrar atividade `stage_changed`.

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

* [ ] Criar schema Zod de campo personalizado.
* [ ] Criar tela de campos personalizados.
* [ ] Criar formulário de campo personalizado.
* [ ] Suportar tipos `text`, `number`, `date`, `boolean`, `select`.
* [ ] Criar campo com `name`, `key`, `field_type`, `options`.
* [ ] Listar campos do workspace.
* [ ] Renderizar campos personalizados no formulário do lead.
* [ ] Salvar valores em `lead_custom_values`.
* [ ] Exibir valores personalizados no detalhe do lead.
* [ ] Incluir campos personalizados no payload da IA.

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

* [ ] Criar tela de configuração do funil.
* [ ] Listar etapas do workspace.
* [ ] Listar campos padrão.
* [ ] Listar campos personalizados.
* [ ] Permitir marcar campos obrigatórios por etapa.
* [ ] Salvar em `stage_required_fields`.
* [ ] Atualizar Edge Function `move-lead-stage`.
* [ ] Validar campos padrão.
* [ ] Validar campos personalizados.
* [ ] Retornar lista de campos faltantes.
* [ ] Bloquear movimentação quando faltar campo.
* [ ] Exibir erro amigável no Kanban.

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

* [ ] Criar schema Zod de campanha.
* [ ] Criar página de campanhas.
* [ ] Criar formulário de campanha.
* [ ] Criar lista de campanhas.
* [ ] Criar status ativo/inativo.
* [ ] Criar campo `context`.
* [ ] Criar campo `generation_prompt`.
* [ ] Permitir selecionar etapa gatilho opcional.
* [ ] Criar campanha no workspace correto.
* [ ] Editar campanha.
* [ ] Listar campanhas ativas no detalhe do lead.

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

* [ ] Criar Supabase Edge Function `generate-messages`.
* [ ] Validar usuário autenticado.
* [ ] Validar acesso ao workspace.
* [ ] Buscar lead.
* [ ] Buscar campanha ativa.
* [ ] Buscar campos personalizados do lead.
* [ ] Montar prompt estruturado.
* [ ] Chamar API da LLM.
* [ ] Exigir retorno em JSON.
* [ ] Validar resposta da IA.
* [ ] Salvar mensagens em `generated_messages`.
* [ ] Registrar atividade `message_generated`.
* [ ] Criar painel de geração no detalhe do lead.
* [ ] Permitir selecionar campanha.
* [ ] Criar botão gerar mensagens.
* [ ] Criar botão regenerar mensagens.
* [ ] Exibir loading.
* [ ] Exibir erro amigável.

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

* [ ] Criar botão copiar.
* [ ] Copiar conteúdo para clipboard.
* [ ] Mostrar feedback de sucesso.
* [ ] Criar Edge Function `send-message-simulated`.
* [ ] Validar usuário e workspace.
* [ ] Marcar mensagem como `sent`.
* [ ] Preencher `sent_at`.
* [ ] Buscar etapa `Tentando Contato`.
* [ ] Mover lead para `Tentando Contato`.
* [ ] Registrar atividade `message_sent`.
* [ ] Registrar atividade `stage_changed`.
* [ ] Atualizar UI após envio.

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

* [ ] Criar query `getLeadActivities`.
* [ ] Criar componente `ActivityTimeline`.
* [ ] Criar componente `ActivityItem`.
* [ ] Exibir atividades no detalhe do lead.
* [ ] Criar query `getGeneratedMessages`.
* [ ] Exibir histórico de mensagens geradas.
* [ ] Separar mensagens por campanha.
* [ ] Mostrar status da mensagem.
* [ ] Mostrar se foi manual ou gatilho.
* [ ] Mostrar data de envio quando existir.

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

* [ ] Criar Edge Function `trigger-generate-messages`.
* [ ] Buscar campanhas ativas vinculadas à etapa.
* [ ] Gerar mensagens para cada campanha encontrada.
* [ ] Salvar mensagens como `generation_type = trigger`.
* [ ] Registrar atividade `message_generated`.
* [ ] Registrar falha como `auto_generation_failed`.
* [ ] Atualizar `move-lead-stage` para chamar gatilho após movimentação.
* [ ] Disparar gatilho também quando lead for criado diretamente em etapa gatilho.
* [ ] Exibir mensagens pré-geradas no detalhe do lead.

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

* [ ] Criar query `getDashboardMetrics`.
* [ ] Mostrar total de leads.
* [ ] Mostrar leads por etapa.
* [ ] Mostrar campanhas ativas.
* [ ] Mostrar mensagens geradas.
* [ ] Mostrar mensagens enviadas.
* [ ] Criar cards de métricas.
* [ ] Criar gráfico simples ou lista por etapa.
* [ ] Garantir filtro por workspace.

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

* [ ] Buscar leads por nome.
* [ ] Buscar leads por email.
* [ ] Buscar leads por empresa.
* [ ] Filtrar por etapa.
* [ ] Filtrar por responsável.
* [ ] Atualizar Kanban com filtros.
* [ ] Criar estado vazio quando nenhum lead for encontrado.

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

* [ ] Revisar telas principais.
* [ ] Adicionar empty states.
* [ ] Adicionar loading states.
* [ ] Adicionar toasts.
* [ ] Melhorar mensagens de erro.
* [ ] Padronizar botões.
* [ ] Padronizar cards.
* [ ] Revisar responsividade básica.
* [ ] Adicionar dados de exemplo opcionais.
* [ ] Testar fluxo completo como usuário real.

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

* [ ] Confirmar RLS ativo em todas as tabelas sensíveis.
* [ ] Testar usuário A sem acesso ao workspace B.
* [ ] Confirmar que Service Role não está no frontend.
* [ ] Confirmar que chave da LLM não está no frontend.
* [ ] Revisar Edge Functions.
* [ ] Revisar validação de workspace.
* [ ] Revisar erros da IA.
* [ ] Revisar logs de atividades.
* [ ] Rodar lint.
* [ ] Corrigir erros TypeScript.

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

* [ ] Criar projeto na Vercel.
* [ ] Conectar GitHub.
* [ ] Configurar variáveis de ambiente na Vercel.
* [ ] Configurar variáveis de ambiente no Supabase.
* [ ] Deploy das Edge Functions.
* [ ] Testar aplicação publicada.
* [ ] Criar usuário de teste ou permitir cadastro livre.
* [ ] Testar fluxo completo no ambiente publicado.

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

* [ ] Descrição do projeto.
* [ ] Link do deploy.
* [ ] Link do vídeo.
* [ ] Tecnologias utilizadas.
* [ ] Como rodar localmente.
* [ ] Variáveis de ambiente.
* [ ] Como aplicar migrations.
* [ ] Como fazer deploy das Edge Functions.
* [ ] Decisões técnicas.
* [ ] Arquitetura.
* [ ] Banco de dados.
* [ ] RLS.
* [ ] Integração com IA.
* [ ] Multi-tenancy.
* [ ] Funcionalidades implementadas.
* [ ] Checklist obrigatório.
* [ ] Checklist de diferenciais.
* [ ] Uso de IA no desenvolvimento.
* [ ] Desafios encontrados.

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

* [ ] Escrever roteiro.
* [ ] Preparar dados de demonstração.
* [ ] Testar fluxo antes de gravar.
* [ ] Gravar visão geral.
* [ ] Gravar fluxo principal.
* [ ] Mostrar geração IA.
* [ ] Mostrar envio simulado.
* [ ] Mostrar RLS/multi-tenancy de forma conceitual.
* [ ] Mostrar diferenciais.
* [ ] Publicar no YouTube ou Google Drive.
* [ ] Adicionar link no README.

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

* [ ] App publicado.
* [ ] GitHub atualizado.
* [ ] README completo.
* [ ] Vídeo no README.
* [ ] Cadastro funcionando.
* [ ] Login funcionando.
* [ ] Workspace funcionando.
* [ ] Kanban funcionando.
* [ ] Leads funcionando.
* [ ] Campanhas funcionando.
* [ ] Geração IA funcionando.
* [ ] Envio simulado funcionando.
* [ ] Dashboard funcionando.
* [ ] RLS revisado.
* [ ] Edge Functions funcionando.
* [ ] Sem chaves expostas.
* [ ] Fluxo principal testado em produção.

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
