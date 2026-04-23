'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2, Upload, CheckCircle2, AlertCircle, Clock,
  FileText, ShieldCheck, Calendar,
} from 'lucide-react'

interface Document {
  id: string
  type: string
  file_url: string
  expires_at: string | null
  verified: boolean
  created_at: string
}

function statusLabel(doc: Document): { label: string; color: string; bg: string } {
  if (doc.verified) return { label: 'Verified', color: 'text-foreground', bg: 'bg-muted' }
  if (!doc.expires_at) return { label: 'Pending Review', color: 'text-foreground/70', bg: 'bg-muted' }
  const exp = new Date(doc.expires_at)
  const now = new Date()
  const daysLeft = Math.floor((exp.getTime() - now.getTime()) / 86400000)
  if (daysLeft < 0)  return { label: 'Expired', color: 'text-red-700', bg: 'bg-red-100' }
  if (daysLeft < 30) return { label: `Expires in ${daysLeft}d`, color: 'text-foreground/70', bg: 'bg-muted' }
  return { label: 'Pending Review', color: 'text-foreground/70', bg: 'bg-muted' }
}

const DOC_TYPE_LABELS: Record<string, string> = {
  license: 'Business / Trade License',
  insurance: 'General Liability Insurance',
}

export default function ContractorDocumentsPage() {
  const router = useRouter()
  const [user, setUser]       = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [docs, setDocs]       = useState<Document[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', u.id)
        .in('type', ['license', 'insurance'])
        .order('created_at', { ascending: false })
      setDocs(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleUpload(docType: string, file: File, expiryDate: string) {
    if (!user) return
    setError(null)
    setUploading(docType)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'compliance-docs')
      fd.append('user_id', user.id)
      fd.append('doc_type', docType)
      if (expiryDate) fd.append('expires_at', expiryDate)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const { error: e } = await res.json()
        throw new Error(e ?? 'Upload failed')
      }

      // Refresh docs
      const supabase = createClient()
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['license', 'insurance'])
        .order('created_at', { ascending: false })
      setDocs(data ?? [])
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Upload failed')
    } finally {
      setUploading(null)
    }
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
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Compliance Documents</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Upload and manage your license and insurance certificates.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          {(['license', 'insurance'] as const).map(docType => {
            const existing = docs.filter(d => d.type === docType)
            return (
              <DocumentCard
                key={docType}
                docType={docType}
                label={DOC_TYPE_LABELS[docType]}
                documents={existing}
                uploading={uploading === docType}
                onUpload={(file, expiry) => handleUpload(docType, file, expiry)}
              />
            )
          })}
        </div>

        <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold">Verification process</p>
              <p className="text-[13px] text-muted-foreground mt-1">Documents are typically reviewed within 1–2 business days. You&apos;ll receive an email notification once your documents are verified or if additional information is needed.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function DocumentCard({
  docType, label, documents, uploading, onUpload,
}: {
  docType: string
  label: string
  documents: Document[]
  uploading: boolean
  onUpload: (file: File, expiry: string) => void
}) {
  const [file, setFile]   = useState<File | null>(null)
  const [expiry, setExpiry] = useState('')

  const latest = documents[0]

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <p className="text-[13px] font-semibold">{label}</p>
        </div>
        {latest && (() => {
          const st = statusLabel(latest)
          return <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
        })()}
      </div>

      {latest && (
        <div className="rounded-lg bg-muted/40 p-3 text-[12px] text-muted-foreground space-y-1">
          <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Uploaded {new Date(latest.created_at).toLocaleDateString()}</p>
          {latest.expires_at && (
            <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Expires {new Date(latest.expires_at).toLocaleDateString()}</p>
          )}
        </div>
      )}

      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-[12px] text-muted-foreground font-medium">{latest ? 'Upload new version' : 'Upload document'}</p>
        <input
          id={`file-${docType}`} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
        />
        <label htmlFor={`file-${docType}`} className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
          <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-[13px] text-muted-foreground truncate">{file?.name ?? 'Click to choose file… (PDF, JPG, PNG · max 10MB)'}</span>
          {file && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
        </label>

        <div className="flex items-end gap-3">
          <div className="space-y-1 flex-1">
            <Label htmlFor={`expiry-${docType}`} className="text-[12px] text-muted-foreground">Expiry date (optional)</Label>
            <Input id={`expiry-${docType}`} type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="h-9 text-[13px]" />
          </div>
          <Button
            onClick={() => { if (file) { onUpload(file, expiry); setFile(null); setExpiry('') } }}
            disabled={!file || uploading}
            size="sm"
            className="h-9 px-4 text-[13px]"
          >
            {uploading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Uploading</> : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  )
}
