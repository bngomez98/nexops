import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, DollarSign, Calendar, ArrowRight, Camera } from "lucide-react"

const allRequests = [
  { id: "req-001", category: "HVAC",       title: "Central air system replacement",           address: "1421 SW Gage Blvd, Topeka, KS 66604", budgetMax: 9500,  photos: 6, submitted: "Mar 5, 2026",  availability: "Weekday evenings, Saturdays" },
  { id: "req-002", category: "Roofing",    title: "Full roof replacement — storm damage",      address: "3310 SE 29th St, Topeka, KS 66605",   budgetMax: 18000, photos: 8, submitted: "Mar 6, 2026",  availability: "Any weekday 8am–4pm" },
  { id: "req-003", category: "Electrical", title: "200A panel upgrade + EV charger rough-in", address: "823 NW Fairlawn Rd, Topeka, KS 66606", budgetMax: 5800,  photos: 4, submitted: "Mar 6, 2026",  availability: "Monday or Tuesday" },
  { id: "req-004", category: "Concrete",   title: "Driveway replacement — 2-car width, 60ft", address: "117 SE Adams St, Topeka, KS 66607",    budgetMax: 7200,  photos: 5, submitted: "Mar 7, 2026",  availability: "Flexible — any weekday" },
  { id: "req-005", category: "Tree",       title: "Oak tree removal + stump grinding",         address: "2204 SW Washburn Ave, Topeka, KS 66604", budgetMax: 3400, photos: 7, submitted: "Mar 7, 2026", availability: "Weekend preferred" },
]

export default async function ContractorRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "contractor") redirect("/dashboard")

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Open Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Requests available in your service area. Claiming a request removes it from all other contractor feeds instantly.
          </p>
        </div>

        {/* Filter row */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["All Categories", "HVAC", "Roofing", "Electrical", "Concrete", "Tree Removal", "Fencing", "Plumbing"].map((f) => (
            <button
              key={f}
              className={`rounded border px-3 py-1.5 text-[12px] font-medium transition ${f === "All Categories" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {allRequests.map((req) => (
            <div key={req.id} className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30">
              <div className="flex items-start justify-between px-5 py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{req.category}</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Camera className="h-3 w-3" />{req.photos} photos
                    </span>
                    <span className="text-[10px] text-muted-foreground">Submitted {req.submitted}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2">{req.title}</h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />{req.address}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <DollarSign className="h-3 w-3" />Budget ceiling: <strong className="text-foreground ml-0.5">${req.budgetMax.toLocaleString()}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />{req.availability}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/contractor/requests/${req.id}`}
                  className="ml-6 flex-shrink-0 inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  View & Claim <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
