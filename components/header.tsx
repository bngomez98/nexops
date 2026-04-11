'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, Phone } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { CONTACT_INFO } from '@/lib/contact-info'
import { Logo } from '@/components/logo'

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
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background,border] duration-300 ${
        scrolled
          ? 'border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75'
          : 'border-transparent bg-background'
      }`}
    >
      {/* Utility bar */}
      <div className="hidden border-b border-border/60 bg-muted/30 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-[12px] text-muted-foreground">
          <p>Property maintenance coordination · {CONTACT_INFO.cityState}</p>
          <div className="flex items-center gap-5">
            <a
              href={CONTACT_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Phone className="h-3 w-3" /> {CONTACT_INFO.phoneDisplay}
            </a>
            <span className="h-3 w-px bg-border" />
            <span>Mon–Fri · 8 AM – 5 PM CT</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Nexus Operations — Home" className="flex items-center">
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
              className={`rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/auth/login"
            className="text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-4" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-3 border-t border-border pt-4">
              <Link
                href="/auth/login"
                onClick={closeMobile}
                className="flex flex-1 items-center justify-center rounded-full border border-border px-4 py-2.5 text-[13px] font-semibold text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={closeMobile}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <a
              href={CONTACT_INFO.phoneHref}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-primary"
            >
              <Phone className="h-3.5 w-3.5" /> {CONTACT_INFO.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
