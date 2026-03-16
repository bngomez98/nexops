"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Clock, DollarSign, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const mockJobs = [
  {
    id: "1",
    title: "Bathroom pipe leak repair",
    category: "Plumbing",
    description: "Leaking pipe under bathroom sink. Water damage starting to show on cabinet floor.",
    homeowner: "Michael T.",
    location: "Cedar Park, TX",
    distance: "4.2 miles",
    urgency: "emergency",
    budget: "$200-400",
    postedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Toilet replacement",
    category: "Plumbing",
    description: "Need to replace old toilet with a new low-flow model. Have already purchased the toilet.",
    homeowner: "Lisa K.",
    location: "Pflugerville, TX",
    distance: "8.1 miles",
    urgency: "soon",
    budget: "$300-500",
    postedAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Water heater installation",
    category: "Plumbing",
    description: "Replacing 40-gallon gas water heater. Old unit is 15 years old and starting to rust.",
    homeowner: "Robert J.",
    location: "Austin, TX",
    distance: "2.8 miles",
    urgency: "soon",
    budget: "$800-1200",
    postedAt: "1 day ago",
  },
  {
    id: "4",
    title: "Garbage disposal installation",
    category: "Plumbing",
    description: "Install new garbage disposal. Previous one stopped working. Electrical outlet exists under sink.",
    homeowner: "Amanda S.",
    location: "Round Rock, TX",
    distance: "6.5 miles",
    urgency: "flexible",
    budget: "$150-250",
    postedAt: "2 days ago",
  },
]

const urgencyConfig = {
  emergency: { label: "Urgent", color: "destructive" as const },
  soon: { label: "Soon", color: "warning" as const },
  flexible: { label: "Flexible", color: "secondary" as const },
}

const filters = ["All", "Urgent", "Near me", "High value"]

export default function AvailableJobsPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Available Jobs</h1>
        <p className="text-muted-foreground">Browse and claim projects in your service area</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-10" />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="shrink-0"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Jobs grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {mockJobs.map((job) => {
          const urgency = urgencyConfig[job.urgency as keyof typeof urgencyConfig]
          return (
            <Link
              key={job.id}
              href={`/contractor/jobs/${job.id}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <Badge variant={urgency.color}>{urgency.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{job.category}</p>
                </div>
                <span className="text-lg font-bold text-primary shrink-0">{job.budget}</span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                  <span className="text-xs">({job.distance})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.postedAt}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm">Posted by {job.homeowner}</span>
                <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  View details
                </Button>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
