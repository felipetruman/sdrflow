'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Trash2, User, ShieldCheck } from 'lucide-react'
import { getWorkspaceMembers } from '@/features/workspaces/queries/getWorkspaceMembers'
import { inviteWorkspaceMember } from '@/features/workspaces/actions/inviteWorkspaceMember'
import { removeWorkspaceMember } from '@/features/workspaces/actions/removeWorkspaceMember'

type Member = { id: string; user_id: string; workspace_id: string; label: string }

export function WorkspaceMembersPanel() {
  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member'>('member')
  const [isPending, setIsPending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const load = async () => {
    const data = await getWorkspaceMembers()
    setMembers(data)
  }

  useEffect(() => { void load() }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const handleRemove = async (id: string, label: string) => {
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
    <div className="space-y-6">
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
        <h3 className="mb-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Convidar novo membro</h3>
        <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="invite-email" className="sr-only">E-mail do novo membro</label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail do novo membro"
              required
              className="sdr-input w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="invite-role" className="sr-only">Papel do novo membro</label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
              className="sdr-input px-3 py-2 text-sm"
            >
              <option value="member">Membro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending || !email.trim()}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40"
            style={{ backgroundColor: 'var(--amber)', color: 'var(--text-inverse)' }}
          >
            <UserPlus className="h-4 w-4" />
            Convidar
          </button>
        </form>
        {errorMsg && <p className="mt-2 text-sm" style={{ color: 'var(--error)' }}>{errorMsg}</p>}
        {successMsg && <p className="mt-2 text-sm" style={{ color: 'var(--success)' }}>{successMsg}</p>}
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
        <h3 className="mb-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
          Membros do workspace
          <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-normal" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>
            {members.length}
          </span>
        </h3>
        <div className="space-y-2">
          {members.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum membro encontrado.</p>
          )}
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-dim)' }}>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--bg-base)' }}>
                <User className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
              </div>
              <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{member.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(member.id, member.label)}
                disabled={isPending}
                className="transition-colors hover:opacity-80 disabled:opacity-40"
                style={{ color: 'var(--text-muted)' }}
                title="Remover membro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg px-4 py-3" style={{ border: '1px solid var(--amber)', backgroundColor: 'rgba(245,158,11,0.08)' }}>
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--amber)' }} />
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Membros convidados receberão um e-mail para acessar o workspace. Administradores podem gerenciar membros, etapas e configurações.
          </p>
        </div>
      </div>
    </div>
  )
}
