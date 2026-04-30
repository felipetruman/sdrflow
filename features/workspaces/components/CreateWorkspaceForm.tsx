'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createWorkspace } from '@/features/workspaces/actions/createWorkspace'
import { useToast } from '@/lib/hooks/useToast'

const schema = z.object({ name: z.string().min(2, 'Nome obrigatório') })
type FormValues = z.infer<typeof schema>

export function CreateWorkspaceForm() {
  const router = useRouter(); const [error, setError] = useState(''); const { toast } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const onSubmit = async (values: FormValues) => { setError(''); const result = await createWorkspace(values); if (result?.error) { setError(result.error); toast.error(result.error); return } toast.success('Workspace criado!'); router.push('/dashboard') }
  return <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 rounded-lg border bg-white p-6"><input className="w-full rounded border px-3 py-2" placeholder="Nome do workspace" {...register('name')} />{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}{error && <p className="text-sm text-red-600">{error}</p>}<button className="rounded bg-black px-4 py-2 text-white" disabled={isSubmitting}>Criar workspace</button></form>
}
