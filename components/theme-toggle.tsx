"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const modes = ["system", "light", "dark"] as const

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const idx = modes.indexOf(theme)
    const next = modes[(idx + 1) % modes.length]
    setTheme(next)
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor
  const label = theme === "light" ? "Light mode" : theme === "dark" ? "Dark mode" : "System theme"

  if (compact) {
    return (
      <button
        type="button"
        onClick={cycle}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
        aria-label={label}
        title={label}
      >
        <Icon className="h-4 w-4" />
        <span className="capitalize">{theme} theme</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border/40 text-foreground/60 hover:text-foreground hover:bg-secondary/50 hover:border-border/70 transition-all duration-200"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
