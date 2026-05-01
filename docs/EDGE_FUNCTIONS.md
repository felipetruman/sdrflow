# EDGE FUNCTIONS | SDRFlow AI

## 1. Visão geral

As Supabase Edge Functions concentram as regras sensíveis do SDRFlow AI.

Elas são usadas para:

1. Gerar mensagens com IA.
2. Mover leads entre etapas com validação de campos obrigatórios.
3. Simular envio de mensagem.
4. Gerar mensagens automaticamente por etapa gatilho.

A decisão principal é: o frontend não executa lógica crítica sozinho.

---

## 2. Por que usar Edge Functions

1. Proteger a chave da LLM.
2. Proteger a Service Role do Supabase.
3. Centralizar regras críticas.
4. Validar acesso por workspace no backend.
5. Salvar histórico de mensagens e atividades.
6. Padronizar tratamento de erros.

---

## 3. Edge Functions implementadas

| Função | Arquivo | Status |
|--------|---------|--------|
| `generate-messages` | `supabase/functions/generate-messages/index.ts` | ACTIVE |
| `send-message-simulated` | `supabase/functions/send-message-simulated/index.ts` | ACTIVE |
| `move-lead-stage` | `supabase/functions/move-lead-stage/index.ts` | ACTIVE |
| `trigger-generate-messages` | `supabase/functions/trigger-generate-messages/index.ts` | ACTIVE |

---

## 4. Padrão de autenticação

Todas as funções seguem o mesmo padrão:

1. Responder OPTIONS para CORS.
2. Validar header `Authorization` com Bearer token.
3. Validar usuário autenticado via `supabase.auth.getUser(token)`.
4. Buscar lead/campanha/mensagem do banco.
5. Validar workspace membership via `workspace_members`.
6. Executar regra de negócio.
7. Retornar JSON.

---

## 5. `generate-messages`

### Responsabilidade
Gerar 3 mensagens personalizadas para um lead com base em uma campanha ativa.

### Entrada
```json
{
  "leadId": "uuid",
  "campaignId": "uuid"
}
```

### Processamento
1. Valida autenticação (Bearer token).
2. Busca lead no banco.
3. Valida membership no workspace do lead.
4. Busca campanha ativa vinculada ao workspace.
5. Busca valores de campos personalizados do lead.
6. Monta prompt estruturado.
7. Chama API da LLM (se `LLM_API_KEY` configurada).
8. Faz parse do JSON retornado.
9. Se falhar ou não houver chave, usa fallback com 3 mensagens mock.
10. Salva mensagens em `generated_messages`.
11. Registra atividade `message_generated`.

### Saída de sucesso
```json
{
  "messages": [
    { "id": "uuid", "content": "mensagem 1", "status": "generated", "generation_type": "manual", ... },
    { "id": "uuid", "content": "mensagem 2", "status": "generated", "generation_type": "manual", ... },
    { "id": "uuid", "content": "mensagem 3", "status": "generated", "generation_type": "manual", ... }
  ]
}
```

### Saída de erro
```json
{ "error": "Unauthorized" }          // 401
{ "error": "Forbidden" }             // 403
{ "error": "Lead not found" }        // 404
{ "error": "Campaign not found or inactive" } // 404
{ "error": "Internal error" }        // 500
```

---

## 6. `send-message-simulated`

### Responsabilidade
Simular o envio de uma mensagem gerada. Marca como enviada e move o lead para "Tentando Contato".

### Entrada
```json
{
  "messageId": "uuid"
}
```

### Processamento
1. Valida autenticação.
2. Busca mensagem e lead relacionado.
3. Valida workspace membership.
4. Bloqueia se mensagem já estiver enviada.
5. Atualiza mensagem para `status = 'sent'` e preenche `sent_at`.
6. Busca etapa "Tentando Contato" do workspace.
7. Atualiza `stage_id` do lead.
8. Registra atividades `message_sent` e `stage_changed`.

### Saída de sucesso
```json
{ "success": true }
```

### Saída de erro
```json
{ "error": "Unauthorized" }       // 401
{ "error": "Forbidden" }          // 403
{ "error": "Message not found" }  // 404
{ "error": "Message already sent" } // 400
```

---

## 7. `move-lead-stage`

### Responsabilidade
Mover um lead entre etapas validando campos obrigatórios da etapa de destino.

### Entrada
```json
{
  "leadId": "uuid",
  "stageId": "uuid"
}
```

### Processamento
1. Valida autenticação.
2. Busca lead e etapa de destino.
3. Valida workspace membership.
4. Verifica se etapa pertence ao mesmo workspace.
5. Busca campos obrigatórios da etapa em `stage_required_fields`.
6. Valida campos padrão e personalizados do lead.
7. Se faltar campo, retorna lista de campos faltantes.
8. Se estiver completo, atualiza `leads.stage_id`.
9. Registra atividade `stage_changed`.
10. Busca campanhas ativas com `trigger_stage_id` igual à nova etapa.
11. Para cada campanha, chama `trigger-generate-messages`.

### Saída de sucesso
```json
{ "success": true }
```

### Saída com campos faltantes
```json
{
  "error": "Campos obrigatórios faltando",
  "missingFields": ["Cargo", "Telefone", "Segmento"]
}
```

### Erros
```json
{ "error": "Unauthorized" }                    // 401
{ "error": "Forbidden" }                       // 403
{ "error": "Lead not found" }                  // 404
{ "error": "Stage not found" }                 // 404
{ "error": "Stage does not belong to workspace" } // 403
```

---

## 8. `trigger-generate-messages`

### Responsabilidade
Gerar mensagens automaticamente quando um lead entra em uma etapa configurada como gatilho.

### Entrada
```json
{
  "leadId": "uuid",
  "campaignId": "uuid"
}
```

### Processamento
1. Valida autenticação.
2. Busca lead e campanha ativa.
3. Valida workspace membership.
4. Busca campos personalizados do lead.
5. Monta prompt (mais curto que o manual).
6. Chama LLM ou usa fallback.
7. Salva mensagens com `generation_type = 'trigger'`.
8. Registra atividade `message_generated`.

### Saída de sucesso
```json
{
  "messages": [
    { "id": "uuid", "content": "mensagem 1", "generation_type": "trigger", ... },
    ...
  ]
}
```

### Erros
```json
{ "error": "Unauthorized" }       // 401
{ "error": "Forbidden" }          // 403
{ "error": "Lead not found" }     // 404
{ "error": "Campaign not found or inactive" } // 404
```

---

## 9. Variáveis de ambiente das Edge Functions

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
```

**Nunca expor no frontend:** `SUPABASE_SERVICE_ROLE_KEY`, `LLM_API_KEY`.

---

## 10. Tratamento de erros

Todas as funções retornam JSON no formato:

```json
{ "error": "Mensagem de erro." }
```

Status HTTP:
- `200` — sucesso
- `400` — body inválido ou regra de negócio
- `401` — não autenticado
- `403` — sem acesso ao workspace
- `404` — recurso não encontrado
- `500` — erro inesperado

---

## 11. Resposta curta para avaliação

> As Edge Functions foram usadas para proteger regras críticas do sistema. O frontend não acessa diretamente a IA nem executa sozinho movimentações importantes. Cada função valida autenticação, membership no workspace e consistência dos dados antes de alterar o banco. Isso melhora segurança, rastreabilidade e aderência ao requisito de usar Supabase Edge Functions.
