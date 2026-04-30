## 10. Edge Functions e contratos de API

As **Supabase Edge Functions** serão usadas para toda lógica sensível do backend, principalmente geração de mensagens com IA e envio simulado.

Isso atende ao requisito obrigatório de backend com Supabase Edge Functions e evita expor chaves da LLM no frontend. 

---

# 10.1 Decisão de arquitetura

O frontend **não chama a API da IA diretamente**.

Fluxo correto:

```text
Frontend
  -> Supabase Edge Function
    -> Valida usuário e workspace
    -> Busca lead, campanha e campos personalizados
    -> Monta prompt
    -> Chama LLM
    -> Salva mensagens
    -> Retorna resultado ao frontend
```

## Por quê

1. Protege a chave da LLM.
2. Centraliza a montagem do prompt.
3. Garante validação de acesso por workspace.
4. Permite salvar histórico.
5. Facilita tratar erros de IA.
6. Mostra maturidade técnica na avaliação.

---

# 10.2 Edge Functions previstas

## Obrigatórias para o MVP

1. `generate-messages`
2. `send-message-simulated`

## Recomendadas para deixar o projeto mais sólido

3. `move-lead-stage`
4. `trigger-generate-messages`

Minha recomendação: implementar as 4.

---

# 10.3 Function `generate-messages`

## Responsabilidade

Gerar 2 ou 3 mensagens personalizadas para um lead com base em uma campanha.

## Quando é chamada

1. Usuário acessa o detalhe do lead.
2. Seleciona uma campanha ativa.
3. Clica em **Gerar mensagens** ou **Regenerar**.

## Entrada

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "campaignId": "uuid",
  "generationType": "manual"
}
```

## Validações

A função deve validar:

1. Se o usuário está autenticado.
2. Se o usuário pertence ao workspace.
3. Se o lead pertence ao workspace.
4. Se a campanha pertence ao workspace.
5. Se a campanha está ativa.
6. Se existem dados mínimos para montar o prompt.

## Processamento

```text
1. Receber request.
2. Ler JWT do usuário.
3. Validar acesso ao workspace.
4. Buscar lead.
5. Buscar campanha.
6. Buscar campos personalizados do lead.
7. Montar prompt final.
8. Chamar LLM.
9. Validar JSON retornado.
10. Salvar mensagens em generated_messages.
11. Criar registro em lead_activities.
12. Retornar mensagens para o frontend.
```

## Saída de sucesso

```json
{
  "success": true,
  "messages": [
    {
      "id": "uuid",
      "variationIndex": 1,
      "content": "Oi João, vi que você atua como Head Comercial..."
    },
    {
      "id": "uuid",
      "variationIndex": 2,
      "content": "João, tudo bem? Notei que a sua empresa..."
    },
    {
      "id": "uuid",
      "variationIndex": 3,
      "content": "Olá João, queria te apresentar uma ideia rápida..."
    }
  ]
}
```

## Saída de erro

```json
{
  "success": false,
  "error": "Campaign is inactive or not found."
}
```

## Como explicar

> A geração de mensagens fica isolada em uma Edge Function porque envolve dados sensíveis, chave de API e regra de negócio. O frontend apenas solicita a geração, mas quem monta o prompt, valida acesso e salva o resultado é o backend.

---

# 10.4 Prompt interno da função

A função deve montar um prompt estruturado, não simplesmente concatenar texto solto.

## Estrutura

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

## Decisão importante

A IA deve retornar **JSON válido**.

Isso facilita:

1. Parse automático.
2. Validação.
3. Salvamento no banco.
4. Exibição previsível no frontend.

---

# 10.5 Function `send-message-simulated`

## Responsabilidade

Simular o envio de uma mensagem gerada.

O envio não dispara WhatsApp nem email. Ele apenas registra a ação no CRM.

## Quando é chamada

Quando o usuário clica em **Enviar** em uma mensagem gerada.

## Entrada

```json
{
  "workspaceId": "uuid",
  "messageId": "uuid"
}
```

## Validações

1. Usuário autenticado.
2. Usuário pertence ao workspace.
3. Mensagem pertence ao workspace.
4. Mensagem pertence a um lead válido.
5. Mensagem ainda não foi enviada.

## Processamento

```text
1. Buscar mensagem.
2. Marcar mensagem como sent.
3. Preencher sent_at.
4. Buscar etapa "Tentando Contato".
5. Atualizar lead.stage_id para essa etapa.
6. Criar atividade message_sent.
7. Criar atividade stage_changed.
8. Retornar sucesso.
```

## Saída

```json
{
  "success": true,
  "leadId": "uuid",
  "newStage": "Tentando Contato",
  "sentAt": "2026-04-30T15:00:00Z"
}
```

## Como explicar

> O envio é simulado porque a prova não pede integração real com canal de mensagem. Mesmo assim, o sistema registra o envio e move automaticamente o lead para Tentando Contato, exatamente como o requisito define.

---

# 10.6 Function `move-lead-stage`

## Responsabilidade

Mover um lead entre etapas validando campos obrigatórios.

## Por que criar uma Edge Function para isso

Poderíamos mover direto pelo frontend usando Supabase Client, mas a regra de validação de campos obrigatórios é importante demais para ficar espalhada no frontend.

Centralizar em uma função deixa a lógica mais segura e mais fácil de explicar.

## Entrada

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "targetStageId": "uuid"
}
```

## Validações

1. Usuário autenticado.
2. Usuário pertence ao workspace.
3. Lead pertence ao workspace.
4. Etapa de destino pertence ao workspace.
5. Campos obrigatórios da etapa estão preenchidos.

## Se faltar campo

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

## Se estiver tudo certo

```json
{
  "success": true,
  "leadId": "uuid",
  "fromStageId": "uuid",
  "toStageId": "uuid"
}
```

## Processamento após mover

Depois de mover o lead:

```text
1. Atualizar stage_id.
2. Registrar atividade stage_changed.
3. Verificar campanhas ativas vinculadas à etapa.
4. Se houver campanha gatilho, chamar geração automática.
```

---

# 10.7 Function `trigger-generate-messages`

## Responsabilidade

Gerar mensagens automaticamente quando um lead entra em uma etapa gatilho.

## Quando é chamada

1. Após mover lead para uma etapa.
2. Após criar lead diretamente em uma etapa que tem campanha gatilho.

## Entrada

```json
{
  "workspaceId": "uuid",
  "leadId": "uuid",
  "stageId": "uuid"
}
```

## Processamento

```text
1. Buscar campanhas ativas com trigger_stage_id = stageId.
2. Para cada campanha:
   1. Buscar lead.
   2. Buscar campos personalizados.
   3. Montar prompt.
   4. Chamar LLM.
   5. Salvar mensagens como generation_type = trigger.
   6. Registrar atividade message_generated.
3. Se alguma campanha falhar, registrar auto_generation_failed.
4. Não quebrar o fluxo principal.
```

## Decisão importante

A geração automática **não deve bloquear a movimentação do lead**.

Se a IA falhar, o lead continua na etapa correta e o erro fica registrado no histórico.

## Como explicar

> A etapa gatilho é um diferencial da prova. Eu tratei a geração automática como uma ação complementar: primeiro o lead muda de etapa, depois o sistema tenta gerar as mensagens. Assim, uma falha na IA não quebra o fluxo principal do CRM.

---

# 10.8 Tratamento de erros

## Erros previstos

### Usuário não autenticado

```json
{
  "success": false,
  "error": "Unauthorized."
}
```

### Usuário sem acesso ao workspace

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

### Campos obrigatórios faltando

```json
{
  "success": false,
  "error": "Missing required fields.",
  "missingFields": ["Cargo", "Telefone"]
}
```

### Falha da LLM

```json
{
  "success": false,
  "error": "AI generation failed. Please try again."
}
```

### Retorno inválido da LLM

```json
{
  "success": false,
  "error": "Invalid AI response format."
}
```

---

# 10.9 Variáveis de ambiente

## Supabase Edge Functions

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LLM_API_KEY=
LLM_MODEL=
LLM_PROVIDER=
```

## Frontend Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

## Regra de segurança

Nunca colocar no frontend:

```env
SUPABASE_SERVICE_ROLE_KEY
LLM_API_KEY
```

---

# 10.10 Defesa técnica das Edge Functions

Use esta explicação se perguntarem:

> Eu usei Edge Functions para concentrar regras sensíveis do sistema: geração com IA, envio simulado e movimentação de etapas. Isso evita expor chaves no frontend, melhora segurança e deixa a lógica crítica em um backend controlado. Além disso, a função valida se o usuário pertence ao workspace antes de buscar ou alterar qualquer dado. Assim, o frontend fica responsável pela experiência, enquanto o backend garante regras, permissões e persistência.

---

# 10.11 Ordem de implementação

Eu implementaria nesta sequência:

1. `move-lead-stage`
2. `generate-messages`
3. `send-message-simulated`
4. `trigger-generate-messages`

## Por quê

Primeiro garantimos o fluxo do CRM e Kanban. Depois colocamos a IA manual. Depois o envio simulado. Por último, a automação por gatilho.

Próxima seção: **estrutura de pastas do projeto e padrões de código**.
