"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">N</span>
          </div>
          <span className="text-lg font-semibold">Nexus</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#for-contractors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            For contractors
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-4 p-4">
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How it works
            </Link>
            <Link href="#for-contractors" className="text-sm text-muted-foreground hover:text-foreground">
              For contractors
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <hr className="border-border" />
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
