'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-ink-800 group-[.toaster]:text-paper group-[.toaster]:border-ink-600 group-[.toaster]:shadow-2',
          description: 'group-[.toast]:text-paper-muted',
          actionButton: 'group-[.toast]:bg-signal group-[.toast]:text-ink-950',
          cancelButton: 'group-[.toast]:bg-ink-700 group-[.toast]:text-paper-muted',
        },
      }}
      {...props}
    />
  )
}
