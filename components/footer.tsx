import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Maintenance coordination for commercial and residential properties.
              Topeka, Kansas.
            </p>
            <div className="mt-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
              <a
                href="tel:+19139511711"
                className="hover:text-foreground transition-colors"
              >
                (913) 951-1711
              </a>
              <a
                href="mailto:admin@nexusoperations.org"
                className="hover:text-foreground transition-colors"
              >
                admin@nexusoperations.org
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#process"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              For Clients
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/services#commercial"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/services#residential"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Residential Services
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Client Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/contractors"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Contractor Network
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Legal
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {"\u00A9"} {new Date().getFullYear()} Nexus Operations, LLC. All
            rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            405 SW Fillmore St, Topeka, KS 66606
          </p>
        </div>
      </div>
    </footer>
  )
}
