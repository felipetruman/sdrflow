'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { updatePassword } from '@/features/auth/actions/resetPassword'

const schema = z.object({
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})
type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState<{ error?: string; success?: string }>({})
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setStatus({})
    const formData = new FormData()
    formData.append('password', values.password)
    formData.append('confirmPassword', values.confirmPassword)
    const result = await updatePassword(formData)
    setStatus(result)
    if (result.success) {
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (status.success) {
    return (
      <div className="w-full max-w-sm">
        <div
          className="flex flex-col items-center gap-3 rounded-xl p-6 text-center"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: 'var(--success)' }} />
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{status.success}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Redefinir senha</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Crie uma nova senha para sua conta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="reset-password"
            className="block text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Nova senha
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              id="reset-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="field py-2.5 pl-10 pr-3"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="reset-confirm"
            className="block text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Confirmar senha
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              id="reset-confirm"
              type="password"
              placeholder="Repita a senha"
              className="field py-2.5 pl-10 pr-3"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.confirmPassword.message}</p>
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
            <><Loader2 className="h-4 w-4 animate-spin" /> Redefinindo...</>
          ) : (
            <>Redefinir senha <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        <Link href="/login" className="font-semibold underline underline-offset-4" style={{ color: 'var(--amber)' }}>
          Voltar ao login
        </Link>
      </p>
    </div>
  )
}
