## 10. Edge Functions e contratos de API

As Supabase Edge Functions serão usadas para toda lógica sensível do backend.

---

## 10.1 Decisão de arquitetura

O frontend **não chama a API da IA diretamente**.

Fluxo correto:
```
Frontend -> Supabase Edge Function
  -> Valida usuário e workspace
  -> Busca lead, campanha e campos personalizados
  -> Monta prompt
  -> Chama LLM
  -> Salva mensagens
  -> Retorna resultado ao frontend
```

---

## 10.2 Edge Functions implementadas

| Função | Arquivo | Descrição |
|--------|---------|-----------|
| `generate-messages` | `supabase/functions/generate-messages/index.ts` | Gera 3 mensagens com IA |
| `send-message-simulated` | `supabase/functions/send-message-simulated/index.ts` | Simula envio e move lead |
| `move-lead-stage` | `supabase/functions/move-lead-stage/index.ts` | Move lead validando campos obrigatórios |
| `trigger-generate-messages` | `supabase/functions/trigger-generate-messages/index.ts` | Gera mensagens automaticamente por gatilho |

---

## 10.3 Function `generate-messages`

### Responsabilidade
Gerar mensagens personalizadas para um lead com base em uma campanha.

### Entrada
```json
{
  "leadId": "uuid",
  "campaignId": "uuid"
}
```

### Validações
1. Usuário autenticado (Bearer token).
2. Lead existe.
3. Usuário é membro do workspace do lead.
4. Campanha ativa existe no mesmo workspace.

### Processamento
1. Busca lead.
2. Busca campanha ativa.
3. Busca campos personalizados do lead.
4. Monta prompt estruturado.
5. Chama LLM (se `LLM_API_KEY` configurada).
6. Faz parse do JSON retornado.
7. Se falhar, usa fallback com 3 mensagens mock.
8. Salva mensagens em `generated_messages`.
9. Registra atividade `message_generated`.

### Saída de sucesso
```json
{
  "messages": [
    { "id": "uuid", "content": "mensagem 1", "status": "generated", "generation_type": "manual" },
    { "id": "uuid", "content": "mensagem 2", "status": "generated", "generation_type": "manual" },
    { "id": "uuid", "content": "mensagem 3", "status": "generated", "generation_type": "manual" }
  ]
}
```

### Saída de erro
```json
{ "error": "Unauthorized" }                    // 401
{ "error": "Forbidden" }                       // 403
{ "error": "Lead not found" }                  // 404
{ "error": "Campaign not found or inactive" }  // 404
```

---

## 10.4 Function `send-message-simulated`

### Responsabilidade
Marcar mensagem como enviada e mover lead para "Tentando Contato".

### Entrada
```json
{
  "messageId": "uuid"
}
```

### Validações
1. Usuário autenticado.
2. Mensagem existe.
3. Usuário é membro do workspace.
4. Mensagem ainda não foi enviada.

### Processamento
1. Busca mensagem e lead.
2. Atualiza mensagem para `status = 'sent'` e preenche `sent_at`.
3. Busca etapa "Tentando Contato" do workspace.
4. Atualiza `stage_id` do lead.
5. Registra atividades `message_sent` e `stage_changed`.

### Saída
```json
{ "success": true }
```

### Erros
```json
{ "error": "Unauthorized" }          // 401
{ "error": "Forbidden" }             // 403
{ "error": "Message not found" }     // 404
{ "error": "Message already sent" }  // 400
```

---

## 10.5 Function `move-lead-stage`

### Responsabilidade
Mover lead entre etapas validando campos obrigatórios.

### Entrada
```json
{
  "leadId": "uuid",
  "stageId": "uuid"
}
```

### Validações
1. Usuário autenticado.
2. Lead e etapa existem.
3. Usuário é membro do workspace.
4. Etapa pertence ao mesmo workspace.
5. Campos obrigatórios da etapa estão preenchidos.

### Se faltar campo
```json
{
  "error": "Campos obrigatórios faltando",
  "missingFields": ["Cargo", "Telefone", "Segmento"]
}
```

### Se estiver tudo certo
```json
{ "success": true }
```

### Processamento após mover
1. Atualiza `stage_id`.
2. Registra atividade `stage_changed`.
3. Busca campanhas ativas com `trigger_stage_id` igual à nova etapa.
4. Para cada campanha, chama `trigger-generate-messages`.

---

## 10.6 Function `trigger-generate-messages`

### Responsabilidade
Gerar mensagens automaticamente quando um lead entra em etapa gatilho.

### Entrada
```json
{
  "leadId": "uuid",
  "campaignId": "uuid"
}
```

### Processamento
1. Busca lead e campanha ativa.
2. Valida workspace.
3. Busca campos personalizados.
4. Monta prompt (mais curto que o manual).
5. Chama LLM ou usa fallback.
6. Salva mensagens com `generation_type = 'trigger'`.
7. Registra atividade `message_generated`.

### Saída
```json
{
  "messages": [
    { "id": "uuid", "content": "mensagem 1", "generation_type": "trigger" }
  ]
}
```

### Decisão importante
A geração automática **não bloqueia** a movimentação do lead. Se a IA falhar, o lead continua na etapa correta.

---

## 10.7 Tratamento de erros

### Erros padrão

```json
{ "error": "Unauthorized." }              // 401
{ "error": "Forbidden." }                 // 403
{ "error": "Lead not found." }            // 404
{ "error": "Campaign is inactive." }      // 404
{ "error": "Missing required fields." }   // 400
{ "error": "AI generation failed." }      // 500
```

---

## 10.8 Variáveis de ambiente

### Supabase Edge Functions
```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LLM_API_KEY=
LLM_MODEL=
LLM_BASE_URL=
```

### Frontend Vercel
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

**Nunca expor no frontend:** `SUPABASE_SERVICE_ROLE_KEY`, `LLM_API_KEY`.

---

## 10.9 Defesa técnica

> Eu usei Edge Functions para concentrar regras sensíveis do sistema: geração com IA, envio simulado e movimentação de etapas. Isso evita expor chaves no frontend, melhora segurança e deixa a lógica crítica em um backend controlado. Além disso, a função valida se o usuário pertence ao workspace antes de buscar ou alterar qualquer dado.
