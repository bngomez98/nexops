import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

const variantClasses: Record<string, string> = {
  default: 'border-2 border-primary bg-primary text-primary-foreground',
  secondary: 'border-2 border-foreground bg-secondary text-secondary-foreground',
  destructive: 'border-2 border-destructive bg-destructive text-destructive-foreground',
  outline: 'border-2 border-foreground text-foreground bg-background',
  success: 'border-2 border-foreground bg-secondary text-foreground',
  warning: 'border-2 border-foreground bg-secondary text-foreground',
  info: 'border-2 border-primary bg-background text-primary',
  muted: 'border-2 border-muted-foreground bg-muted text-muted-foreground',
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: string
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
