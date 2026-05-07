'use client'

import { useState, useTransition } from 'react'
import { Star, Trash2, Plus, Loader2, CircleCheck, CircleAlert, CircleMinus } from 'lucide-react'
import type { AiStatus, AiKeySummary } from '@/features/ai-messages/queries/getAiStatus'
import {
  validateAndAddAiKey,
  removeAiKey,
  setPrimaryAiKey,
  toggleAiKeyActive,
} from '@/features/ai-messages/actions/aiKeysActions'

interface Props {
  initialStatus: AiStatus
}

const PROVIDERS = ['gemini', 'openai'] as const
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']
const OPENAI_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']

export function AiKeysManager({ initialStatus }: Props) {
  const [keys, setKeys] = useState<AiKeySummary[]>(initialStatus.keys)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini')
  const [model, setModel] = useState('gemini-2.5-flash')
  const [keyValue, setKeyValue] = useState('')
  const [label, setLabel] = useState('')
  const [setAsPrimary, setSetAsPrimary] = useState(keys.length === 0)

  function flash(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  function handleProviderChange(p: 'gemini' | 'openai') {
    setProvider(p)
    setModel(p === 'gemini' ? GEMINI_MODELS[0] : OPENAI_MODELS[0])
  }

  function handleAdd() {
    setError(null)
    startTransition(async () => {
      const res = await validateAndAddAiKey({ provider, model, key_value: keyValue, label: label || null, setAsPrimary })
      if (res.error) {
        setError(res.error)
        return
      }
      flash(res.status === 'ok' ? 'Chave adicionada e validada com sucesso.' : `Chave adicionada (status: ${res.status}).`)
      setKeyValue('')
      setLabel('')
      setShowForm(false)
      // refetch via server revalidation — router.refresh() would need useRouter
      window.location.reload()
    })
  }

  function handleRemove(keyId: string) {
    startTransition(async () => {
      const res = await removeAiKey(keyId)
      if (res.error) { setError(res.error); return }
      setKeys((prev) => prev.filter((k) => k.id !== keyId))
      flash('Chave removida.')
    })
  }

  function handleSetPrimary(keyId: string) {
    startTransition(async () => {
      const res = await setPrimaryAiKey(keyId)
      if (res.error) { setError(res.error); return }
      setKeys((prev) => prev.map((k) => ({ ...k, is_primary: k.id === keyId, is_active: k.id === keyId ? true : k.is_active })))
      flash('Chave primária definida.')
    })
  }

  function handleToggle(keyId: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleAiKeyActive(keyId, !current)
      if (res.error) { setError(res.error); return }
      setKeys((prev) => prev.map((k) => k.id === keyId ? { ...k, is_active: !current } : k))
    })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow-quiet">Chaves de API</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-ghost text-xs gap-1 inline-flex items-center"
          aria-expanded={showForm}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Adicionar chave
        </button>
      </div>

      {error && (
        <div className="border-negative/30 bg-negative/5 rounded-sm border px-3 py-2 text-xs text-negative flex gap-2 items-start">
          <CircleAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="border-signal-deep rounded-sm border px-3 py-2 text-xs text-signal flex gap-2 items-start" style={{ backgroundColor: 'var(--signal-bg)' }}>
          <CircleCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
          {successMsg}
        </div>
      )}

      {showForm && (
        <div className="editorial-card p-4 space-y-3">
          <p className="text-paper text-sm font-medium">Nova chave de API</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-paper-quiet text-[10px] uppercase tracking-wide block mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value as 'gemini' | 'openai')}
                className="input-field w-full text-sm"
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>{p === 'gemini' ? 'Google Gemini' : 'OpenAI'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-paper-quiet text-[10px] uppercase tracking-wide block mb-1">Modelo</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="input-field w-full text-sm"
              >
                {(provider === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-paper-quiet text-[10px] uppercase tracking-wide block mb-1">Chave API</label>
            <input
              type="password"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder={provider === 'gemini' ? 'AIza...' : 'sk-...'}
              className="input-field w-full text-sm font-mono"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-paper-quiet text-[10px] uppercase tracking-wide block mb-1">Rótulo (opcional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="ex.: Conta pessoal"
                className="input-field w-full text-sm"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsPrimary}
                  onChange={(e) => setSetAsPrimary(e.target.checked)}
                  className="rounded border-ink-600"
                />
                <span className="text-paper-muted text-xs">Definir como primária</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={isPending || keyValue.length < 20}
              className="btn-primary text-sm gap-1.5 inline-flex items-center"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />}
              Adicionar e validar
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="editorial-card p-5 text-center">
          <p className="text-paper-muted text-sm">Nenhuma chave configurada.</p>
          <p className="text-paper-quiet text-xs mt-1">Adicione uma chave acima para habilitar a geração por IA.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {keys.map((key) => (
            <li key={key.id} className="editorial-card px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {key.is_primary && (
                    <span className="text-signal border-signal-deep inline-flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase" style={{ backgroundColor: 'var(--signal-bg)' }}>
                      <Star className="h-2.5 w-2.5" aria-hidden />
                      Primária
                    </span>
                  )}
                  <span className="text-paper text-sm font-medium truncate">
                    {key.label ?? key.provider}
                  </span>
                  <span className="text-paper-quiet text-xs">{key.model}</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-paper-muted text-[11px] font-mono">{key.masked}</code>
                  <StatusDot status={key.last_status} active={key.is_active} />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!key.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(key.id)}
                    disabled={isPending}
                    title="Definir como primária"
                    className="btn-ghost p-1.5 text-paper-quiet hover:text-signal"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
                <button
                  onClick={() => handleToggle(key.id, key.is_active)}
                  disabled={isPending}
                  title={key.is_active ? 'Desativar' : 'Ativar'}
                  className="btn-ghost p-1.5 text-paper-quiet"
                >
                  <CircleMinus className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  onClick={() => handleRemove(key.id)}
                  disabled={isPending}
                  title="Remover chave"
                  className="btn-ghost p-1.5 text-paper-quiet hover:text-negative"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function StatusDot({ status, active }: { status: AiKeySummary['last_status']; active: boolean }) {
  if (!active) return <span className="text-paper-quiet text-[10px]">inativa</span>
  if (status === 'ok') return <span className="text-signal text-[10px]">● ok</span>
  if (status === 'rate_limited') return <span className="text-[10px]" style={{ color: 'var(--gold)' }}>● rate limited</span>
  if (status === 'invalid') return <span className="text-negative text-[10px]">● inválida</span>
  return <span className="text-paper-quiet text-[10px]">● não validada</span>
}
