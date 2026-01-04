import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
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
              href="#how-it-works"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#packages"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Packages & Pricing
            </Link>
            <Link
              href="#results"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Success Stories
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Get Started
            </Link>
          </nav>

          <Button className="hidden md:inline-flex font-medium shadow-md hover:shadow-lg transition-shadow">
            Request Quote
          </Button>
        </div>
      </div>
    </header>
  )
}
