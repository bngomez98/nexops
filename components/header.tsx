"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Contractors", href: "/contractors" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border/40" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="hover:opacity-80 transition-opacity" aria-label="Nexus Operations home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-foreground/60 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden lg:inline-flex text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/#submit"
              className="hidden lg:inline-flex items-center px-5 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit a Request
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden pb-6 pt-2" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/#submit"
                className="mt-3 flex items-center justify-center px-5 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit a Request
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
