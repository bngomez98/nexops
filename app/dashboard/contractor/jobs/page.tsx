'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Briefcase, MapPin, Clock, ChevronRight,
  Zap,
} from 'lucide-react'

interface Job {
  id: string
  service_type: string
  urgency: string
  description: string
  status: string
  created_at: string
  properties?: { address: string; city: string; state: string }
  profiles?: { full_name: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  matched:         { label: 'Assigned',       color: 'text-primary', bg: 'bg-primary/10' },
  in_progress:     { label: 'In Progress',    color: 'text-primary',    bg: 'bg-primary/10' },
  pending_invoice: { label: 'Pending Invoice',color: 'text-foreground/70', bg: 'bg-muted' },
  completed:       { label: 'Complete',       color: 'text-foreground', bg: 'bg-muted' },
  declined:        { label: 'Declined',       color: 'text-muted-foreground', bg: 'bg-muted' },
}

const URGENCY_MAP: Record<string, { label: string; color: string }> = {
  routine:   { label: 'Routine',   color: 'text-muted-foreground' },
  urgent:    { label: 'Urgent',    color: 'text-foreground/70' },
  emergency: { label: 'Emergency', color: 'text-red-600' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export default function ContractorJobsPage() {
  const router = useRouter()
  const [user, setUser]       = useState<{ id: string; name: string; role: string } | null>(null)
  const [jobs, setJobs]       = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'active' | 'all'>('active')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      const { data } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state), profiles!jobs_client_id_fkey(full_name)')
        .eq('contractor_id', u.id)
        .order('created_at', { ascending: false })
      setJobs(data ?? [])
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

  const displayed = tab === 'active'
    ? jobs.filter(j => ['matched', 'in_progress', 'pending_invoice'].includes(j.status))
    : jobs

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Your assigned jobs and their current status.</p>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit mb-5">
          {(['active', 'all'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-all capitalize ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >{t === 'active' ? 'Active' : 'All Jobs'}</button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No {tab === 'active' ? 'active ' : ''}jobs</p>
            <p className="text-sm text-muted-foreground">Jobs assigned to you will appear here.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {displayed.map(job => {
              const st = STATUS_MAP[job.status] ?? { label: fmt(job.status), color: 'text-muted-foreground', bg: 'bg-muted' }
              const urg = URGENCY_MAP[job.urgency] ?? URGENCY_MAP.routine
              return (
                <Link key={job.id} href={`/dashboard/contractor/jobs/${job.id}`}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-semibold text-foreground text-[13.5px]">{fmt(job.service_type)}</p>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                          {job.properties && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.properties.city}, {job.properties.state}</span>}
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /><span className={urg.color}>{urg.label}</span></span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(job.created_at)}</span>
                        </div>
                        {job.description && <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">{job.description}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
