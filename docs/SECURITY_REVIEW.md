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

### Itens verificados sem problema

- Não encontrei `SUPABASE_SERVICE_ROLE_KEY` em código frontend.
- Não encontrei `LLM_API_KEY` em código frontend.
- Não encontrei segredos hardcoded relevantes no frontend.
- Não encontrei SQL cru concatenado com input do usuário nas consultas revisadas.

---

## Correções aplicadas

- Removidas as chaves sensíveis do `.env.example`.
- Sanitizados os `console.error` nas Edge Functions `generate-messages`, `move-lead-stage` e `trigger-generate-messages` para não expor objetos de erro completos.
- Criada migration `0002_schema_fixes.sql` adicionando `created_by` em `leads`, `user_id` em `lead_activities`, `variation_index` em `generated_messages` e a policy `DELETE` para `generated_messages`.
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
- `trigger-generate-messages`

### Isolamento por workspace

O acesso é restringido por `workspace_members` e reforçado por RLS.

### `.env.example`

Contém apenas variáveis públicas/anon necessárias no frontend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Não inclui service role nem chave de IA.
