"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X, LogIn } from "lucide-react"
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
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/#process" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <Link href="/" aria-label="Nexus Operations home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium text-foreground/50 hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Log in
            </Link>
            <Link
              href="/dashboard/requests/new"
              className="inline-flex items-center px-5 py-2 text-[13px] font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
            >
              Submit Request
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-foreground/50 hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-6 pt-2" aria-label="Mobile navigation">
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
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground/70 rounded-lg border border-border hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>
                <Link
                  href="/dashboard/requests/new"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => setMobileOpen(false)}
                >
                  Submit Request
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
