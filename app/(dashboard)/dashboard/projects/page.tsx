import Link from "next/link"
import { Plus, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const mockProjects = [
  {
    id: "1",
    title: "Kitchen faucet replacement",
    category: "Plumbing",
    status: "in_progress",
    contractor: "Mike's Plumbing",
    lastUpdate: "Contractor scheduled for tomorrow at 2 PM",
    createdAt: "Mar 10, 2026",
  },
  {
    id: "2",
    title: "Bathroom tile repair",
    category: "Flooring",
    status: "pending",
    contractor: null,
    lastUpdate: "2 contractors have viewed your project",
    createdAt: "Mar 8, 2026",
  },
  {
    id: "3",
    title: "Deck staining",
    category: "Painting",
    status: "completed",
    contractor: "Pro Exteriors LLC",
    lastUpdate: "Project completed - leave a review",
    createdAt: "Feb 28, 2026",
  },
  {
    id: "4",
    title: "Electrical panel upgrade",
    category: "Electrical",
    status: "completed",
    contractor: "Sparks Electric",
    lastUpdate: "Project completed",
    createdAt: "Feb 15, 2026",
  },
]

const statusConfig = {
  pending: { label: "Finding contractor", variant: "warning" as const, icon: Clock },
  in_progress: { label: "In progress", variant: "default" as const, icon: AlertCircle },
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
}

export default function ProjectsPage() {
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search projects..." className="pl-10" />
      </div>

      {/* Projects list */}
      <div className="space-y-3">
        {mockProjects.map((project) => {
          const status = statusConfig[project.status as keyof typeof statusConfig]
          return (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <status.icon className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.contractor || "No contractor assigned"} · {project.lastUpdate}
                </p>
              </div>

              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="text-xs text-muted-foreground">{project.createdAt}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
