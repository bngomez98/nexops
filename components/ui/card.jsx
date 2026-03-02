import { cn } from '@/lib/utils'

function Card({ className = "", ref = null, ...props }) {
  return (
    <div
      ref={ref}
      className={cn('rounded-xl border border-border/40 bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
}

function CardHeader({ className = "", ref = null, ...props }) {
  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

function CardTitle({ className = "", ref = null, ...props }) {
  return (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
}

function CardDescription({ className = "", ref = null, ...props }) {
  return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function CardContent({ className = "", ref = null, ...props }) {
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({ className = "", ref = null, ...props }) {
  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
