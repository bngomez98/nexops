'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { ImageUpload } from '@/components/image-upload'
import { projectRequestSchema } from '@/lib/validators'
import { ZodError } from 'zod'
import {
  Loader2, ChevronLeft, AlertCircle, CheckCircle2,
  ArrowRight, MapPin, DollarSign,
} from 'lucide-react'
import { Loader2, ChevronLeft, AlertCircle, CheckCircle2, Lightbulb, Zap } from 'lucide-react'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal',  icon: '🌳', desc: 'Tree & stump removal, debris clearing' },
  { value: 'concrete-work', label: 'Concrete Work',  icon: '🏗️', desc: 'Driveways, sidewalks, foundations' },
  { value: 'roofing',       label: 'Roofing',        icon: '🏠', desc: 'Repair, replacement, inspection' },
  { value: 'hvac',          label: 'HVAC',           icon: '❄️', desc: 'Heating, cooling, ventilation' },
  { value: 'fencing',       label: 'Fencing',        icon: '🏡', desc: 'Wood, vinyl, chain-link, ornamental' },
  { value: 'electrical',    label: 'Electrical',     icon: '⚡', desc: 'Panel, wiring, outlets, lighting' },
  { value: 'plumbing',      label: 'Plumbing',       icon: '🔧', desc: 'Repairs, drains, installations' },
  { value: 'excavation',    label: 'Excavation',     icon: '🚜', desc: 'Grading, trenching, land clearing' },
]

const STEPS = [
  { label: 'Category', desc: 'What type of work?' },
  { label: 'Details',  desc: 'Describe the project' },
  { label: 'Location', desc: 'Where & budget' },
]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-200 ${
                done   ? 'bg-primary text-primary-foreground' :
                active ? 'bg-primary/15 text-primary ring-2 ring-primary/30' :
                'bg-muted text-muted-foreground'
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <p className={`text-[10.5px] font-medium mt-1.5 hidden sm:block ${active ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground'}`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 mb-5 transition-colors ${i < current ? 'bg-primary/50' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function NewProjectRequest() {
  const router = useRouter()
  const [user, setUser]           = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep]           = useState(0)
  const [error, setError]         = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null)
  const [suggestedBudget, setSuggestedBudget] = useState<{min: number; max: number} | null>(null)
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')
  const [analyzingText, setAnalyzingText] = useState(false)
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

  // Debounced AI analysis
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.title && formData.description && !formData.category) {
        setAnalyzingText(true)
        try {
          const res = await fetch('/api/automation/categorize-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: formData.title,
              description: formData.description,
            }),
          })
          if (res.ok) {
            const data = await res.json()
            setSuggestedCategory(data.suggestedCategory)
            setSuggestedBudget({
              min: data.estimatedBudgetRange.min,
              max: data.estimatedBudgetRange.max,
            })
            setUrgency(data.urgency)
          }
        } finally {
          setAnalyzingText(false)
        }
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [formData.title, formData.description, formData.category])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => { const n = {...prev}; delete n[name]; return n })
  }

  function validateStep(s: number): boolean {
    setError('')
    setFieldErrors({})
    if (s === 0 && !formData.category) {
      setError('Please select a service category.')
      return false
    }
    if (s === 1) {
      const errs: Record<string, string> = {}
      if (!formData.title.trim()) errs.title = 'Project title is required.'
      if (!formData.description.trim()) errs.description = 'Description is required.'
      if (Object.keys(errs).length) { setFieldErrors(errs); setError('Please fix the errors below.'); return false }
    }
    return true
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1)
  function applySuggestion(field: 'category' | 'budget') {
    if (field === 'category' && suggestedCategory) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }))
    } else if (field === 'budget' && suggestedBudget && !formData.budget) {
      setFormData(prev => ({ ...prev, budget: String(suggestedBudget.max) }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.location.trim()) {
      setFieldErrors({ location: 'Location is required.' })
      setError('Please enter the project location.')
      return
    }
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
      router.push('/dashboard/homeowner?submitted=1')
      
      // Trigger smart contractor matching
      if (data.projectId) {
        try {
          await fetch('/api/automation/match-contractor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: data.projectId }),
          })
        } catch (e) {
          console.error('[AutoMatch] Error:', e)
        }
      }
      
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

  const selectedCat = SERVICE_CATEGORIES.find(c => c.value === formData.category)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
      }} />

      <main className="md:ml-[220px] p-6 animate-fade-up">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={step === 0 ? () => router.back() : () => setStep(s => s - 1)}
              className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 0 ? 'Back' : 'Previous'}
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Post a New Request</h1>
              <p className="text-muted-foreground text-[12.5px] mt-0.5">
                Step {step + 1} of {STEPS.length} — {STEPS[step].desc}
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <StepIndicator current={step} total={STEPS.length} />

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* ── Step 0: Category ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide mb-4">
                  Select Service Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SERVICE_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      className={`relative flex flex-col items-center text-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-primary/40 hover:bg-primary/5 ${
                        formData.category === cat.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background'
                      }`}
                    >
                      {formData.category === cat.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <p className="text-[12px] font-semibold text-foreground">{cat.label}</p>
                        <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-tight">{cat.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
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
                <div className="flex gap-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`flex-1 px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                      fieldErrors.category ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {suggestedCategory && !formData.category && (
                    <button
                      type="button"
                      onClick={() => applySuggestion('category')}
                      className="px-3 py-2.5 rounded-lg border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-[13px] font-medium flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {suggestedCategory}
                    </button>
                  )}
                </div>
                {fieldErrors.category && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.category}</p>}
              </div>

              {formData.category && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-[13px] text-primary font-medium animate-fade-up">
                  <CheckCircle2 className="w-4 h-4" />
                  Selected: {selectedCat?.label}
                </div>
              )}

              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.category}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-[13.5px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Continue to Project Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Step 1: Details ── */}
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); nextStep() }} className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedCat?.icon}</span>
                  <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                    {selectedCat?.label} — Project Details
                  </h2>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                    Project Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={`e.g., ${selectedCat?.desc ?? 'Describe your project briefly'}`}
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
                    placeholder="Describe the work needed — scope, access, existing damage, preferred timeline…"
                    rows={5}
                    required
                    className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none ${
                      fieldErrors.description ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {fieldErrors.description && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.description}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1">
                    More detail helps contractors prepare accurate estimates.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                  Project Photos <span className="text-muted-foreground font-normal normal-case">(optional but recommended)</span>
                </h2>
                <ImageUpload onImagesChange={setUploadedImages} maxFiles={5} maxSizeInMB={10} />
                <p className="text-[11px] text-muted-foreground">
                  Up to 5 photos. Contractors use them to understand scope before arriving.
                </p>
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
                {analyzingText && (
                  <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> AI analyzing your request…
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-xl border border-border text-[13.5px] font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-[13.5px] py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Continue to Location & Budget
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ── Step 2: Location & Budget ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                  Location &amp; Budget
                </h2>

                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                    <MapPin className="inline w-3.5 h-3.5 mr-1 text-primary" />
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
                    <DollarSign className="inline w-3.5 h-3.5 mr-1 text-primary" />
                    Maximum Budget <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Budget Cap <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="space-y-2">
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
                    Contractors will not exceed this amount without your approval.
                  </p>
                  {suggestedBudget && !formData.budget && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 text-[12px]">
                        <span className="text-primary font-semibold">Estimated budget: </span>
                        <span className="text-foreground">${suggestedBudget.min.toLocaleString()} – ${suggestedBudget.max.toLocaleString()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => applySuggestion('budget')}
                        className="px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded transition-colors whitespace-nowrap"
                      >
                        Use max
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Review summary */}
              <div className="bg-secondary/40 border border-border rounded-xl p-5 space-y-3">
                <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-wide">Request Summary</h3>
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedCat?.icon}</span>
                    <span className="font-medium text-foreground">{selectedCat?.label}</span>
                  </div>
                  <p className="text-muted-foreground"><strong className="text-foreground">Title:</strong> {formData.title}</p>
                  <p className="text-muted-foreground line-clamp-2"><strong className="text-foreground">Description:</strong> {formData.description}</p>
                  {uploadedImages.length > 0 && (
                    <p className="text-muted-foreground"><strong className="text-foreground">Photos:</strong> {uploadedImages.length} attached</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-border text-[13.5px] font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-[13.5px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Submit Request</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
