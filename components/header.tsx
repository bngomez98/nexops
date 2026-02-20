"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const nav = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Services", href: "/services" },
    { label: "For Contractors", href: "/contractors" },
    { label: "For Property Managers", href: "/property-managers" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <Link href="/" aria-label="Nexus Operations home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium text-foreground/55 hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-foreground/55 hover:text-foreground rounded-lg transition-colors"
            >
              <User className="h-4 w-4" />
              Log In
            </Link>
            <Link
              href="/login?tab=signup"
              className="inline-flex items-center px-4 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-foreground/55 hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-6 pt-2" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-foreground/60 hover:text-foreground py-3 px-3 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground/70 rounded-lg border border-border/40 hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Log In
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
