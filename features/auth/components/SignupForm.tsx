'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUp } from '@/features/auth/actions/signUp'
import { useToast } from '@/lib/hooks/useToast'

const schema = z.object({ email: z.string().email('Informe um e-mail válido'), password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres'), confirmPassword: z.string().min(1, 'Confirme sua senha') }).refine((data) => data.password === data.confirmPassword, { message: 'As senhas não conferem', path: ['confirmPassword'] })
type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const router = useRouter(); const [message, setMessage] = useState(''); const [serverError, setServerError] = useState(''); const { toast } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const onSubmit = async ({ email, password }: FormValues) => { setServerError(''); setMessage(''); const result = await signUp({ email, password }); if (result?.error) { setServerError(result.error); toast.error(result.error); return } setMessage('Conta criada. Redirecionando para o login...'); toast.success('Conta criada!'); setTimeout(() => router.push('/login'), 800) }
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm"><div className="space-y-2"><label className="block text-sm font-medium">E-mail</label><input className="w-full rounded border px-3 py-2" type="email" {...register('email')} />{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}</div><div className="space-y-2"><label className="block text-sm font-medium">Senha</label><input className="w-full rounded border px-3 py-2" type="password" {...register('password')} />{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}</div><div className="space-y-2"><label className="block text-sm font-medium">Confirmar senha</label><input className="w-full rounded border px-3 py-2" type="password" {...register('confirmPassword')} />{errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}</div>{serverError && <p className="text-sm text-red-600">{serverError}</p>}{message && <p className="text-sm text-green-600">{message}</p>}<button disabled={isSubmitting} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">Criar conta</button></form>
}
