'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUp } from '@/features/auth/actions/signUp'
import { useToast } from '@/lib/hooks/useToast'
import { Mail, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react'
import Link from 'next/link'

const schema = z
  .object({
    email: z.string().email('Informe um e-mail válido'),
    password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres'),
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
    setMessage('Conta criada. Redirecionando para o login...')
    toast.success('Conta criada!')
    setTimeout(() => router.push('/login'), 800)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-500">Comece a usar o SDRFlow AI gratuitamente</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} method="POST" action="#" noValidate className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              placeholder="voce@empresa.com"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </div>
        )}
        {message && (
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Criando conta...
            </>
          ) : (
            <>
              Criar conta <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem uma conta?{' '}
        <Link href="/login" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
          Entrar
        </Link>
      </p>
    </div>
  )
}
