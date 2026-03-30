'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, ClipboardList, MapPin, Clock, ChevronRight,
  Plus, DollarSign,
} from 'lucide-react'

interface Request {
  id: string
  service_type: string
  urgency: string
  description: string
  status: string
  budget_ceiling: number | null
  created_at: string
  properties?: { address: string; city: string; state: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open:            { label: 'Submitted',    color: 'text-foreground/70',    bg: 'bg-muted' },
  matched:         { label: 'Assigned',     color: 'text-primary',          bg: 'bg-primary/10' },
  in_progress:     { label: 'In Progress',  color: 'text-primary',          bg: 'bg-primary/10' },
  pending_invoice: { label: 'Invoiced',     color: 'text-foreground/70',    bg: 'bg-muted' },
  completed:       { label: 'Complete',     color: 'text-foreground',       bg: 'bg-muted' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export default function HomeownerRequestsPage() {
  const router = useRouter()
  const [user, setUser]     = useState<{ id: string; name: string; role: string } | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]       = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'homeowner' })

      const { data } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state)')
        .eq('client_id', u.id)
        .order('created_at', { ascending: false })
      setRequests(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  const displayed = tab === 'all' ? requests
    : tab === 'active' ? requests.filter(r => ['open', 'matched', 'in_progress'].includes(r.status))
    : requests.filter(r => r.status === 'completed')

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
            <p className="text-[14px] text-muted-foreground mt-1">All your submitted service requests.</p>
          </div>
          <Link href="/dashboard/homeowner/new-request">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> New Request
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit mb-5">
          {(['all', 'active', 'completed'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-all capitalize ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >{t}</button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No requests{tab !== 'all' ? ` (${tab})` : ''}</p>
            <p className="text-sm text-muted-foreground mb-5">Submit a request to get matched with a verified contractor.</p>
            <Link href="/dashboard/homeowner/new-request">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90">
                <Plus className="w-4 h-4" /> Submit Request
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {displayed.map(req => {
              const st = STATUS_MAP[req.status] ?? { label: fmt(req.status), color: 'text-muted-foreground', bg: 'bg-muted' }
              return (
                <Link key={req.id} href={`/dashboard/homeowner/requests/${req.id}`}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-foreground text-[13.5px]">{fmt(req.service_type)}</p>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                      {req.properties && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.properties.city}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(req.created_at)}</span>
                      {req.budget_ceiling && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${req.budget_ceiling.toLocaleString()} budget</span>}
                    </div>
                    {req.description && <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">{req.description}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
