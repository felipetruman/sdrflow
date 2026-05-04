'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signUp } from '@/features/auth/actions/signUp'
import { useToast } from '@/lib/hooks/useToast'

const schema = z
  .object({
    email: z.string().email('Informe um e-mail válido'),
    password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [serverError, setServerError] = useState('')
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password }: FormValues) => {
    setServerError('')
    setMessage('')
    const result = await signUp({ email, password })
    if (result?.error) {
      setServerError(result.error)
      toast.error(result.error)
      return
    }
    setMessage('Conta criada. Redirecionando…')
    toast.success('Conta criada!')
    setTimeout(() => router.push('/login'), 800)
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
          Criar conta
        </h1>
        <p className="text-paper-muted mt-2 text-sm">
          Comece a usar o SDRFlow AI gratuitamente.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <AuthField
          id="email"
          label="E-mail"
          type="email"
          placeholder="voce@empresa.com"
          icon={Mail}
          autoComplete="email"
          register={register('email')}
          error={errors.email?.message}
        />
        <AuthField
          id="password"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          icon={Lock}
          autoComplete="new-password"
          register={register('password')}
          error={errors.password?.message}
        />
        <AuthField
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          icon={Lock}
          autoComplete="new-password"
          register={register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {serverError ? (
          <div
            role="alert"
            className="text-negative border-negative/30 rounded-sm border px-3 py-2 text-sm"
            style={{ backgroundColor: 'var(--negative-bg)' }}
          >
            {serverError}
          </div>
        ) : null}
        {message ? (
          <div
            role="status"
            className="text-positive border-positive/30 rounded-sm border px-3 py-2 text-sm"
            style={{ backgroundColor: 'var(--positive-bg)' }}
          >
            {message}
          </div>
        ) : null}

        <button type="submit" disabled={isSubmitting} className="btn-signal w-full py-3">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Criando conta…
            </>
          ) : (
            <>
              Criar conta
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-paper-muted mt-8 text-center text-sm">
        Já tem uma conta?{' '}
        <Link
          href="/login"
          className="text-signal hover:text-signal-soft font-semibold transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}

import type { LucideIcon } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface AuthFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  icon: LucideIcon
  autoComplete?: string
  register: UseFormRegisterReturn
  error?: string
}

function AuthField({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  autoComplete,
  register,
  error,
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-paper-muted block font-mono text-2xs uppercase tracking-[0.14em]"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className="text-paper-quiet pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
          aria-hidden
        />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          className="field py-2.5 pl-9 pr-3"
          {...register}
        />
      </div>
      {error ? <p className="text-negative text-xs">{error}</p> : null}
    </div>
  )
}
