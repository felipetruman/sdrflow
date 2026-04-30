'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useMemo, useState } from 'react'
import { Toast, type ToastItem, type ToastType } from './Toast'

type ToastInput = { message: string; type?: ToastType }
type ToastApi = { toast: { success: (message: string) => void; error: (message: string) => void; info: (message: string) => void } }

export const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])
  const pushToast = useCallback(({ message, type = 'info' }: ToastInput) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message, type }])
  }, [])

  const value = useMemo(() => ({ toast: { success: (message: string) => pushToast({ message, type: 'success' }), error: (message: string) => pushToast({ message, type: 'error' }), info: (message: string) => pushToast({ message, type: 'info' }) } }), [pushToast])

  return <ToastContext.Provider value={value}><div>{children}</div><div className="fixed right-4 top-4 z-50 space-y-3">{toasts.map((toast) => <Toast key={toast.id} toast={toast} onClose={removeToast} />)}</div></ToastContext.Provider>
}
