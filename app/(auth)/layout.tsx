import type { ReactNode } from 'react'
import { GitBranch, Sparkles, TrendingUp, BarChart3 } from 'lucide-react'

const features = [
  {
    Icon: GitBranch,
    title: 'Pipeline Visual',
    desc:  'Kanban intuitivo com automação por etapa',
  },
  {
    Icon: Sparkles,
    title: 'IA que escreve',
    desc:  'Mensagens personalizadas geradas em segundos',
  },
  {
    Icon: TrendingUp,
    title: 'Qualificação automática',
    desc:  'Score de leads baseado em comportamento',
  },
  {
    Icon: BarChart3,
    title: 'Análise de funil',
    desc:  'Taxa de conversão em tempo real',
  },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Left panel — branding */}
      <div
        className="relative hidden w-[480px] shrink-0 overflow-hidden lg:block"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-dim)',
        }}
      >
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

        {/* Ambient amber orb — center-left */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[100px]"
          style={{ backgroundColor: 'var(--amber)', opacity: 0.09 }}
        />

        {/* Cyan orb — top right corner */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[60px]"
          style={{ backgroundColor: 'var(--cyan)', opacity: 0.08 }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full min-h-screen flex-col px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: 'var(--amber)',
                boxShadow: '0 0 20px var(--amber-glow)',
              }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#07101A" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span
              className="font-display text-lg font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              SDRFlow AI
            </span>
          </div>

          {/* Main content — vertically centered */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Tagline */}
            <div className="mb-10">
              <p
                className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'var(--amber)' }}
              >
                Por que SDRFlow
              </p>
              <h2
                className="font-display text-3xl font-bold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Feito para times<br />de vendas modernos
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-5">
              {features.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'var(--amber-glow)',
                      border: '1px solid rgba(245,158,11,0.22)',
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: 'var(--amber)' }} />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {title}
                    </div>
                    <div
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div
              className="mt-10 rounded-xl p-5"
              style={{
                backgroundColor: 'rgba(245,158,11,0.04)',
                border: '1px solid rgba(245,158,11,0.12)',
              }}
            >
              <p
                className="font-display text-sm italic leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                &ldquo;A automação de vendas que realmente entende seu funil. Converta leads em oportunidades com inteligência.&rdquo;
              </p>
              <p
                className="mt-3 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--amber)' }}
              >
                Equipe SDRFlow
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-[11px]"
            style={{ color: 'var(--text-muted)' }}
          >
            &copy; {new Date().getFullYear()} SDRFlow AI. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
