'use client'

import { toast as sonner } from 'sonner'

const api = {
  toast: {
    success: (message: string) => sonner.success(message),
    error:   (message: string) => sonner.error(message),
    info:    (message: string) => sonner.message(message),
  },
}

export function useToast() {
  return api
}
