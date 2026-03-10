import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessageSquare, Info, MapPin } from "lucide-react"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"

  // Fetch requests that have at least one message
  // For homeowners: requests they own that are assigned
  // For contractors: requests assigned to them
  const { data: threads } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, status, assigned_contractor_id")
    .eq(role === "contractor" ? "assigned_contractor_id" : "owner_id", user.id)
    .not("assigned_contractor_id", "is", null)
    .order("updated_at", { ascending: false })

  const list = threads ?? []

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Communication threads for your active requests.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            A message thread opens automatically when a contractor claims a request. Phone and email contact is available after a consultation is confirmed.
          </p>
        </div>

        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-14 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">No active message threads</h3>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
              {role === "contractor"
                ? "Threads will appear here once you claim a request."
                : "Threads will appear here once a contractor claims one of your requests."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-border bg-card px-5 py-4 transition hover:border-primary/30"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                    {req.category.replace(/-/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">{req.status.replace(/_/g, " ")}</span>
                </div>
                <p className="text-sm font-medium line-clamp-1">{req.description}</p>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />{req.address}, {req.city}, {req.state} {req.zip_code}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
