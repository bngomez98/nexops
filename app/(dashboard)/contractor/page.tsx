import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { store, SERVICE_LABELS } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Briefcase,
  DollarSign,
  Star,
  TrendingUp,
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClaimButton } from "@/components/claim-button";

export default async function ContractorDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "contractor") redirect("/dashboard");

  const leads = store.getOpenRequests();
  const claimed = store.getClaimedByContractor(user.id);
  const recentLeads = leads.slice(0, 3);

  const totalValue = claimed.reduce((s, r) => s + r.maxBudget, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.company ?? user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            {"Here's your business at a glance."}
          </p>
        </div>
        <Button asChild>
          <Link href="/contractor/jobs">
            Browse jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Available leads</CardDescription>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">Open projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Claimed projects</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{claimed.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalValue)} pipeline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Membership</CardDescription>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">
              {user.membershipTier ?? "Standard"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.membershipActive ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>License</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {user.licenseNumber ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">License number</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Claimed projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My projects</CardTitle>
                <CardDescription>Projects you have claimed</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {claimed.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {"You haven't claimed any projects yet."}
              </p>
            ) : (
              <div className="space-y-4">
                {claimed.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-start gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {SERVICE_LABELS[job.category]}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.city}, {job.state}
                        </span>
                        <span className="font-semibold text-primary text-sm">
                          {formatCurrency(job.maxBudget)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New leads */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>New job leads</CardTitle>
                <CardDescription>Projects looking for contractors</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contractor/jobs">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No open leads right now. Check back soon.
              </p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-start gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 shrink-0">
                      <Briefcase className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm">{lead.title}</h3>
                        <Badge variant="warning">Open</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {SERVICE_LABELS[lead.category]}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.city}, {lead.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(lead.maxBudget)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <ClaimButton requestId={lead.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
