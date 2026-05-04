'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { resetPasswordForEmail } from '@/features/auth/actions/resetPassword'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido'),
})
type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<{ error?: string; success?: string }>({})
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setStatus({})
    const formData = new FormData()
    formData.append('email', values.email)
    const result = await resetPasswordForEmail(formData)
    setStatus(result)
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Esqueceu a senha?</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Informe seu e-mail para receber o link de recuperação
        </p>
      </div>

      {status.success ? (
        <div
          className="flex flex-col items-center gap-3 rounded-xl p-6 text-center"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: 'var(--success)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{status.success}</p>
          <Link
            href="/login"
            className="mt-2 text-sm font-semibold underline underline-offset-4"
            style={{ color: 'var(--amber)' }}
          >
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="forgot-email"
              className="block text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              E-mail
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                id="forgot-email"
                type="email"
                placeholder="voce@empresa.com"
                className="field py-2.5 pl-10 pr-3"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.email.message}</p>
            )}
          </div>

          {status.error && (
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--error-dim)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {status.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-amber flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
            ) : (
              <>Enviar link <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
