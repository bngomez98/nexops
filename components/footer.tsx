import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-[20%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>
      {/* </CHANGE> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="md:col-span-2">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed text-lg">
              Professional sourcing and coordination services for people who value their time.
            </p>
            {/* </CHANGE> */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  admin@nexusoperations.org
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <a href="tel:+19139511711" className="text-muted-foreground hover:text-primary transition-colors">
                  (913) 951-1711
                </a>
              </div>
            </div>
            {/* </CHANGE> */}
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-xs uppercase tracking-widest text-foreground/60">Services</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors text-sm">
                  Product Sourcing
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors text-sm">
                  Resale & Fulfillment
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors text-sm">
                  Service Coordination
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors text-sm">
                  Project Management
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary transition-colors text-sm">
                  View Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-xs uppercase tracking-widest text-foreground/60">Company</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="/#how-it-works" className="hover:text-primary transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#results" className="hover:text-primary transition-colors text-sm">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Nexus Operations, LLC. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with expertise. Delivered with transparency.</p>
        </div>
        {/* </CHANGE> */}
      </div>
    </footer>
  )
}
