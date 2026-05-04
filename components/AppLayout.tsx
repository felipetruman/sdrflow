'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { CommandPalette } from './CommandPalette'

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  return (
    <div className="bg-ink-950 surface-mesh flex min-h-screen">
      <a
        href="#main-content"
        className="bg-signal text-ink-950 sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:outline-none"
      >
        Pular para o conteúdo
      </a>
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <AppHeader
          onMenuClick={() => setSidebarOpen((value) => !value)}
          onCommandClick={() => setPaletteOpen(true)}
        />
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
