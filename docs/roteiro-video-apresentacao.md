# Roteiro — Vídeo de Apresentação SDRFlow AI
**Duração total: até 10 minutos**
**Formato: narração + screen recording (localhost:3000 ou sdrflow.vercel.app)**

---

## ESTRUTURA GERAL

| Bloco | Conteúdo | Tempo |
|---|---|---|
| 1. Abertura | Contexto do problema + pitch | 0:00 – 0:45 |
| 2. Visão arquitetural | Stack + decisões técnicas | 0:45 – 1:45 |
| 3. Fluxo principal (demo ao vivo) | Cadastro → lead → IA | 1:45 – 6:30 |
| 4. Diferenciais | Recursos extras entregues | 6:30 – 8:45 |
| 5. Encerramento | Resumo + checklist | 8:45 – 10:00 |

---

## BLOCO 1 — ABERTURA (0:00 – 0:45)

**[Tela: landing page do SDRFlow ou tela inicial da aplicação]**

> "Equipes de SDR perdem horas toda semana fazendo a mesma coisa manualmente: abrindo planilha, copiando dados do lead, abrindo o ChatGPT, adaptando uma mensagem genérica, colando no WhatsApp. E depois repetindo isso para cada lead, sem rastreamento, sem contexto compartilhado, sem escala.
>
> O **SDRFlow AI** resolve esse problema. É um mini CRM de pré-vendas que centraliza a gestão de leads num Kanban com funil visual, conecta a um gerador de mensagens por IA que usa o contexto real de cada lead, e automatiza a movimentação entre etapas.
>
> Vou mostrar em cerca de 10 minutos tudo que foi implementado — tanto os requisitos obrigatórios quanto os diferenciais."

---

## BLOCO 2 — VISÃO ARQUITETURAL (0:45 – 1:45)

**[Tela: pode ser um diagrama simples no Excalidraw, ou o código aberto no editor — mostrando a estrutura de pastas `features/`]**

> "Antes de entrar na demo, 1 minuto de arquitetura — porque as decisões técnicas são parte da avaliação.
>
> **Frontend:** Next.js 15 com App Router. Usei **Server Actions** para todas as mutations — nenhuma chamada de API REST desnecessária no cliente. Estrutura orientada a features: cada domínio — leads, kanban, campanhas, auth — tem seus próprios actions, queries e componentes isolados.
>
> **Backend:** Supabase — Postgres com **RLS** para multi-tenancy, Auth nativo, e 4 **Edge Functions** em Deno para a lógica sensível. A chave da LLM nunca chega ao frontend — fica exclusivamente no ambiente da Edge Function.
>
> **IA:** a integração usa uma API de LLM configurável via variável de ambiente. Se a key não estiver configurada, tem um fallback local para manter o demo funcionando offline.
>
> **Por que feature-based?** Escala. Cada domínio pode crescer sem impactar os outros. E facilita encontrar qualquer coisa rapidamente."

---

## BLOCO 3 — FLUXO PRINCIPAL: DEMO AO VIVO (1:45 – 6:30)

### 3.1 — Cadastro e Login (1:45 – 2:30)

**[Tela: página de signup]**

> "Começando do zero como um usuário novo.
>
> Clico em 'Criar conta', preencho nome, e-mail e senha. [preencher ao vivo]
>
> O Supabase Auth cuida de tudo — confirmação de e-mail, sessão JWT, refresh automático. Também implementei o fluxo de **recuperação de senha** completo: 'Esqueci minha senha' → e-mail com link → formulário de redefinição. Isso está no ar e funcional."

### 3.2 — Criação de Workspace e Onboarding (2:30 – 3:00)

**[Tela: onboarding / criação de workspace]**

> "Após o cadastro, o sistema detecta que o usuário não tem workspace e dispara o onboarding automaticamente.
>
> Dou um nome para o workspace — por exemplo, 'Agência Velocidade'. [criar ao vivo]
>
> A partir daqui, **tudo está isolado por workspace_id**. RLS no banco garante que esse usuário só vê dados deste workspace. Não existe query que traga dados de outro tenant — é imposição no banco, não só no código."

### 3.3 — Dashboard (3:00 – 3:30)

**[Tela: dashboard]**

> "Chegando no Dashboard. Aqui estão as métricas do workspace:
>
> — Total de leads cadastrados
> — Leads por etapa do funil
> — Leads recentes
> — Mensagens geradas
>
> São dados ao vivo do Supabase. Conforme a gente trabalhar na demo, esses números vão mudar."

### 3.4 — Criar um Lead (3:30 – 4:15)

**[Tela: criar novo lead — botão 'Novo Lead' ou via Kanban]**

> "Agora vou cadastrar um lead. [abrir formulário de criação]
>
> Os campos padrão são: nome, e-mail, telefone, empresa, cargo, origem, observações. Mas o sistema também suporta **campos personalizados por workspace** — mostro isso na seção de diferenciais.
>
> [preencher: 'Ricardo Alves', 'Conta Azul', 'Head de Marketing', etc.]
>
> O lead entra no funil na etapa 'Base' — lead recém cadastrado, sem tratamento. [salvar]
>
> Note que também é possível **atribuir um responsável** ao lead — qualquer membro do workspace. Aqui estou atribuindo a mim mesmo."

### 3.5 — Kanban com Drag-and-Drop (4:15 – 5:00)

**[Tela: Kanban]**

> "No Kanban, vejo todos os leads distribuídos pelas 7 etapas do funil.
>
> Para mover o Ricardo de 'Base' para 'Lead Mapeado', simplesmente arrasto o card. [arrastar]
>
> Aqui entra uma feature importante: **regras de transição por etapa**. Eu configurei que 'Lead Mapeado' exige nome, empresa, telefone e cargo preenchidos. Se eu tentar mover um lead com campo faltando, o sistema bloqueia e informa exatamente o que está faltando.
>
> [demonstrar tentando mover lead incompleto → mensagem de erro aparece]
>
> Isso garante qualidade dos dados antes da geração de IA.
>
> Também há **busca, filtros por etapa e por responsável, e ordenação** — estão nesse toolbar aqui em cima."

### 3.6 — Configurar Campanha com Etapa Gatilho (5:00 – 5:45)

**[Tela: página de campanhas → nova campanha]**

> "Vou em Campanhas e crio uma campanha. [abrir formulário]
>
> Nome: 'Abordagem Consultiva Q2'
>
> O campo **Contexto** é onde coloco as informações de produto e oferta que a IA vai usar como base — serviço, diferenciais, período.
>
> O campo **Prompt de geração** são as instruções de estilo: tom de voz consultivo, mensagem curta para LinkedIn, mencionar o nome do lead e a empresa dele.
>
> E aqui o diferencial: **Etapa Gatilho**. Estou vinculando essa campanha à etapa 'Lead Mapeado'. Isso significa que toda vez que um lead chegar nessa etapa, o sistema dispara a geração automática de mensagens em background. [selecionar 'Lead Mapeado']
>
> [salvar campanha]"

### 3.7 — Gerar Mensagem com IA (5:45 – 6:30)

**[Tela: detalhe do lead → painel de mensagens]**

> "Abrindo o detalhe do lead Ricardo. No painel lateral direito, vejo o módulo de IA.
>
> Seleciono a campanha 'Abordagem Consultiva Q2'. Clico em 'Gerar mensagens'. [clicar]
>
> [aguardar resposta da Edge Function — ~2-3 segundos]
>
> O sistema retornou 3 variações de mensagem. Cada uma personalizada com o nome, empresa e cargo do Ricardo, usando o tom e formato que configurei na campanha.
>
> Se eu não gostar de alguma, posso clicar em **Regenerar** para novas sugestões. [demonstrar]
>
> Quando encontrar a certa, clico em **Copiar** — ou em **Enviar** para disparar o fluxo simulado."

**[Tela: clicar em Enviar]**

> "Ao clicar em Enviar: a mensagem fica registrada no histórico, e o lead é **automaticamente movido para 'Tentando Contato'**. Isso é a ação de envio simulado da spec.
>
> [mostrar lead no Kanban tendo mudado de coluna]
>
> Uma movimentação aconteceu automaticamente — sem o usuário precisar ir no Kanban e arrastar."

---

## BLOCO 4 — DIFERENCIAIS (6:30 – 8:45)

### 4.1 — Campos Personalizados (6:30 – 7:10)

**[Tela: Configurações → Campos]**

> "Nas Configurações do workspace, há uma seção de **Campos Personalizados**. Posso adicionar campos extras — tipo 'Faturamento Anual', 'Segmento de Mercado', 'Quantidade de Funcionários'.
>
> [mostrar lista de campos personalizados já criados]
>
> Esses campos ficam disponíveis em todos os leads do workspace, aparecem no formulário de edição, e podem ser referenciados no prompt de campanha para personalização ainda mais rica.
>
> E nas **regras de etapa**, tanto campos padrão quanto personalizados podem ser marcados como obrigatórios — é a tela que vimos antes nas configurações do funil."

### 4.2 — Geração Automática por Etapa Gatilho (7:10 – 7:50)

**[Tela: Kanban — arrastar lead para etapa gatilho]**

> "O diferencial mais relevante: **geração automática por gatilho**.
>
> Vou criar um segundo lead e arrastá-lo direto para 'Lead Mapeado'. [demonstrar]
>
> Nos bastidores, o Server Action chamou a Edge Function `trigger-generate-messages`. Ela verificou se existe alguma campanha com gatilho nessa etapa, e disparou a geração de mensagens em background.
>
> Quando eu abrir esse lead... [abrir lead] ...as mensagens já estão prontas. O SDR não precisou fazer nada — só mover o card, e a IA já trabalhou.
>
> Esse é o diferencial de automação real: escala sem esforço manual."

### 4.3 — Histórico de Atividades (7:50 – 8:20)

**[Tela: detalhe do lead → aba de Atividades]**

> "Cada lead tem um **histórico de atividades** — timeline de eventos: quando foi criado, quando mudou de etapa, quem fez a movimentação, quando uma mensagem foi enviada.
>
> [mostrar timeline ao vivo]
>
> Isso é o diferencial de 'Histórico de atividades' da spec. Também tem o **histórico de mensagens enviadas** — separado das sugestões — registrando exatamente o que foi efetivamente enviado."

### 4.4 — RLS e Segurança (8:20 – 8:45)

**[Tela: pode ser o Supabase dashboard mostrando as policies, ou simplesmente narrar]**

> "Na parte de segurança: **Row Level Security** está ativo em todas as tabelas críticas — leads, campaigns, generated_messages, workspace_members, funnel_stages.
>
> As policies garantem que qualquer SELECT ou INSERT só funciona se o usuário pertencer ao workspace. Isso não é validação no código — é garantia no banco. Um bug no frontend não consegue vazar dados de outro tenant."

---

## BLOCO 5 — ENCERRAMENTO (8:45 – 10:00)

**[Tela: pode voltar ao Dashboard ou mostrar o README aberto no GitHub]**

> "Para resumir o que foi entregue:
>
> **Obrigatórios — todos implementados:**
> — Auth completo com recuperação de senha
> — Multi-tenancy por workspace com RLS
> — Leads CRUD com campos padrão
> — Kanban drag-and-drop com 7 etapas
> — Campos personalizados por workspace
> — Regras de campos obrigatórios por etapa
> — Campanhas com contexto e prompt de IA
> — Geração de mensagens via Edge Function
> — Envio simulado com movimentação automática
> — Dashboard com métricas
>
> **Diferenciais entregues:**
> — Geração automática por etapa gatilho
> — Histórico de atividades e mensagens enviadas
> — Filtros, busca e ordenação no Kanban
> — RLS com políticas completas
> — Demo mode offline para desenvolvimento
> — E2E tests com Playwright cobrindo os fluxos principais
>
> A aplicação está disponível em **sdrflow.vercel.app**. O código está no GitHub público, com histórico de commits mostrando a evolução — cada PR com contexto e revisão documentada.
>
> Obrigado pela avaliação. Estou disponível para qualquer dúvida técnica sobre implementação."

---

## CHECKLIST PRÉ-GRAVAÇÃO

- [ ] App rodando em produção: `https://sdrflow.vercel.app`
- [ ] Conta demo criada com dados pré-populados (leads em etapas diferentes, campanhas configuradas)
- [ ] Campanha com gatilho configurada na etapa 'Lead Mapeado'
- [ ] Campos personalizados criados no workspace demo
- [ ] Lead incompleto preparado para demonstrar bloqueio de etapa
- [ ] Microfone testado
- [ ] Gravador (OBS ou similar) configurado com resolução 1080p
- [ ] Browser sem notificações / modo foco ativo
- [ ] Tamanho de fonte do browser aumentado para legibilidade no vídeo

## DICAS DE GRAVAÇÃO

- Fale em ritmo moderado — o avaliador precisa acompanhar a tela
- Pause 1-2 segundos antes e depois de cada ação clicável para a edição
- Se algo não carregar rápido, não entre em pânico — comente o que está acontecendo
- Prefira mostrar o estado final funcionando a explicar o que "deveria funcionar"
- Corte qualquer pausa longa no pós-edição — o limite é 10 minutos

---

*Gerado em 2026-05-06 para a Prova Técnica — Desenvolvedor Vibe Coding Full Stack*
