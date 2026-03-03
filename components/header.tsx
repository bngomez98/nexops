"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(true)

  useEffect(() => {
    const dismissed = localStorage.getItem("nexops-banner-dismissed")
    if (!dismissed) setBannerDismissed(false)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const dismissBanner = () => {
    setBannerDismissed(true)
    localStorage.setItem("nexops-banner-dismissed", "true")
  }

  const nav = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Contractors", href: "/contractors" },
    { label: "For Property Managers", href: "/property-managers" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement banner — bold red */}
      {!bannerDismissed && (
        <div className="bg-primary text-primary-foreground text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-3 relative tracking-wide uppercase">
          <span className="hidden sm:inline">
            Free for property owners &mdash; no account required to submit a project.
          </span>
          <span className="sm:hidden">Free for property owners.</span>
          <Link
            href="/dashboard/homeowner/new"
            className="inline-flex items-center gap-1 font-black underline underline-offset-2 hover:no-underline opacity-90 hover:opacity-100"
          >
            Get started <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main nav */}
      <header
        className={`transition-all duration-150 border-b-2 ${
          scrolled
            ? "bg-background border-foreground"
            : "bg-background/96 border-foreground/20"
        }`}
      >
        {/* Red top rule — constructivist accent */}
        <div className="h-1 bg-primary w-full" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <Link href="/" aria-label="Nexus Operations home">
              <Logo />
            </Link>

            <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[11px] font-bold tracking-widest uppercase text-foreground/50 hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-[11px] font-bold tracking-widest uppercase text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/dashboard/homeowner/new"
                className="inline-flex items-center px-4 py-2 text-[11px] font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors construct-shadow"
              >
                Get Started
              </Link>
            </div>

            <button
              type="button"
              className="lg:hidden p-2 text-foreground/70 hover:text-foreground border-2 border-transparent hover:border-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen && (
            <nav className="lg:hidden pb-5 pt-2 border-t-2 border-foreground" aria-label="Mobile">
              <div className="flex flex-col gap-0.5 pt-2">
                {nav.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-xs font-bold tracking-widest uppercase text-foreground/60 hover:text-primary hover:bg-secondary py-2.5 px-3 transition-colors border-l-2 border-transparent hover:border-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t-2 border-foreground">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-3 text-xs font-bold tracking-widest uppercase text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/dashboard/homeowner/new"
                    className="flex items-center justify-center px-4 py-3 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
    </div>
  )
}
