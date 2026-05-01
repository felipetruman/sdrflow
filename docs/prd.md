# PRD Completo | SDRFlow AI

## 1. Sumário executivo

O **SDRFlow AI** é um Mini CRM para equipes de pré-vendas SDR, com gestão de leads em Kanban, workspaces isolados, campanhas de abordagem e geração de mensagens personalizadas com IA.

O objetivo do projeto é entregar uma aplicação funcional, segura e bem documentada para a prova técnica de Desenvolvedor Vibe Coding Full Stack, demonstrando domínio de arquitetura, Supabase, banco relacional, autenticação, Edge Functions, integração com LLM e uso produtivo de agentes de IA no desenvolvimento.

## 2. Descrição curta

Mini CRM SDR com Kanban, workspaces, leads, campanhas e geração de mensagens personalizadas por IA.

## 3. Objetivo do produto

Ajudar SDRs e equipes de pré-vendas a:

1. Organizar leads em um funil visual.
2. Manter dados importantes de cada lead.
3. Criar campanhas com contexto comercial.
4. Gerar mensagens personalizadas com IA.
5. Registrar histórico de atividades e mensagens.
6. Garantir qualidade mínima dos dados antes de avançar etapas.

## 4. Problema que resolve

Equipes de SDR precisam lidar com muitos leads, manter informações atualizadas e criar abordagens personalizadas em escala. Sem um sistema centralizado, o processo fica manual, disperso e sujeito a perda de contexto.

O SDRFlow AI resolve isso unindo:

1. Gestão de leads.
2. Funil Kanban.
3. Workspaces isolados.
4. Campos personalizados.
5. Campanhas de abordagem.
6. Geração de mensagens com IA.
7. Histórico de mensagens e atividades.

## 5. Público-alvo

1. SDRs.
2. Gestores de pré-vendas.
3. Pequenas equipes comerciais.
4. Empresas B2B.
5. Times que fazem prospecção consultiva.

## 6. Premissa principal

Um lead só deve receber uma abordagem realmente personalizada quando o sistema tiver contexto suficiente sobre ele e sobre a campanha.

Por isso, o produto combina três blocos:

1. **Organização comercial**: leads em funil Kanban.
2. **Qualidade de dados**: campos personalizados e campos obrigatórios por etapa.
3. **Produtividade com IA**: geração de mensagens com base nos dados do lead e no contexto da campanha.

## 7. Escopo obrigatório

O projeto deve incluir obrigatoriamente:

1. CRM SDR.
2. Workspaces.
3. Leads.
4. Kanban.
5. Campanhas.
6. Geração de mensagens com IA.
7. Supabase Auth.
8. Supabase PostgreSQL.
9. Supabase Edge Functions.
10. Controle de acesso por workspace.
11. Dashboard básico.
12. Deploy.
13. GitHub.
14. README.
15. Vídeo de apresentação.

## 8. Escopo diferencial escolhido

Para aumentar a pontuação sem comprometer a entrega, os diferenciais escolhidos são:

1. RLS bem implementado.
2. Histórico de atividades.
3. Histórico de mensagens geradas e enviadas.
4. Campos obrigatórios por etapa do funil.
5. Geração automática por etapa gatilho.
6. Busca e filtros.
7. Métricas extras no dashboard.

## 9. Fora do escopo

Não será implementado nesta versão:

1. Integração real com WhatsApp.
2. Envio real de mensagens.
3. Billing.
4. Convite avançado de usuários.
5. CRM completo de vendas.
6. Automação multicanal.
7. Pipeline comercial complexo.
8. Integração com email.
9. Integração com calendário.

## 10. Stack técnica

### Frontend

1. Next.js.
2. TypeScript.
3. Tailwind CSS.
4. shadcn/ui.
5. dnd-kit para Kanban.
6. React Hook Form.
7. Zod.

### Backend

1. Supabase Edge Functions.
2. TypeScript.
3. Supabase Service Role somente em ambiente seguro.

### Banco de dados

1. Supabase PostgreSQL.
2. Row Level Security.
3. Migrations SQL versionadas.

### Autenticação

1. Supabase Auth.
2. Sessão persistente.
3. Rotas protegidas.

### IA

1. API de LLM chamada via Edge Function.
2. Chave da IA somente no ambiente do Supabase.
3. Retorno estruturado em JSON.

### Deploy e versionamento

1. GitHub.
2. Vercel.
3. Supabase.

### Agentes de desenvolvimento

1. OpenCode como agente principal.
2. Claude Code para implementação e UI.
3. Codex para revisão, refatoração e validação técnica.

## 11. Decisão central de arquitetura

A arquitetura será centrada em **multi-tenancy por workspace**.

Cada entidade operacional pertence a um `workspace_id`:

1. Leads.
2. Campanhas.
3. Etapas do funil.
4. Campos personalizados.
5. Mensagens geradas.
6. Atividades.
7. Configurações de campos obrigatórios.

Essa decisão facilita isolamento de dados, aplicação de RLS e defesa técnica do projeto.

## 12. Frase de defesa da arquitetura

Escolhi uma arquitetura centrada em workspace porque o principal risco de um CRM multiusuário é vazamento de dados entre equipes. Por isso, todas as entidades principais carregam `workspace_id`, e o Supabase RLS valida acesso diretamente no banco. A geração de IA fica em Edge Function para proteger a chave da LLM, controlar o prompt e salvar histórico das mensagens geradas. O frontend fica focado na experiência do SDR: Kanban, leads, campanhas e ações rápidas.

## 13. Fluxo principal do produto

1. Usuário cria conta ou faz login.
2. Usuário cria um workspace.
3. O sistema cria o funil SDR padrão.
4. Usuário cadastra leads.
5. Leads aparecem no Kanban.
6. Usuário cria uma campanha com contexto e prompt.
7. Usuário abre um lead.
8. Usuário seleciona uma campanha.
9. Sistema gera 3 mensagens com IA.
10. Usuário copia ou envia uma mensagem simulada.
11. Ao enviar, o lead é movido para **Tentando Contato**.
12. A ação fica registrada no histórico.
13. O dashboard atualiza as métricas.

## 14. Requisitos funcionais

## 14.1 Autenticação

### RF-AUTH-01 | Cadastro

O usuário deve conseguir criar uma conta com email e senha via Supabase Auth.

Critérios de aceite:

1. Usuário consegue se cadastrar.
2. Usuário autenticado é redirecionado para a aplicação.
3. Usuário não autenticado não acessa páginas internas.

### RF-AUTH-02 | Login

O usuário deve conseguir entrar com email e senha.

Critérios de aceite:

1. Login válido abre a aplicação.
2. Login inválido exibe mensagem de erro.
3. Sessão persiste ao recarregar a página.

### RF-AUTH-03 | Logout

O usuário deve conseguir sair da conta.

Critérios de aceite:

1. Sessão é encerrada.
2. Usuário volta para tela de login.
3. Rotas protegidas deixam de ser acessíveis.

## 14.2 Workspaces

### RF-WS-01 | Criar workspace

Cada usuário deve ter ao menos um workspace, representando uma empresa ou equipe.

Critérios de aceite:

1. Usuário consegue criar workspace no primeiro acesso.
2. Workspace fica associado ao usuário.
3. Usuário criador vira admin.
4. Sistema cria etapas padrão do funil.

### RF-WS-02 | Isolamento por workspace

Todos os dados da aplicação devem pertencer a um workspace.

Critérios de aceite:

1. Usuário só visualiza dados do workspace em que é membro.
2. Queries filtram dados por workspace.
3. RLS impede acesso indevido mesmo se alguém manipular chamadas no frontend.

## 14.3 Leads

### RF-LEAD-01 | Criar lead

O usuário deve conseguir cadastrar leads com campos padrão.

Campos padrão:

1. Nome.
2. Email.
3. Telefone.
4. Empresa.
5. Cargo.
6. Origem do lead.
7. Observações.
8. Etapa do funil.
9. Responsável.

Critérios de aceite:

1. Lead é salvo no workspace correto.
2. Lead aparece no Kanban na etapa selecionada.
3. Campos obrigatórios básicos são validados.

### RF-LEAD-02 | Editar lead

O usuário deve conseguir editar dados do lead.

Critérios de aceite:

1. Alterações são persistidas.
2. Campos padrão e personalizados podem ser atualizados.
3. Edição gera registro no histórico.

### RF-LEAD-03 | Visualizar detalhes do lead

A tela de detalhes deve exibir:

1. Dados padrão.
2. Campos personalizados.
3. Etapa atual.
4. Responsável.
5. Mensagens geradas.
6. Histórico de mensagens enviadas.
7. Histórico de atividades.

### RF-LEAD-04 | Responsável pelo lead

O lead pode ter um responsável opcional do workspace.

Critérios de aceite:

1. Responsável é opcional.
2. Lista de responsáveis mostra membros do workspace.
3. Alteração de responsável é salva.
4. Alteração gera histórico.

### RF-LEAD-05 | Buscar e filtrar leads

O usuário deve conseguir buscar leads por nome, empresa ou email e filtrar por etapa ou responsável.

Critérios de aceite:

1. Busca retorna resultados corretos.
2. Filtro por etapa funciona.
3. Filtro por responsável funciona.
4. Kanban reflete os filtros aplicados.

## 14.4 Campos personalizados

### RF-CF-01 | Criar campos personalizados

O usuário deve criar campos adicionais para o workspace.

Tipos suportados:

1. Texto.
2. Número.
3. Data.
4. Booleano.
5. Lista simples.

Critérios de aceite:

1. Campo criado fica disponível para todos os leads do workspace.
2. Campo aparece no formulário de criação e edição de leads.
3. Valor do campo é salvo por lead.

### RF-CF-02 | Usar campos personalizados na IA

A geração de mensagens deve considerar campos personalizados preenchidos no lead.

Critérios de aceite:

1. Payload enviado à Edge Function inclui campos personalizados.
2. Prompt final da IA contém os campos relevantes.
3. Mensagens refletem dados personalizados quando disponíveis.

## 14.5 Funil e Kanban

### RF-KANBAN-01 | Etapas padrão

Ao criar um workspace, o sistema deve criar as etapas padrão:

1. Base.
2. Lead Mapeado.
3. Tentando Contato.
4. Conexão Iniciada.
5. Desqualificado.
6. Qualificado.
7. Reunião Agendada.

Critérios de aceite:

1. Etapas aparecem em ordem no Kanban.
2. Cada lead aparece na etapa correta.
3. Etapas pertencem ao workspace.

### RF-KANBAN-02 | Visualizar Kanban

O usuário deve visualizar leads organizados por etapa.

Critérios de aceite:

1. Cada coluna representa uma etapa.
2. Cada card representa um lead.
3. O card mostra nome, empresa, cargo, responsável e origem.
4. Clicar no card abre detalhes do lead.

### RF-KANBAN-03 | Mover lead entre etapas

O usuário deve mover um lead entre etapas usando drag and drop ou ação equivalente.

Critérios de aceite:

1. Lead muda de coluna.
2. Nova etapa é persistida.
3. Mudança gera histórico.
4. Antes de mover, o sistema valida campos obrigatórios da etapa de destino.

## 14.6 Regras de transição

### RF-TRANS-01 | Configurar campos obrigatórios por etapa

O usuário deve definir quais campos são obrigatórios para um lead entrar em determinada etapa.

Campos elegíveis:

1. Campos padrão.
2. Campos personalizados.

Critérios de aceite:

1. Configuração é salva por etapa.
2. Usuário marca e desmarca campos obrigatórios.
3. Configuração respeita o workspace atual.

### RF-TRANS-02 | Bloquear movimentação sem dados obrigatórios

Ao tentar mover um lead para uma etapa com campos obrigatórios, o sistema deve validar se todos estão preenchidos.

Critérios de aceite:

1. Se todos os campos estiverem preenchidos, movimento é permitido.
2. Se algum campo estiver vazio, movimento é bloqueado.
3. Sistema informa exatamente quais campos estão faltando.
4. Validação funciona com campos padrão e personalizados.

## 14.7 Campanhas

### RF-CAMP-01 | Criar campanha

O usuário deve conseguir criar campanhas de abordagem.

Campos da campanha:

1. Nome.
2. Status ativo ou inativo.
3. Contexto da campanha.
4. Prompt de geração.
5. Etapa gatilho opcional.

Critérios de aceite:

1. Campanha é salva no workspace correto.
2. Campanha ativa aparece na seleção dentro do lead.
3. Campanha inativa não aparece para geração.

### RF-CAMP-02 | Editar campanha

O usuário deve editar contexto, prompt, status e etapa gatilho.

Critérios de aceite:

1. Alterações são salvas.
2. Gerações futuras usam a versão atualizada.
3. Mensagens antigas permanecem no histórico.

## 14.8 Geração de mensagens com IA

### RF-AI-01 | Gerar mensagens no detalhe do lead

Ao acessar um lead, o usuário deve selecionar uma campanha ativa e gerar sugestões de mensagens personalizadas.

Critérios de aceite:

1. Usuário seleciona campanha.
2. Sistema chama Edge Function.
3. IA retorna 3 variações.
4. Mensagens são exibidas na tela.
5. Mensagens são salvas associadas ao lead e à campanha.

### RF-AI-02 | Dados considerados na geração

A geração deve considerar:

1. Dados padrão do lead.
2. Campos personalizados do lead.
3. Contexto da campanha.
4. Prompt da campanha.
5. Nome do workspace, se disponível.

### RF-AI-03 | Regenerar mensagens

O usuário deve poder gerar novas sugestões a qualquer momento.

Critérios de aceite:

1. Nova chamada gera novas variações.
2. Mensagens anteriores permanecem no histórico.
3. Sistema identifica mensagens mais recentes.

### RF-AI-04 | Copiar mensagem

O usuário deve conseguir copiar uma mensagem gerada.

Critérios de aceite:

1. Clique em copiar envia texto para área de transferência.
2. Interface mostra feedback de sucesso.

### RF-AI-05 | Envio simulado

O usuário deve clicar em enviar em uma mensagem gerada.

Critérios de aceite:

1. Mensagem é marcada como enviada.
2. Envio fica salvo no histórico.
3. Lead é movido automaticamente para **Tentando Contato**.
4. Ação gera histórico de atividade.

## 14.9 Geração automática por etapa gatilho

### RF-TRIGGER-01 | Vincular campanha a etapa gatilho

Campanha pode ter etapa gatilho opcional.

Critérios de aceite:

1. Usuário seleciona uma etapa do funil na campanha.
2. Campanha fica vinculada à etapa.
3. Campanha sem gatilho continua disponível para geração manual.

### RF-TRIGGER-02 | Gerar mensagens ao mover lead para etapa gatilho

Quando um lead for movido para uma etapa que possui campanha ativa vinculada, o sistema deve gerar mensagens automaticamente.

Critérios de aceite:

1. Sistema identifica campanhas ativas com a etapa gatilho.
2. Gera mensagens para o lead.
3. Mensagens ficam salvas para visualização futura.
4. Processo não bloqueia a experiência principal.
5. Falhas são registradas sem quebrar a movimentação.

### RF-TRIGGER-03 | Gerar mensagens ao criar lead direto na etapa gatilho

Quando um lead for criado diretamente em uma etapa gatilho, o sistema deve gerar mensagens automaticamente.

Critérios de aceite:

1. Sistema detecta a etapa inicial do lead.
2. Se houver campanha ativa vinculada, gera mensagens.
3. Mensagens ficam disponíveis no detalhe do lead.

## 14.10 Dashboard

### RF-DASH-01 | Métricas básicas

O dashboard deve mostrar uma visão geral do workspace.

Métricas obrigatórias:

1. Total de leads cadastrados.
2. Quantidade de leads por etapa.
3. Total de campanhas ativas.
4. Total de mensagens geradas.
5. Total de mensagens enviadas.

Critérios de aceite:

1. Métricas carregam por workspace.
2. Números refletem dados reais do banco.
3. Usuário não vê dados de outro workspace.

## 14.11 Histórico de atividades

### RF-ACT-01 | Registrar atividades relevantes

O sistema deve registrar ações importantes realizadas no lead.

Atividades registradas:

1. Lead criado.
2. Lead editado.
3. Lead movido entre etapas.
4. Responsável alterado.
5. Mensagem gerada.
6. Mensagem copiada.
7. Mensagem enviada.
8. Falha na geração automática.

Critérios de aceite:

1. Histórico aparece no detalhe do lead.
2. Cada registro possui data, tipo de ação e usuário responsável quando aplicável.
3. Histórico respeita isolamento por workspace.

## 15. Requisitos não funcionais

### RNF-01 | Segurança

1. Todas as tabelas sensíveis devem usar RLS.
2. Usuário só acessa dados de workspaces onde é membro.
3. Chaves sensíveis ficam em variáveis de ambiente.
4. Chave da LLM nunca fica exposta no frontend.
5. Service Role nunca fica exposta no frontend.

### RNF-02 | Performance

1. Dashboard deve carregar rapidamente para dados de demonstração.
2. Kanban deve funcionar bem com dezenas ou centenas de leads.
3. Geração de IA deve exibir loading e não travar a interface.

### RNF-03 | Usabilidade

1. Interface clara e objetiva.
2. Empty states em telas sem dados.
3. Feedback visual para salvar, gerar, copiar e enviar.
4. Erros explicados em linguagem simples.

### RNF-04 | Manutenibilidade

1. Código organizado por domínio.
2. Componentes reutilizáveis.
3. Tipos TypeScript bem definidos.
4. Queries e mutations separadas.
5. Edge Functions com responsabilidades claras.

### RNF-05 | Auditabilidade

1. Atividades críticas ficam registradas.
2. Mensagens geradas e enviadas ficam salvas.
3. README explica decisões técnicas.

## 16. Arquitetura do sistema

### Frontend

Responsável por:

1. Login e sessão.
2. Navegação.
3. Kanban.
4. Formulários.
5. Dashboard.
6. Chamada segura para Edge Functions.
7. Exibição de dados autorizados.

### Supabase Auth

Responsável por:

1. Cadastro.
2. Login.
3. Sessão.
4. Identidade do usuário para RLS.

### Supabase PostgreSQL

Responsável por:

1. Persistência dos dados.
2. Relacionamentos.
3. Regras de integridade.
4. RLS.

### Supabase Edge Functions

Responsável por:

1. Geração de mensagens com IA.
2. Montagem do prompt final.
3. Comunicação com a LLM.
4. Salvamento das mensagens geradas.
5. Envio simulado.
6. Movimentação com validação.
7. Registro de falhas.

### LLM externa

Responsável por:

1. Receber contexto estruturado.
2. Gerar variações de mensagens.
3. Retornar resposta em formato JSON válido.

## 17. Modelo de dados

### `workspaces`

Representa uma empresa, equipe ou ambiente de trabalho.

Campos principais:

1. `id`.
2. `name`.
3. `created_by`.
4. `created_at`.
5. `updated_at`.

### `workspace_members`

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

### `funnel_stages`

Representa as etapas do funil SDR.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `name`.
4. `position`.
5. `color`.
6. `is_default`.
7. `created_at`.
8. `updated_at`.

### `leads`

Representa os leads cadastrados.

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

### `custom_fields`

Define campos personalizados disponíveis para todos os leads de um workspace.

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

### `lead_custom_values`

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

### `stage_required_fields`

Define quais campos são obrigatórios para entrada em cada etapa.

Campos principais:

1. `id`.
2. `workspace_id`.
3. `stage_id`.
4. `field_type`.
5. `standard_field_key`.
6. `custom_field_id`.
7. `created_at`.

### `campaigns`

Armazena campanhas usadas na geração de mensagens.

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

### `generated_messages`

Salva mensagens geradas e enviadas.

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

### `lead_activities`

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

## 18. Decisões de banco

### Por que usar `workspace_id` em todas as entidades operacionais

Para simplificar o isolamento de dados e permitir policies RLS consistentes.

### Por que não guardar tudo em JSONB

JSONB seria flexível, mas dificultaria validação, filtros, campos obrigatórios e explicação técnica. O projeto usa JSONB apenas onde faz sentido:

1. `custom_fields.options`.
2. `lead_activities.metadata`.

### Por que separar `custom_fields` de `lead_custom_values`

Porque a definição do campo pertence ao workspace, enquanto o valor pertence ao lead. Isso permite criar campos personalizados sem alterar o schema do banco.

### Por que salvar mensagens geradas

Para permitir histórico, regeneração, envio simulado, métricas e rastreabilidade.

## 19. RLS e segurança

Regra central:

```sql
exists (
  select 1
  from workspace_members wm
  where wm.workspace_id = table.workspace_id
  and wm.user_id = auth.uid()
)
```

Tabelas com RLS obrigatório:

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

Decisões:

1. Frontend usa Supabase Client com sessão do usuário.
2. Operações sensíveis respeitam RLS.
3. Edge Functions validam se usuário pertence ao workspace.
4. Service Role só pode ser usado em ambiente server-side controlado.
5. Chaves de IA ficam somente no ambiente do Supabase.

## 20. Edge Functions

## 20.1 `generate-messages`

Responsabilidade:

Gerar mensagens personalizadas para um lead com base em uma campanha.

Entrada:

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "campaignId": "uuid",
  "generationType": "manual"
}
```

Processamento:

1. Validar usuário autenticado.
2. Validar se usuário pertence ao workspace.
3. Buscar lead.
4. Buscar campanha ativa.
5. Buscar campos personalizados do lead.
6. Montar prompt estruturado.
7. Chamar LLM.
8. Validar retorno.
9. Salvar mensagens em `generated_messages`.
10. Registrar atividade.
11. Retornar mensagens geradas.

## 20.2 `move-lead-stage`

Responsabilidade:

Mover um lead entre etapas validando campos obrigatórios.

Entrada:

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "targetStageId": "uuid"
}
```

Processamento:

1. Validar usuário autenticado.
2. Validar acesso ao workspace.
3. Buscar lead.
4. Buscar etapa de destino.
5. Validar campos obrigatórios.
6. Se faltar campo, retornar lista de campos faltantes.
7. Se estiver completo, atualizar etapa.
8. Registrar atividade.
9. Verificar etapa gatilho.

## 20.3 `send-message-simulated`

Responsabilidade:

Marcar uma mensagem como enviada e mover o lead para **Tentando Contato**.

Entrada:

```json
{
  "workspaceId": "uuid",
  "messageId": "uuid"
}
```

Processamento:

1. Validar usuário autenticado.
2. Validar acesso ao workspace.
3. Buscar mensagem.
4. Marcar mensagem como `sent`.
5. Atualizar `sent_at`.
6. Buscar etapa **Tentando Contato**.
7. Atualizar etapa do lead.
8. Registrar atividades.

## 20.4 `trigger-generate-messages`

Responsabilidade:

Gerar mensagens automaticamente quando um lead entra em etapa gatilho.

Entrada:

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "stageId": "uuid"
}
```

Processamento:

1. Buscar campanhas ativas com `trigger_stage_id` igual à etapa.
2. Para cada campanha, gerar mensagens.
3. Salvar mensagens como `generation_type = trigger`.
4. Registrar atividade.
5. Registrar falhas sem quebrar fluxo principal.

## 21. Prompt de IA

Estrutura do prompt enviado à LLM:

```text
Você é um especialista em pré-vendas B2B e copywriting consultivo.

Objetivo:
Gerar exatamente 3 variações de mensagens personalizadas para abordagem de um lead.

Contexto da campanha:
{{campaign.context}}

Instruções da campanha:
{{campaign.generation_prompt}}

Dados do lead:
Nome: {{lead.name}}
Empresa: {{lead.company}}
Cargo: {{lead.job_title}}
Email: {{lead.email}}
Telefone: {{lead.phone}}
Origem: {{lead.lead_source}}
Observações: {{lead.notes}}

Campos personalizados:
{{custom_fields}}

Regras:
1. Não invente dados ausentes.
2. Use apenas informações disponíveis.
3. Personalize a mensagem quando houver contexto suficiente.
4. Mantenha o tom definido na campanha.
5. Retorne apenas JSON válido.

Formato obrigatório:
{
  "messages": [
    {
      "variationIndex": 1,
      "content": "..."
    },
    {
      "variationIndex": 2,
      "content": "..."
    },
    {
      "variationIndex": 3,
      "content": "..."
    }
  ]
}
```

## 22. Telas da aplicação

### 22.1 Login

Elementos:

1. Email.
2. Senha.
3. Botão entrar.
4. Link para cadastro.
5. Mensagem de erro.

### 22.2 Cadastro

Elementos:

1. Nome.
2. Email.
3. Senha.
4. Botão criar conta.
5. Redirecionamento para criação de workspace.

### 22.3 Onboarding de workspace

Elementos:

1. Nome da empresa/equipe.
2. Botão criar workspace.

Ao criar:

1. Criar workspace.
2. Criar membership admin.
3. Criar etapas padrão.
4. Redirecionar para dashboard.

### 22.4 Dashboard

Elementos:

1. Cards de métricas.
2. Lista ou gráfico de leads por etapa.
3. Atalhos para Kanban, Leads e Campanhas.

### 22.5 Kanban

Elementos:

1. Colunas por etapa.
2. Cards de leads.
3. Busca.
4. Filtro por responsável.
5. Botão novo lead.
6. Drag and drop.

### 22.6 Detalhe do lead

Elementos:

1. Dados do lead.
2. Campos personalizados.
3. Responsável.
4. Etapa atual.
5. Seleção de campanha.
6. Botão gerar mensagens.
7. Lista de mensagens geradas.
8. Botão copiar.
9. Botão enviar.
10. Histórico de atividades.

### 22.7 Campanhas

Elementos:

1. Lista de campanhas.
2. Status ativo ou inativo.
3. Botão nova campanha.
4. Formulário com nome, contexto, prompt e etapa gatilho.

### 22.8 Configurações de campos personalizados

Elementos:

1. Lista de campos.
2. Criar campo.
3. Nome do campo.
4. Tipo do campo.
5. Opções para lista simples.

### 22.9 Configurações do funil

Elementos:

1. Lista de etapas.
2. Campos obrigatórios por etapa.
3. Seleção de campos padrão.
4. Seleção de campos personalizados.
5. Salvar configurações.

## 23. Estrutura de pastas

```txt
sdrflow-ai/
  app/
    (auth)/
      login/
      signup/
    (app)/
      dashboard/
      kanban/
      leads/[leadId]/
      campaigns/
      settings/fields/
      settings/funnel/
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
  supabase/
    migrations/
    functions/
  docs/
    PRD.md
    ARCHITECTURE.md
    DATABASE.md
    EDGE_FUNCTIONS.md
    TASKS.md
    VIDEO_SCRIPT.md
  README.md
  .env.example
```

## 24. Padrões de código

### Componentes

PascalCase:

```txt
LeadForm.tsx
KanbanBoard.tsx
CampaignForm.tsx
```

### Actions

Com verbo:

```txt
createLead.ts
updateLead.ts
generateMessages.ts
sendSimulatedMessage.ts
```

### Queries

Prefixo `get`:

```txt
getLeads.ts
getCampaigns.ts
getDashboardMetrics.ts
```

### Hooks

Prefixo `use`:

```txt
useKanbanDnD.ts
```

## 25. Critérios de pronto

O projeto será considerado pronto quando:

1. Usuário consegue se cadastrar e fazer login.
2. Usuário consegue criar workspace.
3. Sistema cria etapas padrão.
4. Usuário consegue criar lead.
5. Lead aparece no Kanban.
6. Usuário consegue mover lead entre etapas.
7. Sistema valida campos obrigatórios por etapa.
8. Usuário consegue criar campos personalizados.
9. Campos personalizados aparecem no lead.
10. Usuário consegue criar campanha.
11. Usuário consegue gerar 3 mensagens com IA.
12. Mensagens ficam salvas no histórico.
13. Usuário consegue copiar mensagem.
14. Usuário consegue enviar mensagem simulada.
15. Envio move lead para **Tentando Contato**.
16. Dashboard mostra métricas básicas.
17. Dados são isolados por workspace.
18. RLS está ativo e funcional.
19. Aplicação está publicada na Vercel.
20. README explica decisões técnicas.
21. Vídeo de até 10 minutos demonstra o fluxo principal.

## 26. Plano de execução

### Fase 0 | Setup

1. Criar repositório GitHub.
2. Criar projeto Next.js.
3. Configurar Tailwind.
4. Configurar shadcn/ui.
5. Configurar Supabase client.
6. Criar estrutura de pastas.
7. Criar `.env.example`.
8. Criar `docs/`.

### Fase 1 | Supabase e banco

1. Criar migrations.
2. Criar tabelas.
3. Criar índices.
4. Criar função `is_workspace_member`.
5. Ativar RLS.
6. Criar policies.
7. Criar RPC `create_workspace_with_defaults`.

### Fase 2 | Auth

1. Login.
2. Cadastro.
3. Logout.
4. Proteção de rotas.
5. Middleware de sessão.

### Fase 3 | Workspace

1. Criar workspace.
2. Criar membro admin.
3. Criar funil padrão.
4. Criar WorkspaceGuard.

### Fase 4 | Leads

1. CRUD de leads.
2. Detalhe do lead.
3. Responsável opcional.
4. Histórico básico.

### Fase 5 | Kanban

1. Colunas por etapa.
2. Cards de leads.
3. Drag and drop.
4. Edge Function `move-lead-stage`.

### Fase 6 | Campos personalizados

1. Criar campos.
2. Preencher valores no lead.
3. Exibir no detalhe.
4. Enviar para IA.

### Fase 7 | Regras de etapa

1. Configurar campos obrigatórios por etapa.
2. Validar antes de mover lead.
3. Exibir campos faltantes.

### Fase 8 | Campanhas

1. CRUD de campanhas.
2. Contexto.
3. Prompt.
4. Status.
5. Etapa gatilho.

### Fase 9 | IA

1. Edge Function `generate-messages`.
2. Prompt estruturado.
3. Chamada de LLM.
4. Salvar mensagens.
5. Exibir no lead.

### Fase 10 | Envio simulado

1. Copiar mensagem.
2. Enviar mensagem simulada.
3. Marcar como enviada.
4. Mover para **Tentando Contato**.

### Fase 11 | Diferenciais

1. Histórico de atividades.
2. Histórico de mensagens.
3. Gatilho automático.
4. Busca e filtros.
5. Métricas extras.

### Fase 12 | Deploy e entrega

1. Deploy Vercel.
2. Deploy Edge Functions.
3. README final.
4. Vídeo.
5. Checklist final.

## 27. README obrigatório

O README deve conter:

1. Nome do projeto.
2. Descrição curta.
3. Link da aplicação publicada.
4. Link do vídeo.
5. Tecnologias utilizadas.
6. Funcionalidades implementadas.
7. Como rodar localmente.
8. Variáveis de ambiente.
9. Como aplicar migrations.
10. Como fazer deploy das Edge Functions.
11. Decisões técnicas.
12. Arquitetura.
13. Banco de dados.
14. RLS.
15. Integração com IA.
16. Multi-tenancy.
17. Funcionalidades obrigatórias.
18. Diferenciais implementados.
19. Uso de IA no desenvolvimento.
20. Desafios encontrados.

## 28. Roteiro do vídeo

Tempo máximo: 10 minutos.

### Parte 1 | Introdução

Duração: 30 segundos.

Falar:

1. Nome do projeto.
2. Objetivo.
3. Stack usada.

### Parte 2 | Fluxo principal

Duração: 4 minutos.

Demonstrar:

1. Login.
2. Workspace.
3. Dashboard.
4. Criar lead.
5. Visualizar no Kanban.
6. Criar ou selecionar campanha.
7. Gerar mensagens com IA.
8. Enviar mensagem simulada.
9. Lead indo para **Tentando Contato**.

### Parte 3 | Diferenciais

Duração: 3 minutos.

Demonstrar:

1. Campos personalizados.
2. Campos obrigatórios por etapa.
3. Gatilho automático.
4. Histórico de atividades.
5. Histórico de mensagens.
6. RLS e isolamento por workspace explicados de forma simples.

### Parte 4 | Decisões técnicas

Duração: 2 minutos.

Explicar:

1. Por que Supabase.
2. Por que Edge Function para IA.
3. Como a chave da LLM fica segura.
4. Como o banco foi estruturado.
5. Como o workspace isola dados.

### Parte 5 | Fechamento

Duração: 30 segundos.

Falar:

1. O que foi implementado.
2. O que poderia evoluir.
3. Onde estão links de app, repositório e README.

## 29. Riscos e controles

### Risco: gastar tempo demais com diferenciais

Controle:

Implementar primeiro o fluxo obrigatório completo. Diferenciais entram apenas depois do fluxo ponta a ponta estar funcionando.

### Risco: RLS travar o desenvolvimento

Controle:

Criar policies simples e testáveis. Validar cada tabela logo após a migration.

### Risco: IA falhar na apresentação

Controle:

1. Criar fallback de erro elegante.
2. Salvar mensagens já geradas.
3. Preparar dados de demonstração.
4. Testar antes de gravar o vídeo.

### Risco: Kanban atrasar

Controle:

Começar com movimentação via botão ou select se drag and drop atrasar. Depois adicionar drag and drop com dnd-kit.

### Risco: escopo visual ficar grande demais

Controle:

Priorizar telas essenciais e componentes reaproveitáveis.

## 30. Checklist final da prova

### Obrigatórios

* [x] Cadastro e login.
* [x] Workspace criado por usuário.
* [x] Dados isolados por workspace.
* [x] Leads com campos padrão.
* [x] Campos personalizados por workspace.
* [x] Responsável opcional pelo lead.
* [x] Kanban por etapas.
* [x] Mover lead entre etapas.
* [x] Detalhe e edição do lead.
* [x] Funil SDR padrão.
* [x] Criar campanhas.
* [x] Contexto da campanha.
* [x] Prompt de geração.
* [x] Gerar 3 mensagens com IA.
* [x] Regenerar mensagens.
* [x] Copiar mensagem.
* [x] Enviar mensagem simulada.
* [x] Ao enviar, mover lead para **Tentando Contato**.
* [x] Configurar campos obrigatórios por etapa.
* [x] Validar campos obrigatórios na movimentação.
* [x] Dashboard básico.
* [x] Supabase Edge Functions.
* [x] Supabase PostgreSQL.
* [x] Supabase Auth.
* [x] GitHub.
* [x] Deploy.
* [x] README.
* [ ] Vídeo de até 10 minutos.

### Diferenciais selecionados

* [x] RLS bem implementado.
* [x] Histórico de atividades.
* [x] Histórico de mensagens enviadas.
* [x] Filtros e busca.
* [x] Geração automática por etapa gatilho.
* [x] Métricas extras no dashboard.

## 31. Frase final de defesa

O SDRFlow AI foi desenvolvido como um CRM SDR focado no fluxo real de pré-vendas: organizar leads, qualificar informações, gerar abordagens personalizadas com IA e registrar o avanço comercial dentro de um workspace seguro e isolado. A arquitetura prioriza clareza, segurança e aderência ao enunciado, usando Supabase Auth, PostgreSQL, RLS e Edge Functions para separar experiência do usuário, regras de negócio e integração com IA.
