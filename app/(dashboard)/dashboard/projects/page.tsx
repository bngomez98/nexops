import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { store, SERVICE_LABELS } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Clock, CheckCircle2, AlertCircle, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  open: { label: "Finding contractor", variant: "warning" as const, icon: Clock },
  claimed: { label: "In progress", variant: "default" as const, icon: AlertCircle },
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "secondary" as const, icon: Clock },
};

export default async function ProjectsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "homeowner") redirect("/contractor");

  const requests = store.getRequestsByHomeowner(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">Manage all your home projects</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center space-y-4">
          <p className="text-muted-foreground">
            {"You haven't submitted any projects yet."}
          </p>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4" />
              Submit your first request
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((project) => {
            const status =
              statusConfig[project.status as keyof typeof statusConfig] ??
              statusConfig.open;
            return (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <status.icon className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    <Badge variant="outline">{SERVICE_LABELS[project.category]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.city}, {project.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Max {formatCurrency(project.maxBudget)}
                    </span>
                  </div>
                  {project.status === "claimed" && (
                    <p className="mt-2 text-sm text-emerald-600">
                      A contractor has claimed this project and will be in touch.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end shrink-0">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
