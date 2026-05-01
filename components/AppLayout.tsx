'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader onMenuClick={() => setOpen((value) => !value)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
