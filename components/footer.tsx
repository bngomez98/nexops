import Link from "next/link"
import { Logo } from "@/components/logo"
import { Shield, CheckCircle2, Clock3, FileText } from "lucide-react"

const trustItems = [
  { icon: Shield, label: "License Verified", sub: "Every contractor" },
  { icon: CheckCircle2, label: "Insured & Background Checked", sub: "Before platform access" },
  { icon: Clock3, label: "24-Hour Consultation", sub: "Guaranteed on every project" },
  { icon: FileText, label: "Post Implementation Review", sub: "Included on every project" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">

      {/* Trust bar */}
      <div className="border-b border-border/30 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground leading-tight">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Nexus Operations connects homeowners and property managers with licensed, insured
              contractors. End-to-end coordination from service request through completion, including
              Post Implementation Review.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/services" className="text-foreground/60 hover:text-primary transition-colors">Service Categories</Link></li>
              <li><Link href="/pricing" className="text-foreground/60 hover:text-primary transition-colors">Membership Plans</Link></li>
              <li><Link href="/dashboard/homeowner/new" className="text-foreground/60 hover:text-primary transition-colors">Submit a Request</Link></li>
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
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Property Managers</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/property-managers" className="text-foreground/60 hover:text-primary transition-colors">Overview</Link></li>
              <li><Link href="/property-managers#corporate" className="text-foreground/60 hover:text-primary transition-colors">Corporate Accounts</Link></li>
              <li><Link href="/services" className="text-foreground/60 hover:text-primary transition-colors">Service Categories</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">Get Onboarded</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10 pt-8 border-t border-border/30">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="mailto:contact@nexusoperations.org" className="text-foreground/60 hover:text-primary transition-colors">contact@nexusoperations.org</a></li>
              <li><a href="tel:+17854280244" className="text-foreground/60 hover:text-primary transition-colors">785-428-0244</a></li>
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
