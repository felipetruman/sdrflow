'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:outline-none"
        style={{ backgroundColor: 'var(--amber)', color: 'var(--text-inverse)' }}
      >
        Pular para o conteúdo
      </a>
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={() => setOpen((v) => !v)} />
        <main id="main-content" className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
