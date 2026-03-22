"use client"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
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
    { label: "About",        href: "/about" },
    { label: "Services",     href: "/services" },
    { label: "How It Works", href: "/#process" },
    { label: "Pricing",      href: "/pricing" },
    { label: "Contact",      href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="Nexus Operations home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-1.5 text-[13px] font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center px-4 py-2 text-[12.5px] font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition shadow-sm"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-5 pt-1 border-t border-border animate-fade-in" aria-label="Mobile navigation">
            <div className="flex flex-col gap-0.5 pt-3">
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[13.5px] font-medium text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                <Link
                  href="/auth/login"
                  className="flex-1 flex items-center justify-center py-2.5 text-[13px] font-medium text-muted-foreground rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex-1 flex items-center justify-center py-2.5 text-[13px] font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
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
