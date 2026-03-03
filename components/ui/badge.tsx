import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

const variantClasses: Record<string, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-border bg-secondary text-destructive',
  outline: 'text-foreground',
  success: 'border-border bg-secondary text-foreground',
  warning: 'border-border bg-secondary text-foreground',
  info: 'border-border bg-secondary text-foreground',
  muted: 'border-transparent bg-muted text-muted-foreground',
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: string
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
