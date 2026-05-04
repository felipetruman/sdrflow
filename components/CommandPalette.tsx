'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  LayoutDashboard,
  KanbanSquare,
  UserPlus,
  Megaphone,
  GitBranch,
  Sliders,
  Users,
  Plus,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/features/auth/actions/signOut'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()

  // Global shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  function navigate(path: string) {
    onOpenChange(false)
    router.push(path)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar leads, ações, configurações..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>

        <CommandGroup heading="Ir para">
          <CommandItem onSelect={() => navigate('/dashboard')}>
            <LayoutDashboard />
            <span>Dashboard</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/kanban')}>
            <KanbanSquare />
            <span>Kanban</span>
            <CommandShortcut>G K</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/campaigns')}>
            <Megaphone />
            <span>Campanhas</span>
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações rápidas">
          <CommandItem onSelect={() => navigate('/leads/new')}>
            <UserPlus />
            <span>Novo lead</span>
            <CommandShortcut>N L</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/campaigns/new')}>
            <Plus />
            <span>Nova campanha</span>
            <CommandShortcut>N C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/kanban?action=quick-add')}>
            <Sparkles />
            <span>Adicionar lead ao Kanban</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Configurações">
          <CommandItem onSelect={() => navigate('/settings/funnel')}>
            <GitBranch />
            <span>Funil</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/settings/fields')}>
            <Sliders />
            <span>Campos personalizados</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/settings/members')}>
            <Users />
            <span>Membros do workspace</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Conta">
          <CommandItem
            onSelect={() => {
              onOpenChange(false)
              void signOut()
            }}
            className="data-[selected=true]:!text-negative"
          >
            <LogOut />
            <span>Sair</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
