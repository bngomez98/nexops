'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, BarChart3, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function AdminMatchesPage() {
  const router = useRouter()
  const [user, setUser]   = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [unmatchedJobs, setUnmatchedJobs] = useState<Record<string, unknown>[]>([])
  const [matches, setMatches] = useState<Record<string, unknown>[]>([])
  const [matching, setMatching] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      if (u.user_metadata?.role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })

      const [unmatchedRes, matchesRes] = await Promise.all([
        supabase.from('jobs').select('*, properties(address, city, state)').in('status', ['open', 'unmatched']).order('created_at', { ascending: false }),
        supabase.from('matches').select('*, jobs(service_type, status)').order('offered_at', { ascending: false }).limit(20),
      ])
      setUnmatchedJobs(unmatchedRes.data ?? [])
      setMatches(matchesRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function triggerMatch(jobId: string) {
    setMatching(jobId)
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId }),
    })
    const data = await res.json()
    if (data.matched) {
      setUnmatchedJobs(prev => prev.filter(j => j.id !== jobId))
    }
    setMatching(null)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Matching Queue</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Manually trigger matching for unassigned jobs.</p>
        </div>

        {unmatchedJobs.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-[13px] font-semibold">Needs Assignment ({unmatchedJobs.length})</p>
            </div>
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {unmatchedJobs.map(job => (
                <div key={job.id as string} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{fmt(job.service_type as string)}</p>
                    {!!job.properties && <p className="text-[12px] text-muted-foreground">{(job.properties as any).city}, {(job.properties as any).state}</p>}
                    <p className="text-[12px] text-muted-foreground">{new Date(job.created_at as string).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => triggerMatch(job.id as string)} disabled={matching === (job.id as string)} size="sm" className="h-8 px-3 text-[12px] flex-shrink-0">
                    {matching === (job.id as string) ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Matching</> : <><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Match</>}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[13px] font-semibold mb-3">Recent Matches ({matches.length})</p>
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="font-semibold mb-1">No match history</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {matches.map((match: Record<string, unknown>) => (
                <div key={match.id as string} className="flex items-center gap-4 px-5 py-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{match.jobs ? fmt((match.jobs as any).service_type) : 'Job'}</p>
                    <p className="text-[12px] text-muted-foreground">{new Date(match.offered_at as string).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground capitalize">{(match.response as string) ?? 'Pending'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
