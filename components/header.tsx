"use client"

import Link from "next/link"
import Image from "next/image"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/96 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 h-14">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={150}
            height={50}
            style={{ height: "30px", width: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Main">
          {[
            { href: "#about", label: "About" },
            { href: "#who-we-serve", label: "Who We Serve" },
            { href: "#services", label: "Services" },
            { href: "#process", label: "Process" },
            { href: "#reporting", label: "Reporting" },
            { href: "#contractors", label: "For Contractors" },
            { href: "#contact", label: "Contact" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-4 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/auth/login" className="hidden text-[13px] text-muted-foreground transition-colors hover:text-foreground md:block">
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
