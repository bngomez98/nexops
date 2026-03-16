import Link from "next/link"
import { Briefcase, DollarSign, Star, TrendingUp, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockActiveJobs = [
  {
    id: "1",
    title: "Kitchen faucet replacement",
    homeowner: "John D.",
    location: "Austin, TX",
    scheduledFor: "Tomorrow at 2 PM",
    amount: "$180",
  },
  {
    id: "2",
    title: "Water heater installation",
    homeowner: "Sarah M.",
    location: "Round Rock, TX",
    scheduledFor: "Wednesday at 10 AM",
    amount: "$850",
  },
]

const mockNewLeads = [
  {
    id: "3",
    title: "Bathroom pipe leak",
    homeowner: "Michael T.",
    location: "Cedar Park, TX",
    urgency: "emergency",
    budget: "$200-400",
    postedAt: "2 hours ago",
  },
  {
    id: "4",
    title: "Toilet replacement",
    homeowner: "Lisa K.",
    location: "Pflugerville, TX",
    urgency: "soon",
    budget: "$300-500",
    postedAt: "5 hours ago",
  },
]

export default function ContractorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{"Welcome back, Mike's Plumbing"}</h1>
          <p className="text-muted-foreground">{"Here's your business at a glance."}</p>
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
            <CardDescription>Active jobs</CardDescription>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Earnings this month</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,280</div>
            <p className="text-xs text-emerald-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Your rating</CardDescription>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Response rate</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Avg. 2hr response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming jobs</CardTitle>
                <CardDescription>Your scheduled work</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActiveJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.homeowner} · {job.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">{job.scheduledFor}</span>
                      <span className="font-semibold text-primary">{job.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Leads */}
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
            <div className="space-y-4">
              {mockNewLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/contractor/jobs/${lead.id}`}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 shrink-0">
                    <Briefcase className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium">{lead.title}</h3>
                      <Badge variant={lead.urgency === "emergency" ? "destructive" : "secondary"}>
                        {lead.urgency === "emergency" ? "Urgent" : "Soon"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lead.homeowner} · {lead.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{lead.postedAt}</span>
                      <span className="text-sm font-medium">{lead.budget}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
