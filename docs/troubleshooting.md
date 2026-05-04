# Troubleshooting Guide — SDR Flow

## Supabase Auth

### Invalid login credentials

**Causa:** email não confirmado, senha errada, ou usuário inexistente.

```bash
# Verificar via Supabase Dashboard ou SQL
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'user@test.com';
```

**Solução:** em demo mode (`USE_DEMO_MODE=true`), use `demo@sdrflow.test` / `demo123456`. Em produção, confirme o email ou use `admin.createUser({ email_confirm: true })`.

### JWT expired / sessão perdida

**Causa:** token expira após 1h. O middleware do Next.js usa `@supabase/ssr` com `getSession()` que faz refresh automático via cookie.

**Solução:** verifique se os cookies `sb-kjxvjqadoefbvzxymgff-auth-token` estão presentes. Se o refresh falhar, redirecione para `/login` (middleware faz isso automaticamente).

### User already registered

**Causa:** email já existe em `auth.users`.

**Solução:** o `signUp.ts` já retorna essa mensagem. No frontend, o `SignUpForm` exibe o erro.

---

## Row Level Security (RLS)

### new row violates row-level security policy

**Causa:** política RLS bloqueando INSERT/UPDATE. Comum em tabelas com `workspace_id`.

**Diagnóstico:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

**Soluções frequentes:**
- Verifique se o usuário está em `workspace_members` para o workspace alvo
- Use `WITH CHECK` (não só `USING`) para policies de INSERT/UPDATE
- Para operações admin, use `SECURITY DEFINER` functions

### Query retorna array vazio com dados existentes

**Causa:** RLS filtrando tudo — o `auth.uid()` não bate com `user_id` em `workspace_members`.

**Verificação:**
```sql
SET LOCAL request.jwt.claim.sub = 'seu-user-id';
SET LOCAL role = authenticated;
SELECT * FROM workspace_members WHERE user_id = 'seu-user-id';
```

### Performance com RLS em queries grandes

**Solução:** use `SECURITY DEFINER` function em vez de subquery inline:
```sql
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
$$;
```

---

## Server Actions (Next.js)

### Server action não executa / 401/403

**Causa:** falha no `getSession()` ou `getCurrentWorkspace()`.

**Debug:**
```typescript
// Adicione log temporário
const { data: { session } } = await getSession()
console.log('session:', session?.user?.id)
const workspace = await getCurrentWorkspace()
console.log('workspace:', workspace?.id)
```

### Erro "Workspace not found" no primeiro acesso

**Causa:** cookie `sdrflow-workspace-id` não setado.

**Solução:** o middleware deve redirecionar para `/onboarding` se o usuário não tem workspace. Confirme que `getUserWorkspaces()` retorna dados.

### Demo mode vs produção

**Causa:** `isDemoMode()` só ativa com `USE_DEMO_MODE=true`. Sem essa env var, server actions fazem queries reais ao Supabase.

**Solução:** configure `.env.local`:
```
USE_DEMO_MODE=true                      # desenvolvimento
# USE_DEMO_MODE=false                   # produção (ou remova a linha)
```

---

## Edge Functions (Deno)

### Function not found (404)

```bash
supabase functions deploy generate-messages
supabase functions list
```

### CORS bloqueado

**Causa:** headers CORS ausentes na Edge Function.

Todas as 4 Edge Functions (`generate-messages`, `send-message-simulated`, `move-lead-stage`, `trigger-generate-messages`) já incluem `corsHeaders`. Se adicionar nova function, inclua:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### WORKER_TIMEOUT

**Causa:** function passou de 60s (limite plano Free).

**Solução:** use `EdgeRuntime.waitUntil()` para processamento background:
```typescript
EdgeRuntime.waitUntil(processInBackground(leadId))
return new Response(JSON.stringify({ status: 'queued' }), { status: 202 })
```

---

## OpenAI / LLM Integration

### 429 Too Many Requests

**Solução:** a Edge Function `generate-messages` tem fallback mock quando `LLM_API_KEY` não está configurada. Em produção, implemente retry com backoff:

```typescript
for (let attempt = 0; attempt < 3; attempt++) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', ...)
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
    continue
  }
  // ...
}
```

### Resposta não é JSON válido

**Solução:** use `response_format: { type: 'json_object' }` no OpenAI. A Edge Function já faz parse defensivo com fallback.

---

## Migrations & Schema

### relation does not exist

```bash
supabase db push --include-all
```

### Conflito de migration entre branches

```bash
# Renomeie sua migration para timestamp posterior
mv supabase/migrations/20260101_meu.sql supabase/migrations/20260105_meu.sql
supabase db reset
```

### Lista de migrations atual

```bash
ls supabase/migrations/
# 0001_initial_schema.sql
# 0002_seed_demo_data.sql
# 0003_schema_fixes.sql
# 0004_security_fixes.sql
# 0005_update_policy_with_check.sql
# 0006_fix_generated_messages_rls.sql
# 0007_workspace_members_admin_update_delete.sql
# 0008_performance_indexes.sql
```

---

## Build & Deploy

### Build falha com erro de tipo

```bash
pnpm build  # Next.js build com type checking
```

Erros comuns:
- `Property 'x' does not exist on type 'y'` → verifique `types/app.ts` e `types/supabase.ts`
- Import path errado → use alias `@/` (configurado no `tsconfig.json`)

### White screen após deploy (Vercel)

**Causa:** variáveis de ambiente faltando no dashboard da Vercel.

**Verifique:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `USE_DEMO_MODE` (true/false)

### Variáveis não expostas no client

**Regra:** só `NEXT_PUBLIC_*` são expostas ao browser. `SUPABASE_SERVICE_ROLE_KEY` e `LLM_API_KEY` nunca devem ter prefixo `NEXT_PUBLIC_`.

---

## Performance

### Kanban lento com muitos leads

**Solução:**
1. Aplique a migration `0008_performance_indexes.sql`
2. Use `.limit(100)` nas queries (já implementado no `getDashboardMetrics.ts`)
3. Selecione apenas campos necessários: `.select('id,name,stage_id,company')`

### Bundle JS muito grande

```bash
pnpm build
# Verifique o output de build para cada rota
```

Otimizações aplicadas:
- Rotas com `dynamic='force-dynamic'` onde necessário
- Shadcn/ui com tree-shaking
- Fontes carregadas com `next/font`

### Queries lentas no banco

```bash
# Rodar script de análise
psql "$DATABASE_URL" -f scripts/analyze-slow-queries.sql
```

---

## Testes

### Vitest não encontra módulo @/

**Solução:** `vitest.config.ts` já configurado com alias `@` → `./`. Verifique se está na raiz.

### Playwright timeout / elemento não encontrado

**Solução:**
- Use `USE_DEMO_MODE=true` para ter dados previsíveis
- Aumente timeout: `{ timeout: 30000 }`
- Verifique data-testid no componente

### MSW não intercepta

**Solução:** `tests/setup/vitest.setup.ts` já configura `beforeAll(() => server.listen())`. Se falhar, o `onUnhandledRequest: 'error'` mostra qual URL não foi mockada.

---

## Demo Mode

### Dados demo não aparecem

**Verifique:**
```bash
echo $USE_DEMO_MODE  # deve ser "true"
```

Os dados demo são definidos em `lib/demo/data.ts` e incluem:
- 1 workspace (`demo-workspace`)
- 7 funnel stages
- 6 leads
- 3 campanhas
- 2 custom fields

### Ações não persistem no demo

**Comportamento esperado:** o `demoStore` é in-memory. Ao recarregar a página, volta ao estado inicial. Para persistência, use Supabase real (desative `USE_DEMO_MODE`).

---

## Comandos de Diagnóstico Rápidos

```bash
# Status do Supabase
supabase status

# Logs de Edge Function
supabase functions logs generate-messages

# Aplicar migrations
supabase db push --include-all

# Build local
pnpm build

# Testes unitários
pnpm test:unit

# Testes E2E
pnpm test:e2e --headed

# Dev server
pnpm dev
```

---

## Reset Nuclear

```bash
# Limpar tudo e recomeçar
rm -rf node_modules .next
pnpm install
supabase db reset
pnpm dev
```
