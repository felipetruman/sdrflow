'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  type: ToastType
}

const styles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  info: 'border-blue-200 bg-blue-50 text-blue-900',
}

export function Toast({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [onClose, toast.id])

  return (
    <div className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border p-4 shadow-lg ${styles[toast.type]}`}>
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="rounded p-1 opacity-70 transition hover:opacity-100" aria-label="Fechar notificação">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
