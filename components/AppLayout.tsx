'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export function AppLayout({ children }: { children: ReactNode }) { const [open, setOpen] = useState(false); return <div className="min-h-screen bg-zinc-50 md:flex"><div className="hidden md:block"><AppSidebar /></div>{open && <div className="md:hidden"><AppSidebar /></div>}<div className="flex min-h-screen flex-1 flex-col"><AppHeader onMenuClick={() => setOpen((value) => !value)} /><main className="flex-1 p-4">{children}</main></div></div> }
