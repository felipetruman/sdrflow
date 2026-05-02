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
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-4 font-semibold text-slate-800">Convidar novo membro</h3>
        <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail do novo membro"
            required
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="member">Membro</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            type="submit"
            disabled={isPending || !email.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            <UserPlus className="h-4 w-4" />
            Convidar
          </button>
        </form>
        {errorMsg && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
        {successMsg && <p className="mt-2 text-sm text-green-600">{successMsg}</p>}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-4 font-semibold text-slate-800">
          Membros do workspace
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500">
            {members.length}
          </span>
        </h3>
        <div className="space-y-2">
          {members.length === 0 && (
            <p className="text-sm text-slate-500">Nenhum membro encontrado.</p>
          )}
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <span className="flex-1 text-sm text-slate-700">{member.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(member.id, member.label)}
                disabled={isPending}
                className="text-slate-400 transition-colors hover:text-red-600 disabled:opacity-40"
                title="Remover membro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700">
            Membros convidados receberão um e-mail para acessar o workspace. Administradores podem gerenciar membros, etapas e configurações.
          </p>
        </div>
      </div>
    </div>
  )
}
