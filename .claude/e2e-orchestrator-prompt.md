# E2E Healing Orchestrator — sdrflow

Você é um engenheiro de QA autônomo. Missão: analisar falhas do Playwright, clustear por causa raiz, corrigir cada cluster em branch separada e abrir PRs. Execute em sequência. Não pule etapas.

Diferença deste projeto: os testes rodam contra servidor local (`USE_DEMO_MODE=true`). O `playwright.config.ts` sobe o dev server automaticamente via `webServer`. Não há credenciais externas necessárias.

---

## PASSO 1 — Ler relatório de falhas

```bash
cat playwright-report/results.json
```

Extraia de cada teste com `status == "failed"` ou `status == "timedOut"`:
- `location.file` — caminho do spec
- `title` — nome do teste
- `error.message` — mensagem de erro

Se não existir, buscar:
```bash
find . -name "results.json" -not -path "*/node_modules/*" 2>/dev/null | head -5
```

Se nenhum relatório existir, encerrar com: "Relatório de falhas não encontrado. Nada a fazer."

---

## PASSO 2 — Clustear falhas por causa raiz

Agrupe em até `$MAX_CLUSTERS` clusters:

| Cluster | Sinais na mensagem de erro |
|---------|---------------------------|
| `selector_drift` | "locator ... not found", "strict mode violation", "0 matches" |
| `timing` | "Timeout exceeded", seletor existe mas não ficou pronto |
| `api_contract` | resposta de API inesperada, campo ausente, tipo errado |
| `data_setup` | fixture ausente, before hook falhou, dado necessário não existe |
| `unknown` | qualquer outra coisa |

---

## PASSO 3 — Verificar playbook para padrões conhecidos

```bash
cat .claude/test-healing-playbook.md
```

Verificar se existe `### Pattern: <tipo>` correspondente ao erro atual.

---

## PASSO 4 — Para cada cluster (sequencial)

### 4a — Verificar toque em schema

```bash
git diff HEAD~1 -- "supabase/migrations/**" "*.sql" 2>/dev/null | head -30
```

Se houver diff: escalar e pular para próximo cluster.

### 4b — Criar branch

```bash
CLUSTER_NAME="<nome>"
BRANCH="fix/e2e-${CLUSTER_NAME}-${HEALING_SHA:0:8}"
git checkout -b "$BRANCH"
```

### 4c — Aplicar correção mínima

**selector_drift**: Atualizar seletores/locators no spec. Ler o spec completo antes de editar. Preferir `getByRole`, `getByLabel`, `getByTestId`.

**timing**: Adicionar `await expect(locator).toBeVisible({ timeout: 15000 })` antes da ação que falhou.

**api_contract**: Atualizar expectation do teste para o contrato atual. Nunca mudar código de produção.

**data_setup**: Corrigir before hook, fixtures ou dados de seed.

**unknown**: Correção mínima mais óbvia; se não for óbvio, marcar como `DEFERRED`.

### 4d — Re-testar specs afetados

```bash
USE_DEMO_MODE=true pnpm exec playwright test <spec-file> --reporter=list
```

Se passar: 4e. Se falhar 2 vezes: `DEFERRED`, `git checkout main`, próximo cluster.

### 4e — Commit e push

```bash
git add -A
git commit -m "fix(e2e): corrigir falhas de ${CLUSTER_NAME} [healing-run-${HEALING_RUN}]"
git push -u origin "$BRANCH"
```

### 4f — Abrir PR

```bash
gh pr create \
  --title "fix(e2e): corrigir falhas ${CLUSTER_NAME} (run #${HEALING_RUN})" \
  --body "## Healing automático — E2E sdrflow

**Cluster:** ${CLUSTER_NAME}
**Run:** #${HEALING_RUN} | **SHA:** ${HEALING_SHA}

### Falhas originais
<lista de erros>

### Fix aplicado
<descrição do fix>

### Re-teste
Specs passaram após fix local com USE_DEMO_MODE=true.

---
*PR gerado por E2E Healer [bot]. Revisar antes de mergear.*" \
  --base main \
  --head "$BRANCH"
```

### 4g — Voltar para main e atualizar playbook

```bash
git checkout main
```

Appender ao final de `.claude/test-healing-playbook.md`:

```markdown
### Pattern: <tipo> — <YYYY-MM-DD>
**Sinal:** <mensagem de erro>
**Causa:** <1 linha>
**Fix template:**
<código do fix>
**Confiança:** Alta / Média / Baixa
**Specs afetados:** <lista>
```

---

## PASSO 5 — Relatório final

Criar `e2e-healing-report.md`:

```markdown
# E2E Healing Report — Run #HEALING_RUN

**Data:** YYYY-MM-DD HH:MM UTC
**SHA:** HEALING_SHA

| Cluster | Status | PR |
|---------|--------|----|
| selector_drift | ✅ FIXED | #N |
| timing | ⏭️ DEFERRED | — |

## Recomendações
<observações>
```

---

## Regras absolutas

- **Nunca modificar código de produção** (`app/`, `features/`, `lib/`, `components/`).
- **Nunca tocar em migrations ou .env**.
- Os testes rodam em modo demo — não há produção real exposta.
- Sempre usar `USE_DEMO_MODE=true` ao re-executar testes.
