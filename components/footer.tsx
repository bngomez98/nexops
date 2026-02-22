import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A SaaS platform and consulting agency for property management companies. Relationship-based operations management, vendor coordination, and workflow consulting.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Services</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/services" className="text-foreground/60 hover:text-primary transition-colors">What We Offer</Link></li>
              <li><Link href="/property-managers" className="text-foreground/60 hover:text-primary transition-colors">For Property Managers</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">Request Early Access</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Property Managers</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/property-managers" className="text-foreground/60 hover:text-primary transition-colors">Overview</Link></li>
              <li><Link href="/#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">Engagement Process</Link></li>
              <li><Link href="/services" className="text-foreground/60 hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="mailto:admin@nexusoperations.org" className="text-foreground/60 hover:text-primary transition-colors">admin@nexusoperations.org</a></li>
              <li><a href="tel:+19139511711" className="text-foreground/60 hover:text-primary transition-colors">(913) 951-1711</a></li>
              <li><Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Pre-launch &middot; Consulting engagements available now &middot; Platform launching 2026</p>
        </div>
      </div>
    </footer>
  )
}
