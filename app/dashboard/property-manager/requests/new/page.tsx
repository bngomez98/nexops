'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { ImageUpload } from '@/components/image-upload'
import { projectRequestSchema } from '@/lib/validators'
import { todayDateInputValue } from '@/lib/date-format'
import { Loader2, ChevronLeft, AlertCircle } from 'lucide-react'
import { ZodError } from 'zod'

type PMUser = { id: string; name: string; role: string }

export default function PMNewRequestPage() {
  const router = useRouter()
  const [user, setUser] = useState<PMUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    preferredDate: '',
    budget: '',
    urgency: 'normal',
  })

  useEffect(() => {
    async function load() {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) {
          router.push('/auth/login')
          return
        }
        const authData = await authRes.json()
        if (authData.user.role !== 'property-manager') {
          router.push('/dashboard')
          return
        }
        setUser(authData.user)
      } catch (err) {
        console.error(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.category.trim()) errs.category = 'Service category is required.'
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    if (!form.location.trim()) errs.location = 'Service address is required.'
    if (!form.preferredDate) errs.preferredDate = 'Preferred date is required.'
    if (uploadedImages.length < 2 || uploadedImages.length > 9) errs.photoUrls = 'Please upload between 2 and 9 photos.'
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      setError('Please fix the highlighted fields.')
      return
    }

    setError('')
    setFieldErrors({})
    setSaving(true)
    try {
      const photoUrls: string[] = []
      for (const image of uploadedImages) {
        const uploadBody = new FormData()
        uploadBody.append('file', image)
        uploadBody.append('bucket', 'job-photos')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadBody })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok || !uploadData?.url) {
          throw new Error(uploadData?.error || 'Failed to upload photos.')
        }
        photoUrls.push(String(uploadData.url))
      }

      const validated = projectRequestSchema.parse({
        category: form.category.trim(),
        customCategory: '',
        title: form.title,
        description: form.description,
        location: form.location,
        budget: form.budget,
        preferredDate: form.preferredDate,
        urgency: form.urgency as 'urgent' | 'high' | 'normal' | 'low',
        pipelineMode: 'automated',
        communityVisible: true,
        accessRequirements: '',
        photoUrls,
      })

      const payload = new FormData()
      payload.append('category', validated.category)
      payload.append('title', validated.title)
      payload.append('description', validated.description)
      payload.append('location', validated.location)
      payload.append('preferredDate', validated.preferredDate)
      payload.append('pipelineMode', validated.pipelineMode)
      payload.append('communityVisible', String(validated.communityVisible))
      if (validated.budget) payload.append('budget', String(parseFloat(validated.budget)))
      if (validated.urgency) payload.append('urgency', validated.urgency)
      validated.photoUrls.forEach((url) => payload.append('photoUrls', url))

      const res = await fetch('/api/projects/create', { method: 'POST', body: payload })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.')
      }
      router.push('/dashboard/property-manager/requests')
    } catch (err) {
      if (err instanceof ZodError) {
        const zodErrors: Record<string, string> = {}
        err.issues.forEach((issue) => {
          zodErrors[String(issue.path[0] ?? 'form')] = issue.message
        })
        setFieldErrors(zodErrors)
        setError('Please fix the highlighted fields.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to submit request.')
      }
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  }
  if (!user) return null

  const minDate = todayDateInputValue()

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/auth/login')
      }} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-2xl">
        <Link href="/dashboard/property-manager/requests" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Requests
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">New Service Request</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Enter any service category and submit 2–9 photos for faster contractor routing.</p>
        </div>

        {error && <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-5"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <label className="block text-[13px] font-semibold">Service Category *</label>
            <input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., parking lot striping, plumbing, roof patch, specialty cleanup"
              className={`w-full rounded-lg border px-3 py-2.5 text-[13px] bg-background ${fieldErrors.category ? 'border-destructive' : 'border-input'}`}
            />
            {fieldErrors.category && <p className="text-[11.5px] text-destructive">{fieldErrors.category}</p>}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <label className="block text-[13px] font-semibold">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Short summary of the issue"
              className={`w-full rounded-lg border px-3 py-2.5 text-[13px] bg-background ${fieldErrors.title ? 'border-destructive' : 'border-input'}`}
            />
            {fieldErrors.title && <p className="text-[11.5px] text-destructive">{fieldErrors.title}</p>}

            <label className="block text-[13px] font-semibold">Description *</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe scope, urgency, and access details."
              className={`w-full rounded-lg border px-3 py-2.5 text-[13px] bg-background resize-none ${fieldErrors.description ? 'border-destructive' : 'border-input'}`}
            />
            {fieldErrors.description && <p className="text-[11.5px] text-destructive">{fieldErrors.description}</p>}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <label className="block text-[13px] font-semibold">Service Address *</label>
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="123 Main St, Topeka, KS 66612"
              className={`w-full rounded-lg border px-3 py-2.5 text-[13px] bg-background ${fieldErrors.location ? 'border-destructive' : 'border-input'}`}
            />
            {fieldErrors.location && <p className="text-[11.5px] text-destructive">{fieldErrors.location}</p>}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Preferred Date *</label>
                <input
                  type="date"
                  min={minDate}
                  value={form.preferredDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, preferredDate: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2.5 text-[13px] bg-background ${fieldErrors.preferredDate ? 'border-destructive' : 'border-input'}`}
                />
                {fieldErrors.preferredDate && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.preferredDate}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Budget (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g. 2500"
                  className="w-full rounded-lg border border-input px-3 py-2.5 text-[13px] bg-background"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <p className="text-[13px] font-semibold">Photos * (2–9 required)</p>
            <ImageUpload onImagesChange={setUploadedImages} maxFiles={9} maxSizeInMB={10} />
            {fieldErrors.photoUrls && <p className="text-[11.5px] text-destructive">{fieldErrors.photoUrls}</p>}
          </div>

          <button type="submit" disabled={saving} className="w-full rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] px-4 py-3 hover:opacity-90 disabled:opacity-60">
            {saving ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </main>
    </div>
  )
}
