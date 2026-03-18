import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { store } from "@/lib/store";
import { Plus, Clock, CheckCircle2, AlertCircle, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const statusConfig = {
  open: { label: "Finding contractor", variant: "warning" as const, icon: Clock },
  claimed: { label: "In progress", variant: "default" as const, icon: AlertCircle },
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "secondary" as const, icon: Clock },
};

export default async function HomeownerDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "homeowner") redirect("/contractor");

  const requests = store.getRequestsByHomeowner(user.id);
  const activeProjects = requests.filter((r) => r.status === "open" || r.status === "claimed");
  const completedProjects = requests.filter((r) => r.status === "completed");
  const recent = requests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            {"Here's what's happening with your projects."}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active projects</CardDescription>
            <CardTitle className="text-3xl">{activeProjects.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedProjects.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total requests</CardDescription>
            <CardTitle className="text-3xl">{requests.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent projects</CardTitle>
              <CardDescription>Your latest project activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No projects yet.{" "}
              <Link href="/dashboard/projects/new" className="text-primary hover:underline">
                Start your first one.
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {recent.map((project) => {
                const status =
                  statusConfig[project.status as keyof typeof statusConfig] ??
                  statusConfig.open;
                return (
                  <div
                    key={project.id}
                    className="flex items-start gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <status.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.city}, {project.state}
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Posted {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/dashboard/projects/new">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Start a new project</CardTitle>
                  <CardDescription>Describe what you need done</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/dashboard/messages">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Check messages</CardTitle>
                  <CardDescription>View your conversations</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
