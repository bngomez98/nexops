import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

/* ── Button variant / size maps ──────────────────────────────────────────── */

const variantClasses: Record<string, string> = {
  default:     'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
  accent:      'bg-accent text-accent-foreground hover:bg-accent/90',
  outline:     'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost:       'hover:bg-accent hover:text-accent-foreground',
  link:        'text-primary underline-offset-4 hover:underline',
}

const sizeClasses: Record<string, string> = {
  default:  'h-9 px-4 py-2',
  sm:       'h-8 rounded-md gap-1.5 px-3',
  lg:       'h-10 rounded-md px-6',
  icon:     'h-9 w-9',
  'icon-sm':'h-8 w-8',
  'icon-lg':'h-10 w-10',
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shrink-0'

/* ── Types ────────────────────────────────────────────────────────────────── */

export type ButtonVariant = keyof typeof variantClasses
export type ButtonSize    = keyof typeof sizeClasses

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: ButtonVariant
  size?:    ButtonSize
  asChild?: boolean
}

/* ── Component ────────────────────────────────────────────────────────────── */

function Button({
  className,
  variant = 'default',
  size    = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(
        BASE_CLASSES,
        variantClasses[variant] ?? variantClasses.default,
        sizeClasses[size]       ?? sizeClasses.default,
        className,
      )}
      {...props}
    />
  )
}

export { Button }

/**
 * buttonVariants — compatibility shim for callers that consumed the previous
 * cva-based export.  Returns a plain string of class names.
 */
export function buttonVariants({
  variant  = 'default',
  size     = 'default',
  className = '',
}: {
  variant?:  ButtonVariant
  size?:     ButtonSize
  className?: string
} = {}): string {
  return cn(
    BASE_CLASSES,
    variantClasses[variant] ?? variantClasses.default,
    sizeClasses[size]       ?? sizeClasses.default,
    className,
  )
}
