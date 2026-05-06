import { Cpu, CircleAlert, CircleCheck, FileText } from 'lucide-react'
import { getAiStatus } from '@/features/ai-messages/queries/getAiStatus'

export default async function AiSettingsPage() {
  const status = await getAiStatus()

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 md:px-6 md:py-8">
      <header className="space-y-2 pb-4">
        <p className="eyebrow">Configuração</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Integração IA
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Status da integração com modelos de linguagem (LLM) usados na geração automática de mensagens.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <section className="editorial-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow-quiet">Status</p>
          <StatusPill status={status} />
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Modo" value={status.mode === 'demo' ? 'Demo (offline)' : 'Cloud'} />
          <Field label="Modelo" value={status.model} />
          <Field label="Endpoint" value={status.baseUrl} />
        </dl>
      </section>

      {status.mode === 'demo' ? (
        <section className="border-ink-700 bg-ink-900 rounded-sm border p-4">
          <div className="flex gap-3">
            <FileText className="text-paper-quiet mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="space-y-1">
              <p className="text-paper text-sm font-medium">Modo demo</p>
              <p className="text-paper-muted text-xs leading-relaxed">
                A geração de mensagens em modo demo retorna templates locais hardcoded — não consome LLM real.
                Faça login com cadastro real (cloud) para usar a integração com o modelo configurado.
              </p>
            </div>
          </div>
        </section>
      ) : status.configured ? (
        <section className="border-signal-deep rounded-sm border p-4" style={{ backgroundColor: 'var(--signal-bg)' }}>
          <div className="flex gap-3">
            <Cpu className="text-signal mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="space-y-1">
              <p className="text-paper text-sm font-medium">LLM ativo</p>
              <p className="text-paper-muted text-xs leading-relaxed">
                A geração de mensagens usa <strong>{status.model}</strong> via <code className="text-[11px]">{status.baseUrl}</code>.
                As respostas mostram o badge <em>IA · modelo</em> quando vêm do LLM, ou <em>Template offline</em> se o LLM falhar.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-negative/30 rounded-sm border p-4" style={{ backgroundColor: 'var(--negative-bg)' }}>
          <div className="flex gap-3">
            <CircleAlert className="text-negative mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="space-y-1">
              <p className="text-paper text-sm font-medium">LLM não configurado</p>
              <p className="text-paper-muted text-xs leading-relaxed">
                A variável <code className="text-[11px]">LLM_API_KEY</code> não está definida nos secrets da Edge Function.
                Configure via:
              </p>
              <pre className="bg-ink-950 border-ink-700 text-paper-muted mt-2 overflow-x-auto rounded-sm border p-2 text-[11px]">
{`supabase secrets set LLM_API_KEY=sk-... --project-ref <ref>
supabase secrets set LLM_MODEL=gpt-4o-mini --project-ref <ref>
supabase secrets set LLM_BASE_URL=https://api.openai.com/v1 --project-ref <ref>`}
              </pre>
              <p className="text-paper-muted text-xs leading-relaxed">
                Enquanto não estiver configurado, a geração devolve templates locais (badge <em>Template offline</em>).
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: { configured: boolean; mode: 'cloud' | 'demo' } }) {
  if (status.mode === 'demo') {
    return (
      <span className="text-paper-quiet border-ink-700 bg-ink-900 inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
        <FileText className="h-2.5 w-2.5" aria-hidden />
        Demo
      </span>
    )
  }
  if (status.configured) {
    return (
      <span className="text-signal border-signal-deep inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase" style={{ backgroundColor: 'var(--signal-bg)' }}>
        <CircleCheck className="h-2.5 w-2.5" aria-hidden />
        Ativo
      </span>
    )
  }
  return (
    <span className="text-negative border-negative/30 inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase" style={{ backgroundColor: 'var(--negative-bg)' }}>
      <CircleAlert className="h-2.5 w-2.5" aria-hidden />
      Não configurado
    </span>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-ink-700 bg-ink-900 rounded-sm border px-3 py-2">
      <dt className="text-paper-quiet text-[10px] tracking-wide uppercase">{label}</dt>
      <dd className="text-paper mt-1 text-sm font-medium break-all">{value}</dd>
    </div>
  )
}
