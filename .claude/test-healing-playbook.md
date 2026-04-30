# E2E Test Healing Playbook — sdrflow

Arquivo append-only. O orquestrador de healing adiciona entradas automaticamente.
Não remover entradas existentes — use-as para aprendizado cumulativo.

Contexto: testes rodam em modo demo (`USE_DEMO_MODE=true`), sem dependências externas.

---

## Clusters suportados

| Tipo | Sinal principal | Fix padrão |
|------|-----------------|------------|
| `selector_drift` | "locator not found", "0 matches" | Atualizar seletor para role/label/data-testid mais robusto |
| `timing` | "Timeout exceeded" com seletor existente | Adicionar `expect(locator).toBeVisible({ timeout: 15000 })` |
| `api_contract` | resposta inesperada, campo ausente | Atualizar expectation do teste |
| `data_setup` | fixture ausente, before hook falhou | Corrigir before hook ou dados de seed |
| `unknown` | Qualquer outro | Análise manual necessária |

---

## Escalação obrigatória

- Mudanças em `supabase/migrations/` ou `*.sql`
- Fix exige modificar código de produção (`app/`, `features/`, `lib/`)
- Causa raiz não identificável
- Mesmo cluster falhou em 2 runs consecutivos

---

## Patterns Documentados

<!-- O orquestrador appenda abaixo desta linha -->
