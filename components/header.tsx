"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#services"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#results"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Results
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild className="hidden md:inline-flex font-medium">
              <Link href="/#contact">Get Started</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link
                href="/#services"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#pricing"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#results"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Results
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="mt-4 font-medium">
                <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
