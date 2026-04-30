# Scripts

## Deploy de produção

```bash
bash scripts/deploy.sh
```

Ou, após instalar a dependência via `package.json`:

```bash
pnpm deploy:prod
```

### O que o script faz

1. Valida `supabase`, `vercel` e `pnpm`.
2. Confirma a existência de `.env.local`.
3. Executa `pnpm build`.
4. Faz deploy das Edge Functions.
5. Informa o próximo passo para publicar na Vercel.

### Observação

Se a CLI da Vercel não estiver autenticada, o script mostra a instrução de login e não interrompe o fluxo do Supabase.
