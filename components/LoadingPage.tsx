import { Loader2 } from 'lucide-react'

export function LoadingPage() {
  return (
    <div className="text-paper-quiet flex min-h-[50vh] items-center justify-center">
      <Loader2 className="text-signal h-6 w-6 animate-spin" />
    </div>
  )
}
