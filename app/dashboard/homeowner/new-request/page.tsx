'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { ImageUpload } from '@/components/image-upload'
import { formatDateOnly, todayDateInputValue } from '@/lib/date-format'
import { projectRequestSchema } from '@/lib/validators'
import { parseBooleanEnv } from '@/lib/env'
import { ZodError } from 'zod'
import {
  Loader2, ChevronLeft, AlertCircle, CheckCircle2,
  ArrowRight, MapPin, DollarSign, Zap, CalendarDays,
} from 'lucide-react'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal',  icon: '🌳', desc: 'Tree & stump removal, debris clearing' },
  { value: 'concrete-work', label: 'Concrete Work', icon: '🏗️', desc: 'Driveways, sidewalks, foundations' },
  { value: 'roofing',       label: 'Roofing',       icon: '🏠', desc: 'Repair, replacement, inspection' },
  { value: 'hvac',          label: 'HVAC',          icon: '❄️', desc: 'Heating, cooling, ventilation' },
  { value: 'fencing',       label: 'Fencing',       icon: '🏡', desc: 'Wood, vinyl, chain-link, ornamental' },
  { value: 'electrical',    label: 'Electrical',    icon: '⚡', desc: 'Panel, wiring, outlets, lighting' },
  { value: 'plumbing',      label: 'Plumbing',      icon: '🔧', desc: 'Repairs, drains, installations' },
  { value: 'excavation',    label: 'Excavation',    icon: '🚜', desc: 'Grading, trenching, land clearing' },
  { value: 'open-request',  label: 'Open Request',  icon: '🌐', desc: 'Broadcast to all service specialties' },
  { value: 'other',         label: 'Other',         icon: '🧩', desc: 'Custom, specialty, or community request' },
]

const SERVICE_CATEGORY_VALUES = new Set(SERVICE_CATEGORIES.map(cat => cat.value))

const STEPS = [
  { label: 'Category', desc: 'What type of work?' },
  { label: 'Details',  desc: 'Describe the project' },
  { label: 'Location', desc: 'Where, when & budget' },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done   = i < current
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
              <p className={`text-[10.5px] font-medium mt-1.5 hidden sm:block ${
                active ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground'
              }`}>
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

type RequestUser = {
  name: string
  role: string
}

export default function NewProjectRequest() {
  const router = useRouter()
  const automationEnabled = parseBooleanEnv(process.env.NEXT_PUBLIC_AUTOMATION_ENABLED)
  const [user, setUser]             = useState<RequestUser | null>(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep]             = useState(0)
  const [error, setError]           = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null)
  const [suggestedBudget, setSuggestedBudget]     = useState<{ min: number; max: number } | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<{
    scopeSummary: string | null
    riskFlags: string[]
    permitLikely: boolean
    urgency: string | null
    followUpQuestion: string | null
  } | null>(null)
  const [analysisError, setAnalysisError] = useState('')
  const [analyzingText, setAnalyzingText] = useState(false)
  const [formData, setFormData] = useState({
    category: 'open-request', customCategory: '', title: '', description: '', location: '', budget: '', preferredDate: '',
    pipelineMode: automationEnabled ? 'automated' : 'standard', communityVisible: automationEnabled, accessRequirements: '',
  })

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const data = await res.json()
        if (data.user.role !== 'homeowner') { router.push('/dashboard/contractor'); return }
        setUser(data.user)
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [router])

  // Debounced AI analysis runs after title/description entry so users still get
  // automation help even when they start with a broad or custom category.
  useEffect(() => {
    if (!automationEnabled) return
    if (!formData.title || !formData.description) return
    const timer = setTimeout(async () => {
      setAnalyzingText(true)
      setAnalysisError('')
      try {
        const res = await fetch('/api/automation/categorize-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formData.title, description: formData.description }),
        })
        if (res.ok) {
          const data = await res.json()
          setSuggestedCategory(data.suggestedCategory ?? null)
          if (data.estimatedBudgetRange) {
            setSuggestedBudget({ min: data.estimatedBudgetRange.min, max: data.estimatedBudgetRange.max })
          }
          setAiAnalysis({
            scopeSummary: data.scopeSummary ?? null,
            riskFlags: data.riskFlags ?? [],
            permitLikely: data.permitLikely ?? false,
            urgency: data.urgency ?? null,
            followUpQuestion: data.followUpQuestion ?? null,
          })
        } else {
          const data = await res.json().catch(() => ({}))
          const requestId = typeof data.requestId === 'string' ? data.requestId : ''
          setAnalysisError(
            requestId
              ? `Automated request analysis is temporarily unavailable. You can still submit your request. Reference: ${requestId}`
              : 'Automated request analysis is temporarily unavailable. You can still submit your request.'
          )
        }
      } catch {
        setAnalysisError('Automated request analysis is temporarily unavailable. You can still submit your request.')
      } finally {
        setAnalyzingText(false)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [formData.title, formData.description, formData.category])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  function validateStep(s: number): boolean {
    setError('')
    setFieldErrors({})
    if (s === 0 && formData.category === 'other' && !formData.customCategory.trim()) {
      setFieldErrors({ customCategory: 'Please describe the service category.' })
      setError('Please describe the service category.')
      return false
    }
    if (s === 0 && !formData.category) {
      setError('Please select a service category.')
      return false
    }
    if (s === 0 && formData.category === 'other' && !formData.customCategory.trim()) {
      setFieldErrors({ customCategory: 'Please describe the service category.' })
      setError('Please describe the service category.')
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const stepErrors: Record<string, string> = {}
    if (!formData.location.trim()) stepErrors.location = 'Location is required.'
    if (!formData.preferredDate) stepErrors.preferredDate = 'Preferred service date is required.'
    if (Object.keys(stepErrors).length > 0) {
      setFieldErrors(stepErrors)
      setError('Please complete the required scheduling details.')
      return
    }
    setError('')
    setFieldErrors({})
    try {
      const validated = projectRequestSchema.parse(formData)
      setSubmitting(true)
      const payload = new FormData()
      payload.append('category', validated.category)
      if (validated.customCategory) payload.append('customCategory', validated.customCategory)
      payload.append('title', validated.title)
      payload.append('description', validated.description)
      payload.append('location', validated.location)
      payload.append('preferredDate', validated.preferredDate)
      payload.append('pipelineMode', validated.pipelineMode)
      payload.append('communityVisible', String(validated.communityVisible))
      if (validated.accessRequirements) payload.append('accessRequirements', validated.accessRequirements)
      if (validated.budget) payload.append('budget', String(parseFloat(validated.budget)))
      uploadedImages.forEach(img => payload.append('images', img))

      const res  = await fetch('/api/projects/create', { method: 'POST', body: payload })
      const data = await res.json()
      if (!res.ok) {
        if (data.details) {
          const serverErrors = Object.fromEntries(
            Object.entries(data.details).map(([key, messages]) => [key, Array.isArray(messages) ? messages[0] : String(messages)])
          )
          setFieldErrors(serverErrors)
        }
        setError(data.error || 'Failed to create request')
        setSubmitting(false)
        return
      }

      // Trigger smart contractor matching
      const projectId = data.project?.id ?? data.projectId
      if (automationEnabled && projectId) {
        fetch('/api/automation/match-contractor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        }).catch(() => {})
      }

      router.push('/dashboard/homeowner?submitted=1')
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach(e => { errors[e.path[0] as string] = e.message })
        setFieldErrors(errors)
        setError('Please fix the errors below')
      } else {
        setError('An error occurred. Please try again.')
      }
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
  const minPreferredDate = todayDateInputValue()

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/auth/login')
      }} />

      <main className="md:ml-[220px] p-5 md:p-7">
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

          <StepIndicator current={step} />

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
              <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide mb-3">
                    Select Service Category
                  </h2>
                  <p className="text-[11px] text-muted-foreground mb-5">
                    Choose a quick category below, or enter your own category to support specialty and community requests.
                  </p>
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
                <div className="mt-4">
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                    Custom Category <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    placeholder="e.g., pool maintenance, accessibility modification, signage"
                    className={`w-full px-3 py-2.5 rounded-xl border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${
                      fieldErrors.customCategory ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {fieldErrors.customCategory && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.customCategory}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Custom requests still enter the shared service pipeline so specialists can review, document, and claim them.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.category || formData.category.length < 2}
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
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
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
                    className={`w-full px-3 py-2.5 rounded-xl border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${
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
                    className={`w-full px-3 py-2.5 rounded-xl border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none ${
                      fieldErrors.description ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {fieldErrors.description && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.description}</p>}
                  {analyzingText && (
                    <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Analyzing your request…
                    </p>
                  )}
                  {analysisError && (
                    <p className="text-[11px] text-muted-foreground mt-1">{analysisError}</p>
                  )}
                  {automationEnabled && suggestedCategory && formData.category === 'other' && suggestedCategory !== 'other' && (
                    <div className="mt-2 flex items-center gap-2 text-[12px]">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-muted-foreground">AI suggests:</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (suggestedCategory) {
                            const shouldClearCustomCategory = SERVICE_CATEGORY_VALUES.has(suggestedCategory)
                            setFormData(p => ({
                              ...p,
                              category: suggestedCategory,
                              customCategory: shouldClearCustomCategory ? '' : p.customCategory,
                            }))
                          }
                        }}
                        className="font-semibold text-primary hover:underline"
                      >
                        {suggestedCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </button>
                    </div>
                  )}

                  {/* AI analysis panel */}
                  {automationEnabled && aiAnalysis && !analyzingText && (
                    <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-primary/70">
                        <Zap className="w-3 h-3" />
                        AI Analysis
                      </div>
                      {aiAnalysis.scopeSummary && (
                        <p className="text-[12.5px] text-foreground/90 leading-relaxed">
                          {aiAnalysis.scopeSummary}
                        </p>
                      )}
                      {aiAnalysis.urgency && aiAnalysis.urgency !== 'normal' && (
                        <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          aiAnalysis.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                          aiAnalysis.urgency === 'high'   ? 'bg-muted text-foreground/70' :
                          'bg-muted text-foreground/70'
                        }`}>
                          <AlertCircle className="w-3 h-3" />
                          {aiAnalysis.urgency.charAt(0).toUpperCase() + aiAnalysis.urgency.slice(1)} urgency detected
                        </div>
                      )}
                      {aiAnalysis.riskFlags.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Things to note</p>
                          <ul className="space-y-1">
                            {aiAnalysis.riskFlags.map((flag, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[12px] text-foreground/80">
                                <span className="text-muted-foreground mt-0.5 flex-shrink-0">•</span>
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiAnalysis.permitLikely && (
                        <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          A permit may be required for this type of work in Kansas.
                        </p>
                      )}
                      {aiAnalysis.followUpQuestion && (
                        <p className="text-[12px] text-muted-foreground italic border-t border-border pt-2.5">
                          Consider adding: &ldquo;{aiAnalysis.followUpQuestion}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">
                  Project Photos{' '}
                  <span className="text-muted-foreground font-normal normal-case">(optional but recommended)</span>
                </h2>
                <ImageUpload onImagesChange={setUploadedImages} maxFiles={5} maxSizeInMB={10} />
                <p className="text-[11px] text-muted-foreground">
                  Up to 5 photos help contractors understand scope before arriving.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-xl border border-border font-semibold text-[13px] hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-[13.5px] py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Continue to Location
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ── Step 2: Location & Budget ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide mb-1">
                  Location &amp; Budget
                </h2>

                <div>
                  <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Service Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="123 Main St, Topeka, KS 66612"
                    required
                    className={`w-full px-3 py-2.5 rounded-xl border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${
                      fieldErrors.location ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {fieldErrors.location && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.location}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Preferred Service Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    name="preferredDate"
                    type="date"
                    min={minPreferredDate}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2.5 rounded-xl border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${
                      fieldErrors.preferredDate ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {fieldErrors.preferredDate && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.preferredDate}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Choose when you'd like the first visit, estimate, or service window to start.
                  </p>
                  {!formData.preferredDate && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Select a date to submit this request.
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground mb-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Budget Estimate{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    name="budget"
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 2500"
                    className="w-full px-3 py-2.5 rounded-xl border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                  {automationEnabled && suggestedBudget && !formData.budget && (
                    <div className="mt-2 flex items-center gap-2 text-[12px]">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-muted-foreground">Estimated range:</span>
                      <button
                        type="button"
                        onClick={() => suggestedBudget && setFormData(p => ({ ...p, budget: String(suggestedBudget.max) }))}
                        className="font-semibold text-primary hover:underline"
                      >
                        ${suggestedBudget.min.toLocaleString()} – ${suggestedBudget.max.toLocaleString()}
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    A rough estimate helps contractors determine fit. Final pricing will be confirmed during consultation.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide mb-1">
                  Access &amp; Community Settings
                </h2>
                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Pipeline Mode</label>
                  <select
                    name="pipelineMode"
                    value={formData.pipelineMode}
                    onChange={e => setFormData(prev => ({ ...prev, pipelineMode: e.target.value as 'standard' | 'automated' | 'community' }))}
                    disabled={!automationEnabled}
                    className="w-full px-3 py-2.5 rounded-xl border border-input text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  >
                    {automationEnabled && <option value="automated">Automated matching and tracking (recommended)</option>}
                    {automationEnabled && <option value="community">Community-first routing and contractor visibility</option>}
                    <option value="standard">Standard manual review pipeline</option>
                  </select>
                  {!automationEnabled && (
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Automated and community modes are currently unavailable.
                    </p>
                  )}
                </div>
                <label className="flex items-start gap-2 text-[12px] text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.communityVisible}
                    onChange={e => setFormData(prev => ({ ...prev, communityVisible: e.target.checked }))}
                    disabled={!automationEnabled}
                    className="mt-0.5"
                  />
                  Allow this request to be visible to the full trusted contractor community for faster matching.
                </label>
                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Access Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea
                    name="accessRequirements"
                    value={formData.accessRequirements}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Gate code, best entry, parking details, pets on-site, etc."
                    className="w-full px-3 py-2.5 rounded-xl border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                  />
                </div>
              </div>

              {/* Review summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3">
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-primary">Request Summary</h3>
                <div className="space-y-1.5 text-[13px]">
                  <p><span className="text-muted-foreground">Category:</span> <span className="font-semibold text-foreground">{formData.category === 'other' ? formData.customCategory : selectedCat?.label}</span></p>
                  <p><span className="text-muted-foreground">Title:</span> <span className="font-semibold text-foreground">{formData.title}</span></p>
                  {formData.preferredDate && (
                    <p><span className="text-muted-foreground">Requested date:</span> <span className="font-semibold text-foreground">{formatDateOnly(formData.preferredDate)}</span></p>
                  )}
                  {formData.description && (
                    <p><span className="text-muted-foreground">Description:</span> <span className="text-foreground line-clamp-2">{formData.description}</span></p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-foreground">Service Pipeline</h3>
                <div className="grid sm:grid-cols-5 gap-2">
                  {['Submit request', 'Match specialists', 'Confirm schedule', 'Track updates & docs', 'Review billing'].map((stage, index) => (
                    <div key={stage} className="rounded-xl border border-border bg-background p-3">
                      <p className="text-[10px] font-bold text-primary mb-1">0{index + 1}</p>
                      <p className="text-[12px] text-foreground leading-snug">{stage}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Every request feeds the shared community workflow so scheduling, status tracking, documentation, and billing stay connected.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-border font-semibold text-[13px] hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.preferredDate}
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
