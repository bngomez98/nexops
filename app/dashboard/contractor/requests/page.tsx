import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, DollarSign, Calendar, ArrowRight, Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { isMissingServiceRequestsTableError } from "@/lib/supabase/errors"

const PAGE_SIZE = 20

type ServiceRequest = {
  id: string
  category: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  budget_max: number | null
  photo_urls: string[] | null
  preferred_dates: string | null
  created_at: string
}

const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal": "Tree Removal",
  "hvac": "HVAC",
  "electrical": "Electrical",
  "roofing": "Roofing",
  "concrete": "Concrete",
  "fencing": "Fencing",
  "plumbing": "Plumbing",
  "general-repair": "General Repair",
}

function formatCategory(cat: string) {
  return CATEGORY_LABELS[cat] ?? cat
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function ContractorRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "contractor") redirect("/dashboard")

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: requests, error, count } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, budget_max, photo_urls, preferred_dates, created_at", { count: "exact" })
    .in("status", ["pending_review", "in_queue"])
    .is("assigned_contractor_id", null)
    .order("created_at", { ascending: false })
    .range(from, to)

  const allRequests: ServiceRequest[] = requests ?? []
  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const missingRequestsTable = isMissingServiceRequestsTableError(error)

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Open Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Requests available in your service area. Claiming a request removes it from all other contractor feeds instantly.
          </p>
          {error && !missingRequestsTable && (
            <p className="mt-2 text-sm text-destructive">Failed to load requests: {error.message}</p>
          )}
        </div>

        {missingRequestsTable ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-8">
            <h2 className="text-sm font-semibold text-amber-700">Service requests are not available yet</h2>
            <p className="mt-2 text-sm text-amber-700/90">
              The `public.service_requests` table was not found in Supabase&apos;s schema cache, so the contractor feed cannot be loaded yet.
              Run the base SQL setup scripts and refresh the schema cache before returning to this page.
            </p>
          </div>
        ) : allRequests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm font-semibold mb-1">No open requests right now</p>
            <p className="text-xs text-muted-foreground">Check back soon — new requests appear here as soon as they are submitted.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {allRequests.map((req) => (
                <div key={req.id} className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30">
                  <div className="flex items-start justify-between px-5 py-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {formatCategory(req.category)}
                        </span>
                        {req.photo_urls && req.photo_urls.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Camera className="h-3 w-3" />{req.photo_urls.length} photo{req.photo_urls.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">Submitted {formatDate(req.created_at)}</span>
                      </div>
                      <h3 className="text-sm font-semibold mb-2 line-clamp-1">{req.description}</h3>
                      <div className="flex flex-wrap gap-x-5 gap-y-1">
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {req.address}, {req.city}, {req.state} {req.zip_code}
                        </span>
                        {req.budget_max != null && (
                          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <DollarSign className="h-3 w-3" />Budget ceiling: <strong className="text-foreground ml-0.5">${req.budget_max.toLocaleString()}</strong>
                          </span>
                        )}
                        {req.preferred_dates && (
                          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />{req.preferred_dates}
                          </span>
                        )}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing {from + 1}–{Math.min(to + 1, totalCount)} of {totalCount} request{totalCount !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 ? (
                    <Link
                      href={`/dashboard/contractor/requests?page=${page - 1}`}
                      className="inline-flex items-center gap-1 rounded border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      <ChevronLeft className="h-3 w-3" /> Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground/40 cursor-not-allowed">
                      <ChevronLeft className="h-3 w-3" /> Previous
                    </span>
                  )}

                  <span className="text-[12px] text-muted-foreground px-1">
                    Page {page} of {totalPages}
                  </span>

                  {page < totalPages ? (
                    <Link
                      href={`/dashboard/contractor/requests?page=${page + 1}`}
                      className="inline-flex items-center gap-1 rounded border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      Next <ChevronRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground/40 cursor-not-allowed">
                      Next <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
