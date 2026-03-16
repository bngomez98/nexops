import Link from "next/link"
import { Plus, Clock, CheckCircle2, AlertCircle, ArrowRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockProjects = [
  {
    id: "1",
    title: "Kitchen faucet replacement",
    status: "in_progress",
    contractor: "Mike's Plumbing",
    lastUpdate: "Contractor scheduled for tomorrow at 2 PM",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Bathroom tile repair",
    status: "pending",
    contractor: null,
    lastUpdate: "Waiting for contractor quotes",
    updatedAt: "1 day ago",
  },
  {
    id: "3",
    title: "Deck staining",
    status: "completed",
    contractor: "Pro Exteriors LLC",
    lastUpdate: "Project completed successfully",
    updatedAt: "1 week ago",
  },
]

const statusConfig = {
  pending: { label: "Finding contractor", variant: "warning" as const, icon: Clock },
  in_progress: { label: "In progress", variant: "default" as const, icon: AlertCircle },
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
}

export default function HomeownerDashboard() {
  const activeProjects = mockProjects.filter(p => p.status !== "completed").length
  const completedProjects = mockProjects.filter(p => p.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects.</p>
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
            <CardTitle className="text-3xl">{activeProjects}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed this year</CardDescription>
            <CardTitle className="text-3xl">{completedProjects}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unread messages</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
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
          <div className="space-y-4">
            {mockProjects.map((project) => {
              const status = statusConfig[project.status as keyof typeof statusConfig]
              return (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <status.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.contractor || "No contractor assigned"}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{project.lastUpdate}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Updated {project.updatedAt}</p>
                  </div>
                </Link>
              )
            })}
          </div>
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
                  <CardDescription>You have 2 unread messages</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}
