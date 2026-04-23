'use client'

import Link from '@/components/link'
import { usePathname } from '@/lib/router'
import { Menu, X, ArrowRight, Phone, ChevronDown } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { CONTACT_INFO } from '@/lib/contact-info'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Contractors', href: '/contractors' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/80 bg-background/95 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-background'
      }`}
    >
      {/* Utility bar */}
      <div className="hidden border-b border-border/50 bg-muted/40 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs text-muted-foreground">
          <p className="font-medium">
            Property maintenance coordination for {CONTACT_INFO.cityState}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={CONTACT_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
            >
              <Phone className="h-3 w-3" /> {CONTACT_INFO.phoneDisplay}
            </a>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span>Mon – Fri, 8 AM – 5 PM CT</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6">
        <Link 
          href="/" 
          aria-label="Nexus Operations — Home" 
          className="flex items-center"
        >
          <Logo />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3.5 -bottom-[1.125rem] h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm btn-primary-glow hover:opacity-95 transition-all"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors lg:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden animate-fade-in">
          <nav className="mx-auto max-w-7xl px-6 py-5" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
              <Link
                href="/auth/login"
                onClick={closeMobile}
                className="flex items-center justify-center rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                <Phone className="h-4 w-4" /> {CONTACT_INFO.phoneDisplay}
              </a>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
