'use client'

import { useEffect, useMemo, useState } from 'react'
import { Moon, Sun, Laptop } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const icons = {
  light: Sun,
  dark: Moon,
  system: Laptop,
} as const

type ThemeOption = keyof typeof icons

const labels: Record<ThemeOption, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, systemTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const activeTheme: ThemeOption = useMemo(() => {
    if (!mounted) return 'system'
    if (theme === 'system') return (systemTheme as ThemeOption) || 'system'
    return (theme as ThemeOption) || 'system'
  }, [mounted, systemTheme, theme])

  const nextTheme: ThemeOption = activeTheme === 'dark' ? 'light' : 'dark'
  const Icon = icons[activeTheme] ?? Sun

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`Switch to ${labels[nextTheme]} mode`}
      className={cn('h-9 w-9 rounded-full border-border/70', className)}
      onClick={() => setTheme(nextTheme)}
    >
      {mounted ? <Icon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
