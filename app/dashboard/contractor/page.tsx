"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  TrendingUp,
  DollarSign,
  Zap,
  Target,
  Clock,
  MapPin,
  Camera,
  ArrowUpRight,
  Briefcase,
} from "lucide-react"

interface Lead {
  id: string
  homeownerName: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: "new" | "contacted" | "scheduled" | "won" | "lost"
  tier: "basic" | "premium" | "elite"
  value: number
  createdAt: string
  consultationWindow?: string
}

const weeklyData = [
  { week: "Nov W1", leads: 2, revenue: 2800 },
  { week: "Nov W2", leads: 3, revenue: 4200 },
  { week: "Nov W3", leads: 1, revenue: 950 },
  { week: "Nov W4", leads: 4, revenue: 7100 },
  { week: "Dec W1", leads: 3, revenue: 5600 },
  { week: "Dec W2", leads: 4, revenue: 6900 },
]

function statusBadge(status: Lead["status"]) {
  const map: Record<Lead["status"], { label: string; variant: "success" | "info" | "warning" | "muted" | "destructive" }> = {
    new: { label: "New", variant: "info" },
    contacted: { label: "Contacted", variant: "warning" },
    scheduled: { label: "Scheduled", variant: "success" },
    won: { label: "Won", variant: "success" },
    lost: { label: "Lost", variant: "destructive" },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant as Parameters<typeof Badge>[0]["variant"]}>{label}</Badge>
}

function tierBadge(tier: Lead["tier"]) {
  const colors: Record<Lead["tier"], string> = {
    basic: "text-muted-foreground border-border/40",
    premium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    elite: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${colors[tier]}`}>
      {tier}
    </span>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h === 0 ? "Just now" : `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "contractor") {
      router.replace("/login")
      return
    }
    setUser(stored)

    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .finally(() => setLoading(false))
  }, [router])

  if (!user) return null

  const totalValue = leads.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0)
  const wonLeads = leads.filter((l) => l.status === "won").length
  const closeRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0
  const newLeads = leads.filter((l) => l.status === "new").length

  const stats = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      sub: `${newLeads} new`,
      icon: TrendingUp,
      accent: "text-primary",
    },
    {
      title: "Revenue Won",
      value: `$${totalValue.toLocaleString()}`,
      sub: `${wonLeads} jobs closed`,
      icon: DollarSign,
      accent: "text-emerald-400",
    },
    {
      title: "Close Rate",
      value: `${closeRate}%`,
      sub: "Last 30 days",
      icon: Target,
      accent: "text-amber-400",
    },
    {
      title: "Subscription",
      value: user.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : "—",
      sub: "Active plan",
      icon: Zap,
      accent: "text-violet-400",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-primary text-sm font-medium mb-1">Contractor Portal</p>
        <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
        {user.businessName && (
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            {user.businessName}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ title, value, sub, icon: Icon, accent }) => (
          <Card key={title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className={`${accent} p-1.5 rounded-lg bg-primary/5`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Lead Activity</CardTitle>
            <CardDescription>Weekly lead volume and revenue over the last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0.015 240)" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "oklch(0.60 0.01 240)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.60 0.01 240)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.12 0.012 240)",
                    border: "1px solid oklch(0.20 0.015 240)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "oklch(0.95 0.005 90)" }}
                />
                <Bar dataKey="leads" name="Leads" fill="oklch(0.75 0.18 155)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
            <CardDescription>Current subscription details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tier</span>
              <span className="font-semibold capitalize text-primary">{user.subscription ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Advance notice</span>
              <span className="text-sm font-medium">
                {user.subscription === "elite" ? "5 min exclusive" : user.subscription === "premium" ? "60 sec" : "Real-time"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Categories</span>
              <span className="text-sm font-medium">{(user.serviceCategories ?? []).length} active</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
              {(user.serviceCategories ?? []).map((cat) => (
                <span key={cat} className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">{cat}</span>
              ))}
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-auto"
            >
              Upgrade plan <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Leads table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>All leads assigned to your account</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No leads yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Homeowner</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Service</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Budget</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tier</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Window</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className={`${i < leads.length - 1 ? "border-b border-border/20" : ""} hover:bg-secondary/40 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{lead.homeownerName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {lead.address.split(",")[0]}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{lead.service}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">{lead.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">{lead.budget}</td>
                      <td className="px-4 py-4">{tierBadge(lead.tier)}</td>
                      <td className="px-4 py-4">{statusBadge(lead.status)}</td>
                      <td className="px-4 py-4">
                        {lead.consultationWindow ? (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            {lead.consultationWindow}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-muted-foreground">{timeAgo(lead.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
