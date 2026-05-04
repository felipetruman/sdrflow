'use client'

import { useEffect } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  type: ToastType
}

const config: Record<ToastType, { icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  success: { icon: CheckCircle2, color: 'var(--success)',   bg: 'var(--success-dim)', border: 'rgba(16,185,129,0.25)' },
  error:   { icon: AlertCircle,  color: 'var(--error)',     bg: 'var(--error-dim)',   border: 'rgba(239,68,68,0.25)'  },
  info:    { icon: Info,         color: 'var(--cyan)',       bg: 'var(--cyan-glow)',   border: 'rgba(6,182,212,0.25)' },
}

export function Toast({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [onClose, toast.id])

  const { icon: Icon, color, border } = config[toast.type]

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 rounded-lg p-3 shadow-lg animate-fade-up"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: `1px solid ${border}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
      <p className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className="rounded p-0.5 opacity-50 transition hover:opacity-100"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Fechar notificação"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
