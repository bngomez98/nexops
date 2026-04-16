'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, FolderOpen, Upload, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react'

interface Document {
  id: string
  type: string
  file_url: string
  expires_at: string | null
  verified: boolean
  created_at: string
}

const DOC_TYPE_LABELS: Record<string, string> = {
  homeowner_insurance: 'Homeowner Insurance',
  contract: 'Contract',
}

export default function HomeownerDocumentsPage() {
  const router = useRouter()
  const [user, setUser]     = useState<{ id: string; name: string; role: string } | null>(null)
  const [docs, setDocs]     = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [file, setFile]     = useState<File | null>(null)
  const [docType, setDocType] = useState('homeowner_insurance')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'homeowner' })

      const { data } = await supabase.from('documents').select('*').eq('user_id', u.id).order('created_at', { ascending: false })
      setDocs(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleUpload() {
    if (!file || !user) return
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'compliance-docs')
      fd.append('user_id', user.id)
      fd.append('doc_type', docType)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')

      const supabase = createClient()
      const { data } = await supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setDocs(data ?? [])
      setFile(null)
    } catch (err) {
      console.error(err)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
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
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Your uploaded documents, including insurance and contracts.</p>
        </div>

        {error && <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-5"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

        {/* Upload */}
        <div className="bg-card border border-border rounded-xl p-5 mb-5 space-y-4">
          <p className="text-[13px] font-semibold">Upload Document</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[12px]">Document type</Label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="homeowner_insurance">Homeowner Insurance</option>
                <option value="contract">Contract</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <input id="docInput" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          <label htmlFor="docInput" className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
            <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-[13px] text-muted-foreground truncate">{file?.name ?? 'Click to choose file… (PDF, JPG, PNG · max 10MB)'}</span>
            {file && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
          </label>
          <Button onClick={handleUpload} disabled={!file || uploading} size="sm" className="h-9 px-4 text-[13px]">
            {uploading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Uploading</> : 'Upload'}
          </Button>
        </div>

        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl text-center px-6">
            <FolderOpen className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold text-foreground mb-1">No documents uploaded</p>
            <p className="text-sm text-muted-foreground">Uploaded documents will appear here.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-start gap-3 px-5 py-4">
                <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold">{DOC_TYPE_LABELS[doc.type] ?? doc.type}</p>
                  <div className="flex items-center gap-3 text-[12px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(doc.created_at).toLocaleDateString()}</span>
                    {doc.expires_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Exp. {new Date(doc.expires_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${doc.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {doc.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
