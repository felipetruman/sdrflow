## Sumário do Projeto

### Nome do projeto

**SDRFlow AI**

### Descrição curta

O **SDRFlow AI** é um Mini CRM para equipes de pré-vendas que permite organizar leads em um funil Kanban, criar campanhas de abordagem e gerar mensagens personalizadas com IA com base nos dados de cada lead.

### Objetivo

O objetivo do projeto é ajudar SDRs a gerenciar leads com mais organização, garantir qualidade mínima dos dados antes de avançar etapas do funil e acelerar a criação de mensagens comerciais personalizadas usando inteligência artificial.

### Problema que resolve

Equipes de SDR precisam lidar com muitos leads ao mesmo tempo, manter informações atualizadas e criar abordagens personalizadas em escala. Sem um sistema centralizado, o processo fica manual, disperso e sujeito a perda de contexto.

O SDRFlow AI resolve isso unindo:

1. Gestão de leads.
2. Funil visual em Kanban.
3. Campos personalizados por workspace.
4. Campanhas com contexto e prompt.
5. Geração de mensagens com IA.
6. Histórico de ações e mensagens.

### Solução proposta

A aplicação permite que o usuário crie um workspace, cadastre leads, organize esses leads em etapas do funil SDR e crie campanhas de abordagem com contexto específico.

Ao acessar um lead, o usuário pode selecionar uma campanha e gerar 2 a 3 sugestões de mensagens personalizadas usando IA. As mensagens consideram os dados padrão do lead, campos personalizados, contexto da campanha e instruções do prompt.

Ao clicar em “enviar”, o sistema simula o envio da mensagem, registra a ação no histórico e move automaticamente o lead para a etapa **Tentando Contato**, conforme exigido pela prova. 

### Público-alvo

O sistema foi pensado para:

1. SDRs.
2. Gestores de pré-vendas.
3. Pequenas equipes comerciais.
4. Empresas que fazem prospecção consultiva.
5. Times que precisam personalizar abordagens em escala.

### Stack técnica

1. **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui.
2. **Kanban:** dnd-kit.
3. **Autenticação:** Supabase Auth.
4. **Banco de dados:** Supabase PostgreSQL.
5. **Backend:** Supabase Edge Functions.
6. **IA:** API de LLM chamada pelo backend.
7. **Deploy:** Vercel.
8. **Versionamento:** GitHub.
9. **Desenvolvimento assistido por IA:** Claude Code, Codex e OpenCode.

### Decisão central de arquitetura

A arquitetura foi pensada em torno de **multi-tenancy por workspace**.

Cada lead, campanha, etapa do funil, campo personalizado, mensagem gerada e atividade pertence a um workspace. Isso permite isolar dados entre equipes e aplicar regras de segurança com Row Level Security no Supabase.

A geração de mensagens com IA não acontece no frontend. Ela passa por uma Supabase Edge Function para manter a chave da LLM segura, montar o prompt com os dados corretos e salvar o histórico das mensagens geradas.

### Fluxo principal

1. Usuário cria conta ou faz login.
2. Usuário cria um workspace.
3. O sistema cria o funil SDR padrão.
4. Usuário cadastra leads.
5. Leads aparecem no Kanban.
6. Usuário cria uma campanha com contexto e prompt.
7. Usuário abre um lead.
8. Usuário seleciona uma campanha.
9. Sistema gera mensagens com IA.
10. Usuário copia ou envia uma mensagem simulada.
11. Lead é movido para **Tentando Contato**.
12. A ação fica registrada no histórico.

### Diferenciais implementados ou planejados

1. RLS bem implementado.
2. Histórico de atividades do lead.
3. Histórico de mensagens geradas e enviadas.
4. Campos obrigatórios por etapa do funil.
5. Geração automática por etapa gatilho.
6. Busca e filtros no Kanban.
7. Dashboard com métricas básicas.

### Frase de defesa do projeto

O SDRFlow AI foi desenvolvido como um CRM SDR focado no fluxo real de pré-vendas: organizar leads, qualificar informações, gerar abordagens personalizadas com IA e registrar o avanço comercial dentro de um workspace seguro e isolado.
