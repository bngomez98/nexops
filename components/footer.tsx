import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5">
              <Logo />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
              One request. One verified contractor. No shared leads, no bidding wars. Free for homeowners.
            </p>
          </div>

          <div>
            <h3 className="section-overline mb-5">Platform</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/#how-it-works" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/services" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Service Categories</Link></li>
              <li><Link href="/pricing" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Membership Plans</Link></li>
              <li><Link href="/login?tab=signup" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Submit a Request</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="section-overline mb-5">Contractors</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/contractors" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Join the Network</Link></li>
              <li><Link href="/pricing" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Membership Plans</Link></li>
              <li><Link href="/contractors#verification" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Verification Process</Link></li>
              <li><Link href="/contractors#faq" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Contractor FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="section-overline mb-5">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/contact" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Contact</Link></li>
              <li><a href="mailto:admin@nexusoperations.org" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">admin@nexusoperations.org</a></li>
              <li><a href="tel:+19139511711" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">(913) 951-1711</a></li>
              <li><Link href="/privacy" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/25 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-muted-foreground/70">&copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.</p>
          <p className="text-[12px] text-muted-foreground/70">Topeka, KS and surrounding areas &middot; Verified contractors only</p>
        </div>
      </div>
    </footer>
  )
}
