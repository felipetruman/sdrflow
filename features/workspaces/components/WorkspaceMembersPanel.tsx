'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { UserPlus, Trash2, User, ShieldCheck, Loader2 } from 'lucide-react'
import { getWorkspaceMembers } from '@/features/workspaces/queries/getWorkspaceMembers'
import { inviteWorkspaceMember } from '@/features/workspaces/actions/inviteWorkspaceMember'
import { removeWorkspaceMember } from '@/features/workspaces/actions/removeWorkspaceMember'

interface Member {
  id: string
  user_id: string
  workspace_id: string
  label: string
}

export function WorkspaceMembersPanel() {
  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member'>('member')
  const [isPending, setIsPending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function load() {
    const data = await getWorkspaceMembers()
    setMembers(data)
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleInvite(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setIsPending(true)
    setErrorMsg('')
    setSuccessMsg('')
    const result = await inviteWorkspaceMember({ email: email.trim(), role })
    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setSuccessMsg(`Convite enviado para ${email.trim()}`)
      setEmail('')
      await load()
    }
    setIsPending(false)
  }

  async function handleRemove(id: string, label: string) {
    if (!confirm(`Remover ${label} do workspace?`)) return
    setIsPending(true)
    setErrorMsg('')
    setSuccessMsg('')
    const result = await removeWorkspaceMember(id)
    if (result.error) setErrorMsg(result.error)
    else await load()
    setIsPending(false)
  }

  return (
    <div className="space-y-5">
      <section className="editorial-card p-5">
        <header className="pb-4">
          <p className="eyebrow-quiet">Convite</p>
          <h3 className="font-display text-paper mt-1 text-base font-semibold tracking-tight">
            Convidar novo membro
          </h3>
        </header>

        <form onSubmit={handleInvite} className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="invite-email" className="sr-only">
              E-mail do novo membro
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@empresa.com"
              required
              className="field"
            />
          </div>
          <label htmlFor="invite-role" className="sr-only">
            Papel do novo membro
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(event) => setRole(event.target.value as 'admin' | 'member')}
            className="field sm:w-44"
          >
            <option value="member">Membro</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            type="submit"
            disabled={isPending || !email.trim()}
            className="btn-signal whitespace-nowrap text-xs"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <UserPlus className="h-3.5 w-3.5" />
            )}
            Convidar
          </button>
        </form>

        {errorMsg ? (
          <p
            role="alert"
            className="text-negative border-negative/30 mt-3 rounded-sm border px-3 py-2 text-sm"
            style={{ backgroundColor: 'var(--negative-bg)' }}
          >
            {errorMsg}
          </p>
        ) : null}
        {successMsg ? (
          <p
            role="status"
            className="text-positive border-positive/30 mt-3 rounded-sm border px-3 py-2 text-sm"
            style={{ backgroundColor: 'var(--positive-bg)' }}
          >
            {successMsg}
          </p>
        ) : null}
      </section>

      <section className="editorial-card p-5">
        <header className="flex items-center justify-between pb-4">
          <div>
            <p className="eyebrow-quiet">Time</p>
            <h3 className="font-display text-paper mt-1 text-base font-semibold tracking-tight">
              Membros do workspace
            </h3>
          </div>
          <span className="chip">{members.length}</span>
        </header>

        <ul className="space-y-2">
          {members.length === 0 ? (
            <p className="text-paper-quiet text-sm">Nenhum membro encontrado.</p>
          ) : (
            members.map((member) => (
              <li
                key={member.id}
                className="bg-ink-900 border-ink-700 hover:border-ink-600 flex items-center gap-3 rounded-sm border px-3 py-2 transition-colors"
              >
                <div className="bg-ink-800 border-ink-700 text-paper-quiet flex h-7 w-7 shrink-0 items-center justify-center rounded-full border">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-paper-muted flex-1 truncate text-sm">{member.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(member.id, member.label)}
                  disabled={isPending}
                  className="text-paper-quiet hover:text-negative transition-colors disabled:opacity-40"
                  title={`Remover ${member.label}`}
                  aria-label={`Remover ${member.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="border-signal-deep flex items-start gap-3 rounded-sm border px-4 py-3" style={{ backgroundColor: 'var(--signal-bg)' }}>
        <ShieldCheck className="text-signal mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p className="text-paper-muted text-xs leading-relaxed">
          Membros convidados receberão um e-mail para acessar o workspace. Administradores podem gerenciar membros, etapas e configurações.
        </p>
      </div>
    </div>
  )
}
