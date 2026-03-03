import { cn } from '@/lib/utils'
import type { HTMLAttributes, Ref } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

function Card({ className, ref, ...props }: CardProps) {
  return (
    <div
      ref={ref}
      className={cn('border-2 border-border bg-card text-card-foreground', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ref, ...props }: CardProps) {
  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ref, ...props }: CardProps & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 ref={ref as Ref<HTMLHeadingElement>} className={cn('text-lg font-bold leading-none tracking-tight uppercase', className)} {...props} />
  )
}

function CardDescription({ className, ref, ...props }: CardProps & HTMLAttributes<HTMLParagraphElement>) {
  return <p ref={ref as Ref<HTMLParagraphElement>} className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function CardContent({ className, ref, ...props }: CardProps) {
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({ className, ref, ...props }: CardProps) {
  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
