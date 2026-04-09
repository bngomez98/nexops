'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Loader2, MapPin, Zap, Clock, ChevronLeft, CheckCircle2,
  AlertCircle, Upload, Phone,
} from 'lucide-react'

interface Job {
  id: string
  service_type: string
  urgency: string
  description: string
  status: string
  created_at: string
  properties?: { address: string; city: string; state: string; zip: string }
  client_profile?: { full_name: string; phone: string; photo_url: string }
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

const URGENCY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  routine:   { label: 'Routine',   color: 'text-foreground/70', bg: 'bg-muted' },
  urgent:    { label: 'Urgent',    color: 'text-foreground/70', bg: 'bg-muted' },
  emergency: { label: 'Emergency', color: 'text-red-700',   bg: 'bg-red-100' },
}

export default function ContractorJobDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [user, setUser]     = useState<{ id: string; name: string; role: string } | null>(null)
  const [job, setJob]       = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [uploadingContract, setUploadingContract] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          properties(address, city, state, zip),
          client_profile:profiles!jobs_client_id_fkey(full_name, phone, photo_url)
        `)
        .eq('id', id)
        .eq('contractor_id', u.id)
        .single()

      if (!data) { router.push('/dashboard/contractor/jobs'); return }
      setJob(data)
      setLoading(false)
    }
    load()
  }, [router, id])

  async function updateStatus(newStatus: string) {
    if (!job) return
    setError(null)
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', job.id)
    if (error) {
      setError('Failed to update status.')
    } else {
      setJob(prev => prev ? { ...prev, status: newStatus } : prev)
      setSuccess('Status updated.')
      setTimeout(() => setSuccess(null), 3000)
    }
    setUpdating(false)
  }

  async function handleContractUpload() {
    if (!contractFile || !user || !job) return
    setUploadingContract(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', contractFile)
      fd.append('bucket', 'contracts')
      fd.append('user_id', user.id)
      fd.append('doc_type', `contract_job_${job.id}`)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      setSuccess('Contract uploaded.')
      setContractFile(null)
    } catch (err) {
      console.error(err)
      setError('Contract upload failed.')
    } finally {
      setUploadingContract(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user || !job) return null

  const urg = URGENCY_MAP[job.urgency] ?? URGENCY_MAP.routine
  const accepted = ['in_progress', 'pending_invoice', 'completed'].includes(job.status)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <Link href="/dashboard/contractor/jobs" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-5">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[13px] text-emerald-700 mb-5">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" /><span>{success}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Header card */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-bold">{fmt(job.service_type)}</h1>
                <p className="text-[13px] text-muted-foreground mt-0.5">Job #{job.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${urg.bg} ${urg.color}`}>
                <Zap className="w-3 h-3" /> {urg.label}
              </span>
            </div>

            <div className="space-y-2 text-[13px] text-muted-foreground">
              {job.properties && (
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" />{job.properties.address}, {job.properties.city}, {job.properties.state} {job.properties.zip}</p>
              )}
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0" />Submitted {new Date(job.created_at).toLocaleDateString()}</p>
            </div>

            {job.description && (
              <div className="mt-4 p-3 bg-muted/40 rounded-lg">
                <p className="text-[13px] text-foreground">{job.description}</p>
              </div>
            )}
          </div>

          {/* Client info — only show after acceptance */}
          {accepted && job.client_profile && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[13px] font-semibold mb-3">Client Information</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-[12px] font-bold text-primary">
                  {job.client_profile.full_name?.[0]?.toUpperCase() ?? 'C'}
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{job.client_profile.full_name}</p>
                  {job.client_profile.phone && (
                    <p className="text-[12px] text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{job.client_profile.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status actions */}
          {job.status !== 'completed' && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[13px] font-semibold mb-3">Update Status</p>
              <div className="space-y-2">
                {job.status === 'matched' && (
                  <Button onClick={() => updateStatus('in_progress')} disabled={updating} className="w-full h-10 text-[13px] font-semibold">
                    {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Accept & Mark In Progress
                  </Button>
                )}
                {job.status === 'in_progress' && (
                  <Button onClick={() => updateStatus('pending_invoice')} disabled={updating} variant="outline" className="w-full h-10 text-[13px]">
                    Mark Complete — Create Invoice
                  </Button>
                )}
                {job.status === 'pending_invoice' && (
                  <Link href={`/dashboard/contractor/invoices/new?job_id=${job.id}`}>
                    <Button className="w-full h-10 text-[13px] font-semibold">Create Invoice</Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Contract upload */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[13px] font-semibold mb-3">Contract</p>
            <input id="contractInput" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setContractFile(e.target.files?.[0] ?? null)} />
            <label htmlFor="contractInput" className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${contractFile ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-[13px] text-muted-foreground truncate">{contractFile?.name ?? 'Upload signed contract…'}</span>
              {contractFile && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
            </label>
            {contractFile && (
              <Button onClick={handleContractUpload} disabled={uploadingContract} size="sm" className="mt-3 h-9 px-4 text-[13px]">
                {uploadingContract ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Uploading</> : 'Upload Contract'}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
