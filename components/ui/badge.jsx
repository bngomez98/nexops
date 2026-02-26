import { cn } from '@/lib/utils'

const variantClasses = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-transparent bg-destructive text-destructive-foreground',
  outline: 'text-foreground',
  success: 'border-transparent bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'border-transparent bg-amber-500/20 text-amber-400 border-amber-500/30',
  info: 'border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30',
  muted: 'border-transparent bg-muted text-muted-foreground',
}

function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
