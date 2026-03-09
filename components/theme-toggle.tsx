"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggle() {
    const html = document.documentElement
    if (isDark) {
      html.classList.remove("dark")
      html.classList.add("light")
      localStorage.setItem("nexus-theme", "light")
    } else {
      html.classList.remove("light")
      html.classList.add("dark")
      localStorage.setItem("nexus-theme", "dark")
    }
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
