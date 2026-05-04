'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '@/features/auth/actions/signIn'
import { useToast } from '@/lib/hooks/useToast'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  email:    z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    const result = await signIn(values)
    if (result?.error) {
      setServerError(result.error)
      toast.error(result.error)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--amber)', boxShadow: '0 0 30px var(--amber-glow)' }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="var(--text-inverse)" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Entre na sua conta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} method="POST" action="#" noValidate className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              id="email"
              type="email"
              placeholder="voce@empresa.com"
              className="sdr-input py-2.5 pl-10 pr-3"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="sdr-input py-2.5 pl-10 pr-3"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'var(--error-dim)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-amber flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold"
        >
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Entrando...</>
          ) : (
            <>Entrar <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        Ainda não tem conta?{' '}
        <Link href="/signup" className="font-semibold underline underline-offset-4" style={{ color: 'var(--amber)' }}>
          Criar conta
        </Link>
      </p>
    </div>
  )
}
