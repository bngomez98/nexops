'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  MapPin, DollarSign, Calendar, Loader2,
  ChevronRight, Zap, Search, SlidersHorizontal, X,
} from 'lucide-react'

interface ServiceRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  status: string
  createdAt: string
  preferredDate?: string | null
}

const URGENCY_KEYWORDS = ['emergency', 'urgent', 'immediate', 'asap', 'leak', 'flood', 'no heat', 'no power']

function isUrgent(req: ServiceRequest): boolean {
  const text = `${req.title} ${req.description}`.toLowerCase()
  return URGENCY_KEYWORDS.some(k => text.includes(k))
}

function formatCategory(cat: string) {
  return cat.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (hours < 1) return 'Just posted'
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const CATEGORY_ICONS: Record<string, string> = {
  plumbing: '🔧', electrical: '⚡', hvac: '❄️', roofing: '🏠',
  'tree-removal': '🌳', 'tree-services': '🌲', 'concrete-work': '🧱',
  fencing: '🪵', painting: '🖌️', landscaping: '🌿', flooring: '🏗️',
  carpentry: '🪚', excavation: '🚜', 'general-repair': '🔨',
}

function getCategoryIcon(cat: string): string {
  return CATEGORY_ICONS[cat.toLowerCase().replace(/\s+/g, '-')] ?? '🔨'
}

export default function AvailableWorkPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterUrgent, setFilterUrgent] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const authRes = await fetch('/api/auth/me')
      if (!authRes.ok) { router.push('/auth/login'); return }
      const authData = await authRes.json()
      if (authData.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
      setUser(authData.user)

      const res = await fetch('/api/projects/list?type=available')
      if (res.ok) {
        const { projects } = await res.json()
        setRequests(projects ?? [])
      }
    } catch (err) {
      console.error(err)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const filtered = requests.filter(r => {
    const matchSearch = !search || (
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.category?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase())
    )
    const matchUrgent = !filterUrgent || isUrgent(r)
    return matchSearch && matchUrgent
  })

  const urgentCount = requests.filter(isUrgent).length

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="md:ml-[240px] p-6 space-y-6 animate-fade-up">
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-primary-foreground/70 text-[11px] font-semibold uppercase tracking-widest mb-1">Nexus Network</p>
            <h1 className="text-2xl font-bold">Available Work</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {requests.length} open assignment{requests.length !== 1 ? 's' : ''} · {urgentCount} urgent
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Open',   value: requests.length,  color: 'text-foreground' },
            { label: 'Urgent', value: urgentCount,       color: urgentCount > 0 ? 'text-amber-500' : 'text-foreground' },
            { label: 'Showing', value: filtered.length, color: 'text-foreground' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by trade, location, or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground/70 hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterUrgent(!filterUrgent)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterUrgent
                  ? 'bg-amber-500 text-white'
                  : 'bg-secondary text-foreground/70 hover:text-foreground'
              }`}
            >
              <Zap className="w-3 h-3" />
              Urgent only
            </button>
          </div>
        )}

        {/* Work list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <h2 className="font-semibold text-foreground text-[15px]">Open Assignments</h2>
              <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
            <button
              onClick={loadData}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Refresh
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 text-2xl">
                🔍
              </div>
              <p className="font-semibold text-foreground text-[15px] mb-2">
                {requests.length === 0 ? 'No open assignments right now' : 'No results match your filters'}
              </p>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                {requests.length === 0
                  ? 'New service requests are posted regularly. Check back soon or refresh the page.'
                  : 'Try adjusting your search or clearing filters.'}
              </p>
              {(search || filterUrgent) && (
                <button
                  onClick={() => { setSearch(''); setFilterUrgent(false) }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(req => {
                const urgent = isUrgent(req)
                const icon = getCategoryIcon(req.category)
                return (
                  <Link
                    key={req.id}
                    href={`/dashboard/contractor/projects/${req.id}`}
                    className="block px-6 py-5 hover:bg-secondary/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-foreground text-[14px] leading-snug">
                              {req.title || formatCategory(req.category)}
                            </p>
                            {urgent && (
                              <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <Zap className="w-2.5 h-2.5" />
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-1">
                            <span className="font-medium">{formatCategory(req.category)}</span>
                            {req.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {req.location}
                              </span>
                            )}
                          </div>
                          {req.description && (
                            <p className="text-[12.5px] text-muted-foreground line-clamp-2">
                              {req.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
                        {req.budget != null && (
                          <div className="flex items-center gap-0.5 font-bold text-foreground text-[14px]">
                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                            {req.budget.toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {timeAgo(req.createdAt)}
                        </div>
                        {req.preferredDate && (
                          <div className="text-[11px] text-muted-foreground">
                            Needed {new Date(req.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          View & claim <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
