'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { ImageUpload } from '@/components/image-upload'
import { projectRequestSchema } from '@/lib/validators'
import { ZodError } from 'zod'
import { Loader2, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal' },
  { value: 'concrete-work', label: 'Concrete Work' },
  { value: 'roofing',       label: 'Roofing' },
  { value: 'hvac',          label: 'HVAC' },
  { value: 'fencing',       label: 'Fencing' },
  { value: 'electrical',    label: 'Electrical' },
  { value: 'plumbing',      label: 'Plumbing' },
  { value: 'excavation',    label: 'Excavation' },
]

export default function NewProjectRequest() {
  const router = useRouter()
  const [user, setUser]           = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [formData, setFormData]   = useState({
    category: '', title: '', description: '', location: '', budget: '',
  })

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/login'); return }
        const data = await res.json()
        if (data.user.role !== 'homeowner') { router.push('/dashboard/contractor'); return }
        setUser(data.user)
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => { const n = {...prev}; delete n[name]; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    try {
      const validated = projectRequestSchema.parse(formData)
      setSubmitting(true)
      const payload = new FormData()
      payload.append('category',    validated.category)
      payload.append('title',       validated.title)
      payload.append('description', validated.description)
      payload.append('location',    validated.location)
      if (validated.budget) payload.append('budget', String(parseFloat(validated.budget)))
      uploadedImages.forEach(img => payload.append('images', img))

      const res  = await fetch('/api/projects/create', { method: 'POST', body: payload })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to create request'); return }
      router.push('/dashboard/homeowner')
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach(e => { errors[e.path[0] as string] = e.message })
        setFieldErrors(errors)
        setError('Please fix the errors below')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
      }} />

      <main className="md:ml-[220px] p-6 animate-fade-up">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Post a New Request</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Describe your project and get matched with a verified contractor.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                Service Details
              </h2>
              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                    fieldErrors.category ? 'border-destructive' : 'border-input'
                  }`}
                >
                  <option value="">Select a category</option>
                  {SERVICE_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {fieldErrors.category && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.category}</p>}
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Project Title <span className="text-destructive">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Leaking roof on south-facing slope"
                  required
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                    fieldErrors.title ? 'border-destructive' : 'border-input'
                  }`}
                />
                {fieldErrors.title && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.title}</p>}
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the work needed in detail — scope, access, any existing damage, and your preferred timeline…"
                  rows={5}
                  required
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none ${
                    fieldErrors.description ? 'border-destructive' : 'border-input'
                  }`}
                />
                {fieldErrors.description && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.description}</p>}
              </div>
            </div>

            {/* Location + Budget */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                Location &amp; Budget
              </h2>
              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Project Location <span className="text-destructive">*</span>
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Street address or City, State"
                  required
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                    fieldErrors.location ? 'border-destructive' : 'border-input'
                  }`}
                />
                {fieldErrors.location && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.location}</p>}
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Budget Cap <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[13px]">$</span>
                  <input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="5000"
                    min="0"
                    step="1"
                    className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Leaving this blank may result in more competitive bids.
                </p>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                Project Photos <span className="text-muted-foreground font-normal normal-case">(optional)</span>
              </h2>
              <ImageUpload onImagesChange={setUploadedImages} maxFiles={5} maxSizeInMB={10} />
              <p className="text-[11px] text-muted-foreground">
                Upload up to 5 photos. Contractors use them to understand the scope before bidding.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-[13.5px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Post Request</>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-3 rounded-xl border border-border text-[13.5px] font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
