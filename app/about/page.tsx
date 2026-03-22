import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nexus Operations LLC is a maintenance coordination company based in Topeka, Kansas. Founded by Brianna Gomez, we serve commercial property managers, residential property owners, and local businesses.",
}

const timeline = [
  {
    date: "January 2026",
    title: "Company Formation",
    description:
      "Nexus Operations LLC formed as a Kansas Limited Liability Company, headquartered at 2611 SW 17th St #5002, Topeka.",
  },
  {
    date: "Q1 2026",
    title: "Contractor Network Development",
    description:
      "Recruitment and verification of 15-20 contractors across essential maintenance trades in Shawnee County.",
  },
  {
    date: "Q2 2026",
    title: "First Commercial Clients",
    description:
      "Onboarding property management companies managing 100-800+ units with full coordination services.",
  },
  {
    date: "2026-2027",
    title: "B2B Service Expansion",
    description:
      "Extending our operational coordination model to include lead generation, vendor management, and strategic consulting for local businesses.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                About Nexus Operations
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                A coordination company,
                <br className="hidden sm:block" />
                <span className="font-serif italic font-normal text-primary">
                  not a contractor.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Nexus Operations does not swing hammers or run wire. We
                coordinate the people who do. Our role is to ensure that when a
                property manager submits a maintenance request, a verified
                contractor is assigned, arrives on time, completes documented
                work, and gets paid -- all through a single point of contact.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Our mission
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  Eliminate coordination failures in property maintenance.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Property management companies in Topeka face chronic
                  challenges: maintenance staff turnover rates of 35-50%
                  annually, emergency coordination consuming 8-15 hours of
                  manager time weekly, and tenant satisfaction declining from
                  delayed repair response.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Properties under 200 units often cannot justify the $3,500-$4,500
                  monthly cost of a full-time maintenance employee. Nexus Operations
                  provides that coordination capacity at a fraction of the cost,
                  with built-in redundancy that no single employee can match.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Our approach
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  Integrated operational partnership.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are not a marketplace that connects and walks away. We stay
                  in the loop from intake to invoice, ensuring quality, tracking
                  contractor performance across multiple dimensions, and
                  providing monthly reporting on every request handled.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Beyond maintenance, our B2B services model extends to lead
                  generation, vendor management, and consulting -- creating a
                  single strategic partner for diverse business operational
                  needs in the Topeka market.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Leadership
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-8">
                Founded and operated by Brianna Gomez.
              </h2>
              <div className="p-6 lg:p-8 rounded-xl bg-card border border-border">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-2xl font-semibold text-foreground/40">
                      BG
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Brianna Gomez
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Chief Executive Member
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Brianna founded Nexus Operations in January 2026 to
                      address a specific operational gap she identified in the
                      Topeka property management market: property managers were
                      spending disproportionate time coordinating vendor
                      relationships instead of managing their core
                      responsibilities. Nexus Operations was built to absorb
                      that coordination burden entirely, starting with
                      commercial property maintenance and expanding into
                      broader B2B operational support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Our trajectory
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                Building from the ground up.
              </h2>
            </div>

            <div className="flex flex-col gap-0">
              {timeline.map((item, i) => (
                <div
                  key={item.date}
                  className={`flex gap-6 lg:gap-10 py-6 ${
                    i < timeline.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div className="shrink-0 w-32 lg:w-40">
                    <span className="text-sm font-medium text-primary">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                Get in touch.
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <a
                  href="tel:+17857271106"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (785) 727-1106
                </a>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  admin@nexusoperations.org
                </a>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Topeka, KS 66604
                </span>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
