'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Sparkles } from 'lucide-react'
import { createWorkspace } from '@/features/workspaces/actions/createWorkspace'
import { useToast } from '@/lib/hooks/useToast'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
})

type FormValues = z.infer<typeof schema>

export function CreateWorkspaceForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setError('')
    const result = await createWorkspace(values)
    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
      return
    }
    toast.success('Workspace criado!')
    router.push('/dashboard')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 py-12">
      <div className="editorial-card surface-grain w-full p-6 sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="eyebrow">Onboarding</p>
          <h1 className="font-display text-paper text-2xl font-semibold tracking-tight">
            Criar workspace
          </h1>
          <p className="text-paper-muted text-sm">
            Dê um nome ao seu workspace para começar a organizar leads e campanhas.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="ws-name"
              className="text-paper-muted block font-mono text-2xs uppercase tracking-[0.14em]"
            >
              Nome
            </label>
            <input
              id="ws-name"
              placeholder="Acme Sales"
              className="field"
              aria-invalid={errors.name ? true : undefined}
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-negative text-xs">{errors.name.message}</p>
            ) : null}
          </div>

          {error ? (
            <p
              role="alert"
              className="text-negative border-negative/30 rounded-sm border px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--negative-bg)' }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-signal w-full py-3"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Criar workspace
          </button>
        </form>
      </div>
    </div>
  )
}
