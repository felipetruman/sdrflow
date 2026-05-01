import Link from 'next/link'
import { ArrowRight, BarChart3, Bot, KanbanSquare, Shield, Users, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-slate-900">SDRFlow AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Entrar</Link>
            <Link href="/signup" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Criar conta</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          CRM leve para equipes de <span className="text-slate-600">pré-vendas</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Organize leads, movimente em Kanban, gere mensagens com IA e acompanhe métricas — tudo em um só lugar.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Começar grátis <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Acessar conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">O que você pode fazer</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <KanbanSquare className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Kanban drag-and-drop</h3>
              <p className="mt-2 text-sm text-slate-600">Movimente leads entre etapas do funil com arrastar e soltar.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Mensagens com IA</h3>
              <p className="mt-2 text-sm text-slate-600">Gere abordagens personalizadas para cada lead automaticamente.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Dashboard e métricas</h3>
              <p className="mt-2 text-sm text-slate-600">Acompanhe performance do time e evolução do pipeline.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Workspaces</h3>
              <p className="mt-2 text-sm text-slate-600">Multi-tenancy por workspace com isolamento completo de dados.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">RLS e segurança</h3>
              <p className="mt-2 text-sm text-slate-600">Row Level Security no PostgreSQL garante que cada time só veja seus dados.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Campanhas de abordagem</h3>
              <p className="mt-2 text-sm text-slate-600">Configure contexto e gatilhos para gerar mensagens no momento certo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">Tecnologias</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Supabase', 'dnd-kit', 'React Hook Form', 'Zod', 'lucide-react'].map((tech) => (
            <span key={tech} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700">{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          SDRFlow AI — Mini CRM para pré-vendas. Feito com Next.js + Supabase.
        </div>
      </footer>
    </div>
  )
}
