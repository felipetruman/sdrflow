'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '@/features/auth/actions/signIn'
import { useToast } from '@/lib/hooks/useToast'

const schema = z.object({ email: z.string().email('Informe um e-mail válido'), password: z.string().min(1, 'Informe sua senha') })
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter(); const [serverError, setServerError] = useState(''); const { toast } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const onSubmit = async (values: FormValues) => { setServerError(''); const result = await signIn(values); if (result?.error) { setServerError(result.error); toast.error(result.error); return } router.push('/dashboard') }
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm"><div className="space-y-2"><label className="block text-sm font-medium">E-mail</label><input className="w-full rounded border px-3 py-2" type="email" {...register('email')} />{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}</div><div className="space-y-2"><label className="block text-sm font-medium">Senha</label><input className="w-full rounded border px-3 py-2" type="password" {...register('password')} />{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}</div>{serverError && <p className="text-sm text-red-600">{serverError}</p>}<button disabled={isSubmitting} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">Entrar</button></form>
}
