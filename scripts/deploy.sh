#!/usr/bin/env bash

set -euo pipefail

# Deploy automatizado do SDRFlow AI.
# 1) valida dependências
# 2) valida ambiente
# 3) faz build
# 4) publica Edge Functions
# 5) orienta deploy na Vercel

required_bins=(supabase vercel pnpm)
for bin in "${required_bins[@]}"; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "Erro: '$bin' não está no PATH. Instale a CLI antes de continuar."
    exit 1
  fi
done

if [ ! -f ".env.local" ]; then
  echo "Erro: arquivo .env.local não encontrado."
  exit 1
fi

echo "==> Rodando build"
pnpm build

echo "==> Fazendo deploy das Edge Functions"
for fn in generate-messages move-lead-stage send-message-simulated trigger-generate-messages; do
  echo "Deployando função: $fn"
  supabase functions deploy "$fn"
done

echo "==> Verificando autenticação na Vercel"
if vercel whoami >/dev/null 2>&1; then
  echo "Usuário autenticado na Vercel."
  echo "Para publicar em produção, execute: vercel --prod"
else
  echo "Não foi possível confirmar login na Vercel."
  echo "Faça login com: vercel login"
  echo "Depois, publique com: vercel --prod"
fi

echo "Deploy automatizado finalizado."
