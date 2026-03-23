"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X, ArrowRight, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { CONTACT_INFO } from "@/lib/contact-info"

const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-background/72 backdrop-blur-md"
      }`}
    >
      <div className="border-b border-border/60 bg-foreground/[0.02]">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-6 text-[11px] text-muted-foreground lg:px-8">
          <p className="hidden sm:block">
            Fast, verified property maintenance coordination for homeowners and contractors.
          </p>
          <div className="flex items-center gap-3 sm:ml-auto">
            <a href={CONTACT_INFO.phoneHref} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Phone className="h-3 w-3" />
              {CONTACT_INFO.phoneDisplay}
            </a>
            <Link href="/contractors" className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
              Contractor network
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

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
              className="inline-flex items-center gap-2 px-4 py-2 text-[12.5px] font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition shadow-sm"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
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
              <div className="mt-4 rounded-xl border border-border bg-card/70 p-3 text-[12px] text-muted-foreground">
                <p className="font-medium text-foreground">Need help now?</p>
                <a href={CONTACT_INFO.phoneHref} className="mt-1 inline-flex items-center gap-1 text-primary hover:underline">
                  <Phone className="h-3.5 w-3.5" /> {CONTACT_INFO.phoneDisplay}
                </a>
              </div>
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
