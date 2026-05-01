import * as React from 'react'
import { cn } from '@/lib/utils/cn'
export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select className={cn('flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black', className)} {...props} /> }
