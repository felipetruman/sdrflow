'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[AppError]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-7 w-7 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900">Erro ao carregar esta página</h2>
        <p className="max-w-sm text-sm text-slate-500">
          Algo inesperado aconteceu. Tente novamente ou volte para o início.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400">Código: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
        <Link
          href="/kanban"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
