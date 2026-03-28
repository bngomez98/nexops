'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Building2, ChevronLeft, ClipboardList, MapPin, Clock, ChevronRight } from 'lucide-react'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
}

interface Job {
  id: string
  service_type: string
  status: string
  created_at: string
  urgency: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open:            { label: 'Open',        color: 'text-foreground/70', bg: 'bg-muted' },
  matched:         { label: 'Assigned',    color: 'text-primary', bg: 'bg-primary/10' },
  in_progress:     { label: 'In Progress', color: 'text-primary',     bg: 'bg-primary/10' },
  completed:       { label: 'Complete',    color: 'text-foreground', bg: 'bg-muted' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function PMPropertyDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [user, setUser]   = useState<any>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [jobs, setJobs]   = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { data: prop } = await supabase.from('properties').select('*').eq('id', id).eq('owner_id', u.id).single()
      if (!prop) { router.push('/dashboard/property-manager/properties'); return }
      setProperty(prop)

      const { data: jobData } = await supabase.from('jobs').select('*').eq('property_id', id).order('created_at', { ascending: false })
      setJobs(jobData ?? [])
      setLoading(false)
    }
    load()
  }, [router, id])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user || !property) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <Link href="/dashboard/property-manager/properties" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <div className="bg-card border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{property.address}</h1>
              <p className="text-[13px] text-muted-foreground">{[property.city, property.state, property.zip].filter(Boolean).join(', ')}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold mb-3">Job History ({jobs.length})</p>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl text-center">
              <ClipboardList className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-[13px] font-semibold text-foreground">No jobs for this property</p>
              <p className="text-[12px] text-muted-foreground mt-1">Jobs submitted for this address will appear here.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {jobs.map(job => {
                const st = STATUS_MAP[job.status] ?? { label: fmt(job.status), color: 'text-muted-foreground', bg: 'bg-muted' }
                return (
                  <div key={job.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-[13.5px]">{fmt(job.service_type)}</p>
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground">{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
