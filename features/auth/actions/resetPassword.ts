'use server'

import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/data'

export async function resetPasswordForEmail(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return { error: 'Informe um e-mail válido.' }

  if (isDemoMode()) return { success: 'Em modo demonstração. Nenhum e-mail foi enviado.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) return { error: 'Erro ao enviar e-mail de recuperação. Tente novamente.' }
  return { success: 'Se o e-mail existir, você receberá um link de recuperação em instantes.' }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 6) return { error: 'A senha deve ter pelo menos 6 caracteres.' }
  if (password !== confirmPassword) return { error: 'As senhas não conferem.' }

  if (isDemoMode()) return { success: 'Senha alterada com sucesso.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: 'Erro ao redefinir senha. O link pode ter expirado. Solicite novamente.' }
  return { success: 'Senha redefinida com sucesso.' }
}
