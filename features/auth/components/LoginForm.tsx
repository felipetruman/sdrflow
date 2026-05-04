'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signIn } from '@/features/auth/actions/signIn'
import { useToast } from '@/lib/hooks/useToast'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido'),
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
      <div className="mb-10">
        <Link
          href="/"
          className="font-display text-paper hover:text-signal mb-8 inline-flex items-baseline text-base font-bold tracking-tight transition-colors"
          aria-label="Voltar para a home"
        >
          sdr<span className="text-signal">·</span>flow
        </Link>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight">
          Acessar workspace
        </h1>
        <p className="text-paper-muted mt-2 text-sm">Entre na sua conta para continuar.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-paper-muted block font-mono text-2xs uppercase tracking-[0.14em]"
          >
            E-mail
          </label>
          <div className="relative">
            <Mail
              className="text-paper-quiet pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              aria-hidden
            />
            <input
              id="email"
              type="email"
              placeholder="voce@empresa.com"
              autoComplete="email"
              className="field py-2.5 pl-9 pr-3"
              aria-invalid={errors.email ? true : undefined}
              {...register('email')}
            />
          </div>
          {errors.email ? (
            <p className="text-negative text-xs">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-paper-muted block font-mono text-2xs uppercase tracking-[0.14em]"
          >
            Senha
          </label>
          <div className="relative">
            <Lock
              className="text-paper-quiet pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              aria-hidden
            />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="field py-2.5 pl-9 pr-3"
              aria-invalid={errors.password ? true : undefined}
              {...register('password')}
            />
          </div>
          {errors.password ? (
            <p className="text-negative text-xs">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-paper-quiet hover:text-signal text-xs transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>

        {serverError ? (
          <div
            role="alert"
            className="text-negative border-negative/30 rounded-sm border px-3 py-2 text-sm"
            style={{ backgroundColor: 'var(--negative-bg)' }}
          >
            {serverError}
          </div>
        ) : null}

        <button type="submit" disabled={isSubmitting} className="btn-signal w-full py-3">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Entrando…
            </>
          ) : (
            <>
              Entrar
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-paper-muted mt-8 text-center text-sm">
        Ainda não tem conta?{' '}
        <Link
          href="/signup"
          className="text-signal hover:text-signal-soft font-semibold transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
