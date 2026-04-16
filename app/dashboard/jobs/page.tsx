'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Briefcase, MapPin, Clock, DollarSign,
  AlertCircle, CheckCircle2, ChevronRight,
} from 'lucide-react'

interface AvailableJob {
  id: string
  service_type: string
  urgency: string
  description: string
  status: string
  created_at: string
  budget_min?: number
  budget_max?: number
  properties?: { address: string; city: string; state: string }
}

const URGENCY_COLORS: Record<string, string> = {
  routine:   'text-sky-600',
  urgent:    'text-amber-600',
  emergency: 'text-red-600',
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ContractorJobBoardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [jobs, setJobs] = useState<AvailableJob[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'available' | 'mine'>('available')
  const [myJobs, setMyJobs] = useState<AvailableJob[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', u.id)
        .single()

      if (profile?.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
      setUser({ id: u.id, name: profile?.full_name ?? u.email, role: 'contractor' })

      // Load available jobs (in_queue or pending_review = not yet assigned)
      const { data: available } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state)')
        .in('status', ['in_queue', 'pending_review'])
        .order('created_at', { ascending: false })

      setJobs(available ?? [])

      // Load contractor's own jobs
      const { data: mine } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state)')
        .eq('contractor_id', u.id)
        .order('created_at', { ascending: false })

      setMyJobs(mine ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handleClaim(jobId: string) {
    setClaiming(jobId)
    setError(null)
    try {
      const res = await fetch(`/api/projects/claim/${jobId}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to claim job'); return }
      // Remove from available, reload my jobs
      setJobs(prev => prev.filter(j => j.id !== jobId))
      const supabase = createClient()
      const { data: mine } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state)')
        .eq('contractor_id', user!.id)
        .order('created_at', { ascending: false })
      setMyJobs(mine ?? [])
      setTab('mine')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setClaiming(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
    </div>
  )
  if (!user) return null

  const displayedJobs = tab === 'available' ? jobs : myJobs

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Job Board</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Available service requests in your area, matched to your trade.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 text-[13px] mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit mb-5">
          {(['available', 'mine'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'available' ? `Available (${jobs.length})` : `My Jobs (${myJobs.length})`}
            </button>
          ))}
        </div>

        {displayedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">
              {tab === 'available' ? 'No available jobs right now' : 'No jobs claimed yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {tab === 'available' ? 'Check back soon — new requests come in daily.' : 'Claim available jobs to see them here.'}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {displayedJobs.map(job => (
              <div key={job.id} className="flex items-start gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-[13.5px] mb-0.5">{fmt(job.service_type)}</p>
                      <div className="flex items-center gap-3 text-[12px] text-muted-foreground flex-wrap">
                        {job.properties && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.properties.city}, {job.properties.state}
                          </span>
                        )}
                        <span className={`font-semibold ${URGENCY_COLORS[job.urgency] ?? 'text-muted-foreground'}`}>
                          {fmt(job.urgency)}
                        </span>
                        {(job.budget_max ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            {job.budget_max?.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(job.created_at)}
                        </span>
                      </div>
                      {job.description && (
                        <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      {tab === 'available' ? (
                        <button
                          onClick={() => handleClaim(job.id)}
                          disabled={claiming === job.id}
                          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold text-[12px] px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {claiming === job.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                          Claim job
                        </button>
                      ) : (
                        <Link
                          href={`/dashboard/contractor/jobs/${job.id}`}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:opacity-70 transition-opacity"
                        >
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
