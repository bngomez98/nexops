import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { store, SERVICE_LABELS } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClaimButton } from "@/components/claim-button";

export default async function AvailableJobsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "contractor") redirect("/dashboard");

  const leads = store.getOpenRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Available Jobs</h1>
        <p className="text-muted-foreground">
          Browse and claim open projects in your service area
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            No open projects available right now. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {leads.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {SERVICE_LABELS[job.category]}
                  </p>
                </div>
                <Badge variant="warning">Open</Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.city}, {job.state} {job.zip}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Max {formatCurrency(job.maxBudget)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(job.createdAt)}
                </span>
              </div>

              <div className="pt-2 border-t border-border">
                <ClaimButton requestId={job.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
