import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50', { variants: { variant: { default: 'bg-black text-white hover:bg-zinc-800', outline: 'border border-zinc-200 bg-white hover:bg-zinc-50' }, size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3', lg: 'h-11 px-8' } }, defaultVariants: { variant: 'default', size: 'default' } })
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) { return <button className={cn(buttonVariants({ variant, size, className }))} {...props} /> }
