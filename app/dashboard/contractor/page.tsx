import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  MapPin,
  DollarSign,
  Calendar,
  ChevronRight,
  BadgeCheck,
  Info,
} from "lucide-react"

// Demo open requests — replaced with DB queries once schema exists
const openRequests = [
  {
    id: "req-001",
    category: "HVAC",
    title: "Central air system replacement",
    address: "1421 SW Gage Blvd, Topeka, KS 66604",
    budgetMax: 9500,
    photoCount: 6,
    submittedAt: "2026-03-05",
    availability: "Weekday evenings, Saturdays",
  },
  {
    id: "req-002",
    category: "Roofing",
    title: "Full roof replacement — storm damage",
    address: "3310 SE 29th St, Topeka, KS 66605",
    budgetMax: 18000,
    photoCount: 8,
    submittedAt: "2026-03-06",
    availability: "Any weekday 8am–4pm",
  },
  {
    id: "req-003",
    category: "Electrical",
    title: "200A panel upgrade + EV charger rough-in",
    address: "823 NW Fairlawn Rd, Topeka, KS 66606",
    budgetMax: 5800,
    photoCount: 4,
    submittedAt: "2026-03-06",
    availability: "Monday or Tuesday",
  },
  {
    id: "req-004",
    category: "Concrete",
    title: "Driveway replacement — 2-car width, 60ft",
    address: "117 SE Adams St, Topeka, KS 66607",
    budgetMax: 7200,
    photoCount: 5,
    submittedAt: "2026-03-07",
    availability: "Flexible — any weekday",
  },
]

export default async function ContractorDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"
  if (role !== "contractor") redirect("/dashboard")

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Contractor"

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Page header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Contractor Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">{fullName} — Shawnee County service area</p>
          </div>
          <Link
            href="/dashboard/contractor/settings"
            className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Account Settings
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Open Requests",       value: String(openRequests.length), sub: "Available to claim now",   color: "text-primary" },
            { label: "Claimed This Month",   value: "0",                        sub: "Exclusively assigned",     color: "text-foreground" },
            { label: "Avg. Budget Ceiling",  value: "$0",                       sub: "Across claimed requests",  color: "text-foreground" },
            { label: "Consultation Rate",    value: "—",                        sub: "Claimed → consulted",      color: "text-foreground" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-3">{label}</p>
              <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* Verification notice */}
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your account is active and verified. License and insurance documentation on file. To update your credentials, contact{" "}
            <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">admin@nexusoperations.org</a>.
          </p>
        </div>

        {/* Open requests */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Open Requests — Shawnee County</h2>
          <span className="text-[11px] text-muted-foreground">{openRequests.length} available</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-5">
          Claiming a request removes it from all other contractor feeds immediately. Review the full scope and photos before claiming.
        </p>

        <div className="space-y-3">
          {openRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30"
            >
              <div className="flex items-start justify-between px-5 py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {req.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{req.photoCount} photos attached</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{req.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />{req.address}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <DollarSign className="h-3 w-3" />Budget ceiling: <strong className="text-foreground">${req.budgetMax.toLocaleString()}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />{req.availability}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-6 flex-shrink-0">
                  <p className="text-[11px] text-muted-foreground">Submitted {req.submittedAt}</p>
                  <Link
                    href={`/dashboard/contractor/requests/${req.id}`}
                    className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    View & Claim
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Claimed requests section */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-4">Claimed Requests</h2>
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <FileText className="mx-auto h-5 w-5 text-muted-foreground mb-3" />
            <h3 className="text-sm font-semibold">No claimed requests</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              Requests you claim will appear here with full scope documentation and the scheduled consultation details.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-4">Resources</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { href: "/dashboard/contractor/profile",   label: "Contractor Profile",     sub: "Services, service area, bio" },
              { href: "/dashboard/messages",             label: "Messages",                sub: "Active threads with property owners" },
              { href: "https://nexusoperations.zendesk.com/hc/en-us", label: "Help Center", sub: "Platform policies and claim process", external: true },
            ].map(({ href, label, sub, external }) => (
              <Link
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 transition hover:border-primary/40 group"
              >
                <div>
                  <p className="text-[13px] font-medium">{label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
