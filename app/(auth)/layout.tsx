import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Left panel — branding */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-dim)',
        }}
      >
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 grid-bg opacity-30"
        />

        {/* Amber orb */}
        <div
          className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full blur-[128px]"
          style={{ backgroundColor: 'var(--amber)', opacity: 0.07 }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'var(--amber)' }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--text-inverse)" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span
            className="font-display text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            SDRFlow AI
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 space-y-6">
          <div
            className="h-px w-12"
            style={{ backgroundColor: 'var(--amber)' }}
          />
          <blockquote
            className="font-display text-2xl font-light leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            &ldquo;A automação de vendas que realmente entende seu funil. Converta leads em oportunidades com inteligência.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--amber)', border: '1px solid var(--border-base)' }}
            >
              SD
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Equipe SDRFlow
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                CRM para times de vendas
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} SDRFlow AI. Todos os direitos reservados.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
