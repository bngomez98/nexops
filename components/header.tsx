'use client'

import Link from '@/components/link'
import { usePathname } from '@/lib/router'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Logo } from '@/components/logo'

const nav = [
  { label: 'Homeowners', href: '/' },
  { label: 'Contractors', href: '/contractors' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111111] border-b border-white/10">
      {/* Main nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6">
        <Link
          href="/"
          aria-label="Nexus Operations — Home"
          className="flex items-center"
        >
          <Logo onDark />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                isActive(item.href)
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Request a demo
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors lg:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#111111] lg:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-5" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 -rotate-90 text-white/40" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-white/10 pt-5">
              <Link
                href="/contact"
                onClick={closeMobile}
                className="flex items-center justify-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Request a demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
