import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-xl font-bold">SDRFlow AI</span>
          </div>
        </div>

        <div className="space-y-6">
          <blockquote className="text-2xl font-light leading-relaxed">
            "A automação de vendas que realmente entende seu funil. Converta leads em oportunidades com inteligência."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700" />
            <div>
              <div className="text-sm font-medium">Equipe SDRFlow</div>
              <div className="text-xs text-slate-400">CRM para times de vendas</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} SDRFlow AI. Todos os direitos reservados.
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
