'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUp } from '@/features/auth/actions/signUp'
import { useToast } from '@/lib/hooks/useToast'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const schema = z
  .object({
    email:           z.string().email('Informe um e-mail válido'),
    password:        z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
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
    setMessage('Conta criada. Redirecionando...')
    toast.success('Conta criada!')
    setTimeout(() => router.push('/login'), 800)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--amber)', boxShadow: '0 0 30px var(--amber-glow)' }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="var(--text-inverse)" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Criar conta</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Comece a usar o SDRFlow AI gratuitamente
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} method="POST" action="#" noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input id="email" type="email" placeholder="voce@empresa.com" className="sdr-input py-2.5 pl-10 pr-3" {...register('email')} />
          </div>
          {errors.email && <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input id="password" type="password" placeholder="Mínimo 8 caracteres" className="sdr-input py-2.5 pl-10 pr-3" {...register('password')} />
          </div>
          {errors.password && <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input id="confirmPassword" type="password" placeholder="Repita a senha" className="sdr-input py-2.5 pl-10 pr-3" {...register('confirmPassword')} />
          </div>
          {errors.confirmPassword && <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.confirmPassword.message}</p>}
        </div>

        {serverError && (
          <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'var(--error-dim)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {serverError}
          </div>
        )}
        {message && (
          <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)' }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
          style={{ backgroundColor: 'var(--amber)', color: 'var(--text-inverse)' }}
          onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--amber-dim)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--amber)' }}
        >
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Criando conta...</>
          ) : (
            <>Criar conta <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        Já tem uma conta?{' '}
        <Link href="/login" className="font-semibold underline underline-offset-4" style={{ color: 'var(--amber)' }}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
