'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Briefcase, MapPin, Clock } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Open',        color: 'text-foreground/70', bg: 'bg-muted' },
  unmatched:   { label: 'Unmatched',   color: 'text-red-700',     bg: 'bg-red-100' },
  matched:     { label: 'Assigned',    color: 'text-primary', bg: 'bg-primary/10' },
  in_progress: { label: 'In Progress', color: 'text-primary',     bg: 'bg-primary/10' },
  completed:   { label: 'Complete',    color: 'text-foreground', bg: 'bg-muted' },
  cancelled:   { label: 'Cancelled',   color: 'text-muted-foreground', bg: 'bg-muted' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function AdminJobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      if (u.user_metadata?.role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })

      const { data } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state), client_profile:profiles!jobs_client_id_fkey(full_name)')
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

  const displayed = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">All Jobs</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Platform-wide job overview. {jobs.length} total.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {['all', 'open', 'unmatched', 'matched', 'in_progress', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${filter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:text-foreground'}`}
            >{f === 'all' ? 'All' : fmt(f)}</button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold mb-1">No jobs found</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {displayed.map(job => {
              const st = STATUS_MAP[job.status as string] ?? { label: fmt(job.status as string), color: 'text-muted-foreground', bg: 'bg-muted' }
              return (
                <div key={job.id as string} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-[13.5px]">{fmt(job.service_type as string)}</p>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                      {job.urgency === 'emergency' && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">🚨 Emergency</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                      {!!job.properties && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{(job.properties as Record<string, unknown>).city as string}, {(job.properties as Record<string, unknown>).state as string}</span>}
                      {!!job.client_profile && <span>Client: {(job.client_profile as Record<string, unknown>).full_name as string}</span>}
                      <span><Clock className="w-3 h-3 inline mr-1" />{new Date(job.created_at as string).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">#{(job.id as string).slice(0, 8).toUpperCase()}</span>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
