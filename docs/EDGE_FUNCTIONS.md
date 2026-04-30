# EDGE FUNCTIONS | SDRFlow AI

## 1. Visão geral

As Supabase Edge Functions concentram as regras sensíveis do SDRFlow AI.

Elas são usadas para:

1. Gerar mensagens com IA.
2. Mover leads entre etapas com validação de campos obrigatórios.
3. Simular envio de mensagem.
4. Gerar mensagens automaticamente por etapa gatilho.

A decisão principal é: o frontend não executa lógica crítica sozinho.

O frontend solicita ações. As Edge Functions validam autenticação, workspace, permissões, dados e persistência.

---

## 2. Por que usar Edge Functions

### Motivos técnicos

1. Proteger a chave da LLM.
2. Proteger a Service Role do Supabase.
3. Centralizar regras críticas.
4. Validar acesso por workspace no backend.
5. Salvar histórico de mensagens e atividades.
6. Padronizar tratamento de erros.
7. Atender ao requisito técnico obrigatório da prova.

### Frase de defesa

> Usei Supabase Edge Functions para manter as regras sensíveis fora do frontend. A geração de IA, movimentação de etapas e envio simulado envolvem validação de workspace, acesso a dados e chaves secretas. Por isso, essas ações rodam no backend, com validações explícitas antes de alterar qualquer dado.

---

## 3. Edge Functions previstas

## Obrigatórias para o MVP

1. `generate-messages`.
2. `move-lead-stage`.
3. `send-message-simulated`.

## Diferencial

4. `trigger-generate-messages`.

---

## 4. Estrutura de pastas

```txt
supabase/
  functions/
    _shared/
      cors.ts
      errors.ts
      supabase.ts
      auth.ts
      workspace.ts
      llm.ts
      prompt.ts
    generate-messages/
      index.ts
    move-lead-stage/
      index.ts
    send-message-simulated/
      index.ts
    trigger-generate-messages/
      index.ts
```

---

## 5. Arquivos compartilhados

## 5.1 `_shared/cors.ts`

Responsável por headers CORS.

```ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
```

## 5.2 `_shared/errors.ts`

Padroniza respostas de erro.

```ts
export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export function errorResponse(message: string, status = 400, extra?: Record<string, unknown>) {
  return jsonResponse(
    {
      success: false,
      error: message,
      ...extra,
    },
    status
  );
}
```

## 5.3 `_shared/supabase.ts`

Cria client server-side da função.

Responsabilidade:

1. Ler `SUPABASE_URL`.
2. Ler `SUPABASE_SERVICE_ROLE_KEY`.
3. Criar client para operações server-side.

## 5.4 `_shared/auth.ts`

Valida o usuário autenticado a partir do JWT enviado pelo frontend.

Responsabilidade:

1. Ler header `Authorization`.
2. Buscar usuário com Supabase Auth.
3. Retornar `user.id`.
4. Bloquear requisição sem sessão.

## 5.5 `_shared/workspace.ts`

Valida se o usuário pertence ao workspace.

Responsabilidade:

1. Receber `workspaceId` e `userId`.
2. Consultar `workspace_members`.
3. Retornar erro se não for membro.

## 5.6 `_shared/llm.ts`

Centraliza chamada à LLM.

Responsabilidade:

1. Ler `LLM_API_KEY`.
2. Ler `LLM_PROVIDER`.
3. Ler `LLM_MODEL`.
4. Enviar prompt.
5. Retornar texto bruto.

## 5.7 `_shared/prompt.ts`

Monta prompt estruturado para geração de mensagens.

Responsabilidade:

1. Receber lead.
2. Receber campanha.
3. Receber campos personalizados.
4. Gerar prompt final.
5. Exigir JSON de saída.

---

## 6. Padrão de autenticação

Todas as funções devem seguir o mesmo padrão:

```text
1. Responder OPTIONS para CORS.
2. Validar método POST.
3. Ler JWT do header Authorization.
4. Validar usuário autenticado.
5. Validar workspaceId no body.
6. Validar se usuário pertence ao workspace.
7. Executar regra de negócio.
8. Retornar JSON.
```

---

## 7. Function `generate-messages`

## 7.1 Responsabilidade

Gerar 3 mensagens personalizadas para um lead com base em uma campanha ativa.

## 7.2 Quando é chamada

1. Usuário abre o detalhe do lead.
2. Seleciona uma campanha ativa.
3. Clica em **Gerar mensagens**.
4. Ou clica em **Regenerar mensagens**.

## 7.3 Entrada

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "campaignId": "uuid",
  "generationType": "manual"
}
```

## 7.4 Validações

1. Usuário está autenticado.
2. Usuário pertence ao workspace.
3. `workspaceId` existe.
4. `leadId` existe.
5. Lead pertence ao workspace.
6. `campaignId` existe.
7. Campanha pertence ao workspace.
8. Campanha está ativa.
9. `generationType` é `manual` ou `trigger`.

## 7.5 Dados buscados

### Lead

Campos:

1. Nome.
2. Email.
3. Telefone.
4. Empresa.
5. Cargo.
6. Origem.
7. Observações.
8. Etapa atual.
9. Responsável.

### Campanha

Campos:

1. Nome.
2. Contexto.
3. Prompt de geração.
4. Status.
5. Etapa gatilho.

### Campos personalizados

Buscar:

1. Nome do campo.
2. Tipo.
3. Valor preenchido no lead.

## 7.6 Processamento

```text
1. Receber request.
2. Validar CORS e método.
3. Validar usuário.
4. Validar membership no workspace.
5. Buscar lead.
6. Buscar campanha.
7. Buscar campos personalizados preenchidos.
8. Montar prompt.
9. Chamar LLM.
10. Parsear JSON.
11. Validar se existem 3 mensagens.
12. Salvar cada mensagem em generated_messages.
13. Criar atividade message_generated.
14. Retornar mensagens salvas.
```

## 7.7 Prompt final

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
{{customFields}}

Regras:
1. Não invente dados ausentes.
2. Use apenas informações disponíveis.
3. Personalize com base nos dados reais.
4. Mantenha o tom definido na campanha.
5. Gere mensagens curtas, úteis e prontas para envio.
6. Retorne apenas JSON válido.

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

## 7.8 Saída de sucesso

```json
{
  "success": true,
  "messages": [
    {
      "id": "uuid",
      "variationIndex": 1,
      "content": "Oi João, vi que você atua como Head Comercial...",
      "status": "generated"
    },
    {
      "id": "uuid",
      "variationIndex": 2,
      "content": "João, tudo bem? Notei que a sua empresa...",
      "status": "generated"
    },
    {
      "id": "uuid",
      "variationIndex": 3,
      "content": "Olá João, queria te apresentar uma ideia rápida...",
      "status": "generated"
    }
  ]
}
```

## 7.9 Erros possíveis

### Usuário não autenticado

```json
{
  "success": false,
  "error": "Unauthorized."
}
```

### Sem acesso ao workspace

```json
{
  "success": false,
  "error": "You do not have access to this workspace."
}
```

### Lead não encontrado

```json
{
  "success": false,
  "error": "Lead not found."
}
```

### Campanha inativa

```json
{
  "success": false,
  "error": "Campaign is inactive."
}
```

### Falha da IA

```json
{
  "success": false,
  "error": "AI generation failed. Please try again."
}
```

### Retorno inválido

```json
{
  "success": false,
  "error": "Invalid AI response format."
}
```

---

## 8. Function `move-lead-stage`

## 8.1 Responsabilidade

Mover um lead entre etapas do funil validando campos obrigatórios da etapa de destino.

## 8.2 Quando é chamada

1. Usuário arrasta um card no Kanban.
2. Usuário muda etapa por ação equivalente.
3. Sistema precisa validar regras antes de persistir.

## 8.3 Entrada

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "targetStageId": "uuid"
}
```

## 8.4 Validações

1. Usuário autenticado.
2. Usuário pertence ao workspace.
3. Lead existe.
4. Lead pertence ao workspace.
5. Etapa de destino existe.
6. Etapa de destino pertence ao workspace.
7. Campos obrigatórios da etapa estão preenchidos.

## 8.5 Processamento

```text
1. Validar usuário e workspace.
2. Buscar lead atual.
3. Buscar etapa de destino.
4. Buscar campos obrigatórios da etapa.
5. Validar campos padrão.
6. Validar campos personalizados.
7. Se faltar campo, retornar erro com lista.
8. Se não faltar, atualizar leads.stage_id.
9. Registrar atividade stage_changed.
10. Verificar campanhas ativas vinculadas à etapa.
11. Se houver, disparar geração automática.
12. Retornar sucesso.
```

## 8.6 Validação de campos obrigatórios

### Campos padrão suportados

1. `name`.
2. `email`.
3. `phone`.
4. `company`.
5. `job_title`.
6. `lead_source`.
7. `notes`.

### Campos personalizados

Validar se existe valor preenchido em `lead_custom_values` para o `custom_field_id` exigido.

Um campo personalizado é considerado preenchido quando pelo menos uma coluna de valor compatível não está vazia:

1. `value_text`.
2. `value_number`.
3. `value_boolean`.
4. `value_date`.

## 8.7 Saída de sucesso

```json
{
  "success": true,
  "leadId": "uuid",
  "fromStageId": "uuid",
  "toStageId": "uuid",
  "triggeredCampaigns": 1
}
```

## 8.8 Saída com campos faltantes

```json
{
  "success": false,
  "error": "Missing required fields.",
  "missingFields": [
    "Cargo",
    "Telefone",
    "Segmento"
  ]
}
```

## 8.9 Decisão importante

A movimentação de etapa fica em Edge Function para evitar que a regra de campos obrigatórios fique apenas no frontend.

### Frase de defesa

> Centralizei a movimentação de etapa em uma Edge Function porque a validação de campos obrigatórios é regra de negócio. Se ficasse só no frontend, alguém poderia burlar a validação chamando o banco diretamente. A função valida o workspace, a etapa de destino e os campos necessários antes de alterar o lead.

---

## 9. Function `send-message-simulated`

## 9.1 Responsabilidade

Simular o envio de uma mensagem gerada pela IA.

O envio não dispara WhatsApp, email ou outro canal externo.

Ele apenas:

1. Marca a mensagem como enviada.
2. Preenche `sent_at`.
3. Move o lead para **Tentando Contato**.
4. Registra atividades.

## 9.2 Quando é chamada

Quando o usuário clica em **Enviar** em uma mensagem gerada.

## 9.3 Entrada

```json
{
  "workspaceId": "uuid",
  "messageId": "uuid"
}
```

## 9.4 Validações

1. Usuário autenticado.
2. Usuário pertence ao workspace.
3. Mensagem existe.
4. Mensagem pertence ao workspace.
5. Mensagem está associada a um lead válido.
6. Mensagem ainda não foi enviada.
7. Etapa **Tentando Contato** existe no workspace.

## 9.5 Processamento

```text
1. Validar usuário e workspace.
2. Buscar mensagem.
3. Buscar lead da mensagem.
4. Buscar etapa Tentando Contato.
5. Atualizar mensagem para status sent.
6. Preencher sent_at.
7. Atualizar lead.stage_id para Tentando Contato.
8. Registrar atividade message_sent.
9. Registrar atividade stage_changed.
10. Retornar sucesso.
```

## 9.6 Saída de sucesso

```json
{
  "success": true,
  "messageId": "uuid",
  "leadId": "uuid",
  "newStage": "Tentando Contato",
  "sentAt": "2026-04-30T15:00:00.000Z"
}
```

## 9.7 Erros possíveis

### Mensagem já enviada

```json
{
  "success": false,
  "error": "Message already sent."
}
```

### Etapa não encontrada

```json
{
  "success": false,
  "error": "Stage Tentando Contato not found."
}
```

## 9.8 Frase de defesa

> O envio é simulado porque a prova não exige integração real com canal externo. Mesmo assim, tratei o envio como uma ação de CRM: a mensagem é marcada como enviada, o histórico é registrado e o lead avança automaticamente para Tentando Contato, conforme o requisito.

---

## 10. Function `trigger-generate-messages`

## 10.1 Responsabilidade

Gerar mensagens automaticamente quando um lead entra em uma etapa configurada como gatilho de campanha.

## 10.2 Quando é chamada

1. Após mover lead para uma etapa via `move-lead-stage`.
2. Após criar lead diretamente em uma etapa que possui campanha gatilho.

## 10.3 Entrada

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "stageId": "uuid"
}
```

## 10.4 Validações

1. Usuário ou chamada interna autorizada.
2. Workspace existe.
3. Lead pertence ao workspace.
4. Etapa pertence ao workspace.
5. Existem campanhas ativas com `trigger_stage_id = stageId`.

## 10.5 Processamento

```text
1. Validar workspace.
2. Buscar campanhas ativas vinculadas à etapa.
3. Se não houver campanhas, retornar success com generatedCount = 0.
4. Para cada campanha:
   1. Buscar lead.
   2. Buscar campos personalizados.
   3. Montar prompt.
   4. Chamar LLM.
   5. Salvar mensagens com generation_type = trigger.
   6. Registrar atividade message_generated.
5. Se uma campanha falhar, registrar auto_generation_failed.
6. Continuar processando as demais campanhas.
7. Retornar resumo.
```

## 10.6 Saída de sucesso

```json
{
  "success": true,
  "leadId": "uuid",
  "stageId": "uuid",
  "campaignsProcessed": 2,
  "messagesGenerated": 6,
  "failures": []
}
```

## 10.7 Saída com falhas parciais

```json
{
  "success": true,
  "leadId": "uuid",
  "stageId": "uuid",
  "campaignsProcessed": 2,
  "messagesGenerated": 3,
  "failures": [
    {
      "campaignId": "uuid",
      "error": "AI generation failed."
    }
  ]
}
```

## 10.8 Decisão importante

A geração automática não deve bloquear a movimentação do lead.

Se a IA falhar, o lead continua na etapa correta e o erro é registrado no histórico.

### Frase de defesa

> A geração por etapa gatilho é tratada como processo complementar. Primeiro o lead muda de etapa, depois o sistema tenta gerar mensagens. Se a IA falhar, o CRM continua consistente e o erro fica registrado no histórico. Isso torna o sistema mais resiliente.

---

## 11. Integração entre funções

## 11.1 Fluxo manual de IA

```text
Lead Detail Page
  -> generate-messages
    -> valida workspace
    -> busca lead/campanha/campos
    -> chama LLM
    -> salva generated_messages
    -> cria lead_activities
    -> retorna mensagens
```

## 11.2 Fluxo de envio simulado

```text
GeneratedMessageCard
  -> send-message-simulated
    -> valida workspace
    -> marca mensagem como sent
    -> move lead para Tentando Contato
    -> cria atividades
    -> retorna sucesso
```

## 11.3 Fluxo de movimentação no Kanban

```text
KanbanBoard
  -> move-lead-stage
    -> valida workspace
    -> valida campos obrigatórios
    -> move lead
    -> registra atividade
    -> dispara trigger-generate-messages se aplicável
```

## 11.4 Fluxo automático por etapa

```text
move-lead-stage ou createLead
  -> trigger-generate-messages
    -> busca campanhas da etapa
    -> gera mensagens
    -> salva mensagens
    -> registra atividades
```

---

## 12. Variáveis de ambiente

## 12.1 Supabase Edge Functions

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LLM_PROVIDER=
LLM_API_KEY=
LLM_MODEL=
```

## 12.2 Frontend Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

## 12.3 Variáveis proibidas no frontend

Nunca expor:

```env
SUPABASE_SERVICE_ROLE_KEY=
LLM_API_KEY=
```

---

## 13. Tratamento de erros

## 13.1 Erro padrão

Todas as funções devem retornar JSON no mesmo formato:

```json
{
  "success": false,
  "error": "Mensagem de erro."
}
```

## 13.2 Erro com detalhes

Quando útil, adicionar campos extras:

```json
{
  "success": false,
  "error": "Missing required fields.",
  "missingFields": ["Cargo", "Telefone"]
}
```

## 13.3 Status HTTP sugeridos

1. `200`: sucesso.
2. `400`: body inválido ou regra de negócio.
3. `401`: usuário não autenticado.
4. `403`: usuário sem acesso ao workspace.
5. `404`: recurso não encontrado.
6. `500`: erro inesperado.

---

## 14. Logs e atividades

## 14.1 O que registrar em `lead_activities`

### Ao gerar mensagens

```json
{
  "activity_type": "message_generated",
  "description": "3 mensagens foram geradas pela campanha Black Friday.",
  "metadata": {
    "campaignId": "uuid",
    "generationType": "manual",
    "messagesCount": 3
  }
}
```

### Ao mover etapa

```json
{
  "activity_type": "stage_changed",
  "description": "Lead movido de Base para Lead Mapeado.",
  "metadata": {
    "fromStageId": "uuid",
    "toStageId": "uuid",
    "fromStageName": "Base",
    "toStageName": "Lead Mapeado"
  }
}
```

### Ao enviar mensagem

```json
{
  "activity_type": "message_sent",
  "description": "Mensagem enviada de forma simulada.",
  "metadata": {
    "messageId": "uuid",
    "campaignId": "uuid"
  }
}
```

### Ao falhar geração automática

```json
{
  "activity_type": "auto_generation_failed",
  "description": "Falha ao gerar mensagens automaticamente.",
  "metadata": {
    "campaignId": "uuid",
    "error": "AI generation failed."
  }
}
```

---

## 15. Pseudocódigo das funções

## 15.1 `generate-messages`

```ts
serve(async (req) => {
  if (req.method === 'OPTIONS') return corsResponse();
  if (req.method !== 'POST') return errorResponse('Method not allowed.', 405);

  const user = await requireUser(req);
  const body = await req.json();

  const { workspaceId, leadId, campaignId, generationType = 'manual' } = body;

  await assertWorkspaceMember(workspaceId, user.id);

  const lead = await getLead(workspaceId, leadId);
  const campaign = await getActiveCampaign(workspaceId, campaignId);
  const customFields = await getLeadCustomFields(workspaceId, leadId);

  const prompt = buildMessagePrompt({ lead, campaign, customFields });
  const aiResult = await callLLM(prompt);
  const parsed = parseMessages(aiResult);

  const savedMessages = await saveGeneratedMessages({
    workspaceId,
    leadId,
    campaignId,
    messages: parsed.messages,
    generationType,
    userId: user.id,
  });

  await createActivity({
    workspaceId,
    leadId,
    userId: user.id,
    activityType: 'message_generated',
    description: `${savedMessages.length} mensagens foram geradas.`,
  });

  return jsonResponse({ success: true, messages: savedMessages });
});
```

## 15.2 `move-lead-stage`

```ts
serve(async (req) => {
  if (req.method === 'OPTIONS') return corsResponse();
  if (req.method !== 'POST') return errorResponse('Method not allowed.', 405);

  const user = await requireUser(req);
  const { workspaceId, leadId, targetStageId } = await req.json();

  await assertWorkspaceMember(workspaceId, user.id);

  const lead = await getLead(workspaceId, leadId);
  const targetStage = await getStage(workspaceId, targetStageId);
  const missingFields = await validateRequiredFields(workspaceId, lead, targetStageId);

  if (missingFields.length > 0) {
    return errorResponse('Missing required fields.', 400, { missingFields });
  }

  await updateLeadStage(leadId, targetStageId);

  await createActivity({
    workspaceId,
    leadId,
    userId: user.id,
    activityType: 'stage_changed',
    description: `Lead movido para ${targetStage.name}.`,
  });

  const triggerResult = await runTriggerGenerationIfNeeded({
    workspaceId,
    leadId,
    stageId: targetStageId,
    userId: user.id,
  });

  return jsonResponse({
    success: true,
    leadId,
    fromStageId: lead.stage_id,
    toStageId: targetStageId,
    triggeredCampaigns: triggerResult.campaignsProcessed,
  });
});
```

## 15.3 `send-message-simulated`

```ts
serve(async (req) => {
  if (req.method === 'OPTIONS') return corsResponse();
  if (req.method !== 'POST') return errorResponse('Method not allowed.', 405);

  const user = await requireUser(req);
  const { workspaceId, messageId } = await req.json();

  await assertWorkspaceMember(workspaceId, user.id);

  const message = await getGeneratedMessage(workspaceId, messageId);

  if (message.status === 'sent') {
    return errorResponse('Message already sent.', 400);
  }

  const contactStage = await getStageByName(workspaceId, 'Tentando Contato');

  await markMessageAsSent(messageId);
  await updateLeadStage(message.lead_id, contactStage.id);

  await createActivity({
    workspaceId,
    leadId: message.lead_id,
    userId: user.id,
    activityType: 'message_sent',
    description: 'Mensagem enviada de forma simulada.',
  });

  await createActivity({
    workspaceId,
    leadId: message.lead_id,
    userId: user.id,
    activityType: 'stage_changed',
    description: 'Lead movido automaticamente para Tentando Contato.',
  });

  return jsonResponse({
    success: true,
    messageId,
    leadId: message.lead_id,
    newStage: 'Tentando Contato',
    sentAt: new Date().toISOString(),
  });
});
```

---

## 16. Ordem de implementação

1. `_shared` helpers.
2. `move-lead-stage`.
3. `generate-messages`.
4. `send-message-simulated`.
5. `trigger-generate-messages`.

## Por que essa ordem

1. Primeiro garantimos o fluxo do CRM.
2. Depois adicionamos IA manual.
3. Depois o envio simulado.
4. Por último, o diferencial automático por etapa gatilho.

---

## 17. Checklist de validação

## `generate-messages`

* [ ] Bloqueia usuário não autenticado.
* [ ] Bloqueia usuário fora do workspace.
* [ ] Bloqueia campanha inativa.
* [ ] Busca campos personalizados.
* [ ] Chama LLM.
* [ ] Salva 3 mensagens.
* [ ] Registra atividade.
* [ ] Retorna mensagens no formato esperado.

## `move-lead-stage`

* [ ] Bloqueia usuário não autenticado.
* [ ] Bloqueia usuário fora do workspace.
* [ ] Valida etapa do workspace.
* [ ] Valida campos obrigatórios padrão.
* [ ] Valida campos obrigatórios personalizados.
* [ ] Bloqueia movimento quando faltar campo.
* [ ] Move lead quando estiver válido.
* [ ] Registra atividade.
* [ ] Dispara gatilho quando aplicável.

## `send-message-simulated`

* [ ] Bloqueia usuário não autenticado.
* [ ] Bloqueia usuário fora do workspace.
* [ ] Bloqueia mensagem já enviada.
* [ ] Marca mensagem como enviada.
* [ ] Preenche `sent_at`.
* [ ] Move lead para Tentando Contato.
* [ ] Registra atividades.

## `trigger-generate-messages`

* [ ] Busca campanhas ativas da etapa.
* [ ] Gera mensagens por campanha.
* [ ] Salva mensagens como `trigger`.
* [ ] Registra atividades.
* [ ] Registra falhas sem quebrar o fluxo.

---

## 18. Resposta curta para avaliação

> As Edge Functions foram usadas para proteger regras críticas do sistema. O frontend não acessa diretamente a IA nem executa sozinho movimentações importantes. Cada função valida autenticação, membership no workspace e consistência dos dados antes de alterar o banco. Isso melhora segurança, rastreabilidade e aderência ao requisito de usar Supabase Edge Functions.
