import Link from "next/link"
import { Logo } from "@/components/logo"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xs mb-4">
              Managed property maintenance for homeowners, landlords, and property managers in Topeka, Kansas.
            </p>
            <div className="flex flex-col gap-2">
              <a href="tel:+17857271106" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-3 w-3 flex-shrink-0" /> 785-727-1106
              </a>
              <a href="mailto:admin@nexusoperations.org" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-3 w-3 flex-shrink-0" /> admin@nexusoperations.org
              </a>
              <span className="inline-flex items-start gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" /> 2611 SW 17th St, Topeka, KS 66604
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Platform</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/about",      label: "About Us" },
                { href: "/services",   label: "Services" },
                { href: "/#process",   label: "How It Works" },
                { href: "/pricing",    label: "Pricing" },
                { href: "/contact",    label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Accounts</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/auth/sign-up",                       label: "Homeowner" },
                { href: "/auth/sign-up?role=property_manager", label: "Property Manager" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor Application" },
                { href: "/auth/login",                         label: "Sign In" },
                { href: "/contractors",                        label: "Contractor Network" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/privacy",  label: "Privacy Policy" },
                { href: "/terms",    label: "Terms of Service" },
                { href: "/site-map", label: "Sitemap" },
                { href: "/faq",      label: "FAQ" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-[11.5px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Nexus Operations, LLC. Topeka, Kansas. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms"   className="text-[11.5px] text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="text-[11.5px] text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
