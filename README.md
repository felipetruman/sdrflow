# SDRFlow AI

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)](https://tailwindcss.com/) [![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ecf8e)](https://supabase.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Mini CRM para equipes de pré-vendas com geração de mensagens por IA.

## 1. Descrição

O **SDRFlow AI** foi criado para organizar o trabalho de equipes de SDR e pré-vendas em um fluxo único: cadastro, criação de workspace, gestão de leads, movimentação em Kanban, campanhas de abordagem e geração assistida por IA.

O problema que o projeto resolve é a dispersão operacional: leads em planilhas, etapas desconectadas, mensagens sem contexto e pouca visibilidade de performance. A aplicação centraliza tudo em um CRM leve, com multi-tenancy por workspace e segurança por RLS.

## 2. Fluxo Principal

1. **Cadastro** → usuário cria conta.
2. **Workspace** → cria ou acessa um workspace da equipe.
3. **Lead** → cadastra, edita e exclui leads.
4. **Kanban** → arrasta o lead entre etapas do funil.
5. **Campanha** → configura contexto e gatilhos de abordagem.
6. **IA** → gera mensagens personalizadas via Edge Function.
7. **Envio** → simula envio e movimentação automática.
8. **Dashboard** → acompanha métricas e atividade do time.

## 3. Tecnologias

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Supabase (Auth, Postgres, RLS, Edge Functions)
- dnd-kit (Kanban drag-and-drop)
- React Hook Form + Zod (formulários)
- lucide-react (ícones)

## 4. Funcionalidades Implementadas

- [✅] Auth (cadastro/login/logout) com redesign enterprise split-screen
- [✅] Workspaces com multi-tenancy e onboarding automático
- [✅] Leads CRUD completo (criar, editar, excluir)
- [✅] Kanban drag-and-drop com filtros, busca e ordenação
- [✅] Campos personalizados por workspace
- [✅] Regras de campos obrigatórios por etapa
- [✅] Campanhas de abordagem com gatilho por etapa
- [✅] Geração de mensagens com IA (Edge Function + fallback local)
- [✅] Envio simulado com movimentação automática de etapa
- [✅] Histórico de atividades do lead
- [✅] Dashboard com métricas
- [✅] RLS e isolamento por workspace
- [✅] Edge Functions (4 ativas)
- [✅] Demo mode offline com dados mockados
- [✅] Design system enterprise (sidebar escura, fonte Inter, paleta slate)
- [✅] Responsividade mobile
- [✅] Toasts e estados de loading
- [✅] Testes E2E com Playwright

## 5. Arquitetura

O projeto segue uma estrutura orientada a features, separando domínios como auth, leads, kanban, campanhas, funnel, dashboard e configurações.

- **Feature-based folders**: cada área concentra actions, queries, componentes e schemas.
- **Multi-tenancy por workspace**: todo dado pertence a um `workspace_id`.
- **RLS**: o banco aplica políticas para impedir acesso fora do workspace.
- **Server Actions**: todas as mutations usam Next.js Server Actions.
- **Edge Functions**: lógica de IA roda no edge do Supabase (Deno).

## 6. Banco de Dados

| Tabela | Descrição |
|---|---|
| `workspaces` | Workspaces da equipe |
| `workspace_members` | Membros e papéis no workspace |
| `funnel_stages` | Etapas do funil/Kanban |
| `leads` | Leads e dados principais |
| `custom_fields` | Campos personalizados do workspace |
| `lead_custom_values` | Valores dos campos personalizados por lead |
| `stage_required_fields` | Regras de obrigatoriedade por etapa |
| `campaigns` | Campanhas e contexto de abordagem |
| `generated_messages` | Mensagens geradas pela IA |
| `lead_activities` | Histórico de eventos do lead |

## 7. RLS

O projeto usa **Row Level Security** para isolar dados por workspace. As políticas garantem que usuários só leiam/escrevam registros do workspace ao qual pertencem.

## 8. Integração com IA

A Edge Function `generate-messages` recebe o lead e a campanha, valida autenticação, confirma membership no workspace e então chama a API de LLM usando a chave armazenada no ambiente do Supabase.

A chave da IA não fica exposta no frontend. Em caso de falha ou ausência de configuração, a função usa um fallback local para manter o fluxo de demonstração.

## 9. Como rodar localmente

```bash
git clone <URL_DO_REPOSITORIO>
cd sdrflow
pnpm install
```

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

2. Configure as variáveis do Supabase em `.env.local`.
3. Se não quiser conectar ao Supabase ainda, rode em **demo mode**: a UI carrega com dados simulados/fallbacks. As ações persistentes dependem do backend configurado.
4. Aplique as migrations no projeto do Supabase.
5. Inicie a aplicação:

```bash
pnpm dev
```

## 10. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---:|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública/anon para o frontend |
| `NEXT_PUBLIC_APP_URL` | Sim | URL base da aplicação local ou produção |
| `SUPABASE_SERVICE_ROLE_KEY` | Não no frontend | Usada apenas em ambiente seguro/Edge Functions |
| `LLM_API_KEY` | Não no frontend | Chave da API de IA usada só no backend/Edge Functions |
| `LLM_MODEL` | Opcional | Modelo padrão da geração |
| `LLM_BASE_URL` | Opcional | Base URL do provedor de IA |

## 11. Deploy

- **Produção**: [https://sdrflow.vercel.app](https://sdrflow.vercel.app)
- **Vercel**: conecte o repositório, configure as variáveis públicas e faça deploy.
- **Supabase**: aplique schema, policies, Edge Functions e variáveis secretas no dashboard.

## 12. Uso de IA no Desenvolvimento

Este projeto contou com apoio de **Claude Code**, **Codex** e **OpenCode** durante o desenvolvimento, documentação e revisão.

## 13. Checklist Obrigatório

- [✅] Autenticação funcionando
- [✅] Workspace com multi-tenancy
- [✅] Leads CRUD completo
- [✅] Kanban com drag-and-drop
- [✅] Campos personalizados
- [✅] Regras por etapa
- [✅] Campanhas de abordagem
- [✅] Geração de mensagens com IA
- [✅] Envio simulado
- [✅] Dashboard com métricas
- [✅] RLS habilitado
- [✅] Edge Functions ativas
- [✅] README documentando o projeto
- [✅] Checklist de QA mantido
- [✅] Landing page
- [✅] Design system enterprise

## 14. Screenshots

<!--
Adicionar aqui capturas de tela da aplicação:
- Login
- Dashboard
- Kanban
- Leads
- Campanhas
- Configurações
-->
