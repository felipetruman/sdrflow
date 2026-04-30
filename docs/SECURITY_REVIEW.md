# SECURITY_REVIEW | SDRFlow AI

## Escopo

Revisão estática do código para:

- segredos embutidos
- chaves expostas no frontend
- logs sensíveis
- padrões inseguros de consulta
- RLS
- validação de Edge Functions
- isolamento por workspace
- `.env.example`

---

## Achados

| Local | Risco | Recomendação |
|---|---|---|
| `.env.example` | Alto | Remover `SUPABASE_SERVICE_ROLE_KEY` e `LLM_API_KEY` do arquivo de exemplo. |
| `supabase/functions/generate-messages/index.ts:151` | Baixo | Evitar `console.error` com objetos completos se puderem conter payload sensível. |
| `supabase/functions/move-lead-stage/index.ts:190` | Baixo | Mesma recomendação para logs de erro. |

### Itens verificados sem problema

- Não encontrei `SUPABASE_SERVICE_ROLE_KEY` em código frontend.
- Não encontrei `LLM_API_KEY` em código frontend.
- Não encontrei segredos hardcoded relevantes no frontend.
- Não encontrei SQL cru concatenado com input do usuário nas consultas revisadas.

---

## Correções aplicadas

- Removidas as chaves sensíveis do `.env.example`.
- README ajustado para orientar uso correto das variáveis de ambiente.
- Checklist de QA atualizado para refletir o estado atual.

---

## Verificação de segurança

### RLS habilitado

RLS está habilitado para:

- `workspaces`
- `workspace_members`
- `funnel_stages`
- `leads`
- `custom_fields`
- `lead_custom_values`
- `stage_required_fields`
- `campaigns`
- `generated_messages`
- `lead_activities`

### Edge Functions

As funções abaixo validam token de autenticação e membership antes de processar:

- `generate-messages`
- `move-lead-stage`
- `send-message-simulated`

### Isolamento por workspace

O acesso é restringido por `workspace_members` e reforçado por RLS.

### `.env.example`

Contém apenas variáveis públicas/anon necessárias no frontend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Não inclui service role nem chave de IA.
