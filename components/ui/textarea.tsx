import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'

function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full border-2 bg-input px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-medium',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
