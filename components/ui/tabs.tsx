'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithRef } from 'react'

const Tabs = TabsPrimitive.Root

function TabsList({ className, ref, ...props }: ComponentPropsWithRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center border-2 border-foreground bg-background text-muted-foreground p-0',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ref, ...props }: ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-xs font-black tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-secondary data-[state=inactive]:hover:text-foreground border-r-2 border-foreground last:border-r-0',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ref, ...props }: ComponentPropsWithRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
