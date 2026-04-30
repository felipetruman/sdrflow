import Link from 'next/link'
import { ArrowLeft, LayoutGrid, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <SearchX className="h-7 w-7" />
        </div>
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-slate-500">Erro 404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Página não encontrada</h1>
        <p className="mt-3 text-slate-600">O conteúdo pode ter sido movido ou removido. Tente voltar para uma área conhecida do app.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
            Ir para o dashboard
          </Link>
          <Link href="/kanban" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50">
            <LayoutGrid className="h-4 w-4" />
            Abrir kanban
          </Link>
        </div>
      </div>
    </main>
  )
}
