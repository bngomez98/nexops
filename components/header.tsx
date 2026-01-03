import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "./logo"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10 text-primary transition-colors group-hover:text-primary/80" />
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-semibold tracking-tight group-hover:text-foreground/80 transition-colors">
                Nexus Operations
              </span>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-medium">
                Professional Services
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </Link>
          </nav>

          <Button className="hidden md:inline-flex font-medium shadow-md hover:shadow-lg transition-shadow">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
