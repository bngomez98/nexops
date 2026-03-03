import Link from "next/link"
import { Shield, CheckCircle2, Clock3, FileText } from "lucide-react"

const trustItems = [
  { icon: Shield, label: "License Verified", sub: "Every contractor" },
  { icon: CheckCircle2, label: "Insured & Background Checked", sub: "Before platform access" },
  { icon: Clock3, label: "24-Hour Consultation", sub: "Guaranteed on every project" },
  { icon: FileText, label: "Post Implementation Review", sub: "Included on every project" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Trust bar */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-background leading-tight">{label}</p>
                  <p className="text-xs text-background/50 mt-0.5">{sub}</p>
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
              <div className="flex items-center gap-2.5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <rect width="180" height="180" rx="36" fill="currentColor" className="text-primary" />
                  <path d="M40 140V40L90 90L140 40V140L90 90L40 140Z" fill="white" fillOpacity="0.95" />
                  <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="140" cy="40" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="40" cy="140" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="140" cy="140" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="90" cy="90" r="10" fill="white" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[17px] font-bold tracking-tight text-background">Nexus</span>
                  <span className="text-[10px] font-medium tracking-wider text-background/50">Operations</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-background/50 leading-relaxed max-w-xs">
              Connecting homeowners and property managers with licensed, insured contractors.
              End-to-end coordination including Post Implementation Review.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-background/70 mb-4">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/#how-it-works" className="text-background/40 hover:text-background transition-colors">How It Works</Link></li>
              <li><Link href="/services" className="text-background/40 hover:text-background transition-colors">Service Categories</Link></li>
              <li><Link href="/pricing" className="text-background/40 hover:text-background transition-colors">Membership Plans</Link></li>
              <li><Link href="/dashboard/homeowner/new" className="text-background/40 hover:text-background transition-colors">Submit a Request</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-background/70 mb-4">Contractors</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/contractors" className="text-background/40 hover:text-background transition-colors">Join the Network</Link></li>
              <li><Link href="/pricing" className="text-background/40 hover:text-background transition-colors">Membership Plans</Link></li>
              <li><Link href="/contractors#verification" className="text-background/40 hover:text-background transition-colors">Verification Process</Link></li>
              <li><Link href="/contractors#faq" className="text-background/40 hover:text-background transition-colors">Contractor FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-background/70 mb-4">Property Managers</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/property-managers" className="text-background/40 hover:text-background transition-colors">Overview</Link></li>
              <li><Link href="/property-managers#corporate" className="text-background/40 hover:text-background transition-colors">Corporate Accounts</Link></li>
              <li><Link href="/services" className="text-background/40 hover:text-background transition-colors">Service Categories</Link></li>
              <li><Link href="/contact" className="text-background/40 hover:text-background transition-colors">Get Onboarded</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10 pt-8 border-t border-background/10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-background/70 mb-4">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/contact" className="text-background/40 hover:text-background transition-colors">Contact</Link></li>
              <li><a href="mailto:contact@nexusoperations.org" className="text-background/40 hover:text-background transition-colors">contact@nexusoperations.org</a></li>
              <li><a href="tel:+17854280244" className="text-background/40 hover:text-background transition-colors">785-428-0244</a></li>
              <li><Link href="/privacy" className="text-background/40 hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-background/40 hover:text-background transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-background/30">&copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.</p>
          <p className="text-xs text-background/30">Serving Topeka, KS and surrounding areas</p>
        </div>
      </div>
    </footer>
  )
}
