"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const nav = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Services", href: "/services" },
    { label: "For Contractors", href: "/contractors" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] lg:h-[76px]">
          <Link href="/" aria-label="Nexus Operations home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Main">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-[13px] font-medium text-foreground/45 hover:text-foreground transition-colors duration-200 group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <Link
              href="/login"
              className="text-[13px] font-medium text-foreground/45 hover:text-foreground transition-colors duration-200"
            >
              Log In
            </Link>
            <Link
              href="/login?tab=signup"
              className="btn-shimmer inline-flex items-center px-4 py-2 text-[13px] font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity tracking-tight"
            >
              Start a Project
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-foreground/45 hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-8 pt-1 border-t border-border/30" aria-label="Mobile">
            <div className="flex flex-col">
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-foreground/55 hover:text-foreground py-3.5 transition-colors border-b border-border/20 last:border-0"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-foreground/60 rounded-md border border-border/40 hover:bg-secondary/50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="flex items-center justify-center px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                  onClick={() => setMobileOpen(false)}
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
