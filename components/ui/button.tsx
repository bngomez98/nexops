import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 construct-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-none',
  destructive:
    'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
  outline:
    'border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors',
  secondary: 'bg-secondary text-secondary-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-colors',
  ghost: 'hover:bg-secondary hover:text-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-5 py-2 has-[>svg]:px-3',
  sm: 'h-8 gap-1.5 px-4 has-[>svg]:px-2.5',
  lg: 'h-12 px-7 has-[>svg]:px-5',
  icon: 'size-10',
  'icon-sm': 'size-8',
  'icon-lg': 'size-12',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  size?: string
  asChild?: boolean
}

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold tracking-wide uppercase transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}

export { Button }
