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
              A two-sided marketplace built around one principle: one project, one verified contractor. No shared leads. No bidding wars. Free for homeowners.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/services" className="text-foreground/60 hover:text-primary transition-colors">Service Categories</Link></li>
              <li><Link href="/pricing" className="text-foreground/60 hover:text-primary transition-colors">Membership Plans</Link></li>
              <li><Link href="/login?tab=signup" className="text-foreground/60 hover:text-primary transition-colors">Submit a Request</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contractors</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/contractors" className="text-foreground/60 hover:text-primary transition-colors">Join the Network</Link></li>
              <li><Link href="/pricing" className="text-foreground/60 hover:text-primary transition-colors">Membership Plans</Link></li>
              <li><Link href="/contractors#verification" className="text-foreground/60 hover:text-primary transition-colors">Verification Process</Link></li>
              <li><Link href="/contractors#faq" className="text-foreground/60 hover:text-primary transition-colors">Contractor FAQ</Link></li>
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
          <p className="text-xs text-muted-foreground">Serving Topeka, KS and surrounding areas &middot; Verified contractors only</p>
        </div>
      </div>
    </footer>
  )
}
