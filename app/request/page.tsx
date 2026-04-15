'use client'

import { useRef, useState } from 'react'
import {
  Camera,
  Check,
  ChevronRight,
  ClipboardList,
  Loader2,
  X,
} from 'lucide-react'

/* ── Types ─────────────────────────────────────────────────────────────── */

interface PhotoPreview {
  objectUrl: string
  uploadedUrl: string | null
  uploading: boolean
  error: string
}

const CATEGORIES = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'other', label: 'Other' },
]

const BUDGETS = [
  { value: 'under_500', label: 'Under $500' },
  { value: '500_1500', label: '$500–$1,500' },
  { value: '1500_5000', label: '$1,500–$5,000' },
  { value: '5000_plus', label: '$5,000+' },
  { value: 'not_sure', label: 'Not sure' },
]

/* ── Input component ────────────────────────────────────────────────────── */

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-indigo-200/80 uppercase tracking-wider">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-indigo-200/40">{hint}</p>}
    </div>
  )
}

function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`w-full rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/60 focus:bg-white/10 transition ${className}`}
      {...props}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      className="w-full rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/60 focus:bg-white/10 transition resize-none"
      {...props}
    />
  )
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full rounded-xl bg-white/8 border border-white/12 text-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/60 focus:bg-white/10 transition appearance-none"
      {...props}
    >
      {children}
    </select>
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function PublicRequestPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* Form state */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [budget, setBudget] = useState('')

  /* Photo state */
  const [photos, setPhotos] = useState<PhotoPreview[]>([])

  /* Submission state */
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState<{ token: string; id: string } | null>(null)

  /* ── File upload ──────────────────────────────────────────────────────── */

  const uploadFile = async (file: File, index: number): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/portal/public-upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const text = await res.text().catch(() => 'Upload failed')
        throw new Error(text)
      }
      const data = (await res.json()) as { url: string }
      return data.url
    } catch (err) {
      setPhotos((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, uploading: false, error: err instanceof Error ? err.message : 'Upload failed' } : p,
        ),
      )
      return null
    }
  }

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = 10 - photos.length
    const toAdd = files.slice(0, remaining)
    const startIndex = photos.length

    const previews: PhotoPreview[] = toAdd.map((file) => ({
      objectUrl: URL.createObjectURL(file),
      uploadedUrl: null,
      uploading: true,
      error: '',
    }))

    setPhotos((prev) => [...prev, ...previews])
    if (fileInputRef.current) fileInputRef.current.value = ''

    await Promise.all(
      toAdd.map(async (file, i) => {
        const url = await uploadFile(file, startIndex + i)
        if (url) {
          setPhotos((prev) =>
            prev.map((p, idx) =>
              idx === startIndex + i ? { ...p, uploadedUrl: url, uploading: false } : p,
            ),
          )
        }
      }),
    )
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].objectUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  /* ── Submit ───────────────────────────────────────────────────────────── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!name.trim() || !email.trim() || !address.trim() || !description.trim()) {
      setFormError('Please fill in all required fields (name, email, service address, description).')
      return
    }
    if (photos.some((p) => p.uploading)) {
      setFormError('Please wait for all photos to finish uploading.')
      return
    }

    setSubmitting(true)
    try {
      const mediaUrls = photos.map((p) => p.uploadedUrl).filter(Boolean) as string[]
      const res = await fetch('/api/portal/public-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          address: address.trim(),
          category: category || 'other',
          description: description.trim(),
          preferredDate: preferredDate || undefined,
          budget: budget || undefined,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        }),
      })

      const data = (await res.json()) as { success?: boolean; token?: string; id?: string; error?: string }

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Submission failed. Please try again.')
      }

      setSuccess({ token: data.token ?? '', id: data.id ?? '' })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success screen ───────────────────────────────────────────────────── */

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 60%), linear-gradient(180deg, #050816 0%, #060a1f 50%, #04060f 100%)',
      }}>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Check size={32} className="text-emerald-300" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Request submitted!</h1>
            <p className="mt-2 text-sm text-indigo-200/70">
              We received your request. Our team will review it and reach out to you soon.
            </p>
          </div>
          <div className="rounded-2xl bg-white/8 border border-white/10 p-4 text-left space-y-1">
            <p className="text-[11px] uppercase tracking-wider text-indigo-200/50 font-mono">Tracking token</p>
            <p className="text-sm font-mono text-indigo-100 break-all">{success.token}</p>
            <p className="text-[11px] text-indigo-200/40 mt-1">Save this token to check your request status later.</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-indigo-200/60">
              Want to track your request, message your contractor, and pay online?
            </p>
            <a
              href={`/auth/register?email=${encodeURIComponent(email)}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 text-sm transition"
            >
              Create a free account <ChevronRight size={16} />
            </a>
            <p className="text-xs text-indigo-200/40">No account required — just a bonus.</p>
          </div>
        </div>
      </div>
    )
  }

  /* ── Form ─────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen p-6" style={{
      background: 'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 60%), linear-gradient(180deg, #050816 0%, #060a1f 50%, #04060f 100%)',
      color: '#e8ecff',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div className="max-w-xl mx-auto py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <ClipboardList size={20} className="text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Request a service</h1>
            <p className="text-xs text-indigo-200/50 mt-0.5">No account required · Free to submit</p>
          </div>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-5">
          {/* Contact info */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/80">Contact information</h2>
            <Field label="Full name" required>
              <Input
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" required>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone" hint="Optional">
                <Input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </Field>
            </div>
          </div>

          {/* Service details */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/80">Service details</h2>
            <Field label="Service address" required>
              <Input
                placeholder="123 Main St, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
              />
            </Field>
            <Field label="Service category">
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled style={{ background: '#060a1f' }}>Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} style={{ background: '#060a1f' }}>{c.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Description" required>
              <Textarea
                placeholder="Describe the issue — what's happening, when it started, any relevant details…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </div>

          {/* Optional details */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/80">Optional details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Preferred date">
                <Input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </Field>
              <Field label="Budget range">
                <Select value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="" style={{ background: '#060a1f' }}>Not sure</option>
                  {BUDGETS.map((b) => (
                    <option key={b.value} value={b.value} style={{ background: '#060a1f' }}>{b.label}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>

          {/* Photos */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/80">Photos &amp; videos</h2>
            <p className="text-xs text-indigo-200/50">Upload up to 10 files to help us understand the issue.</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => { void handleFilesSelected(e) }}
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {photos.map((photo, i) => (
                  <div
                    key={photo.objectUrl}
                    className="relative aspect-square rounded-xl overflow-hidden bg-white/8 border border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.objectUrl}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {photo.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 size={20} className="animate-spin text-white" />
                      </div>
                    )}
                    {photo.error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-rose-900/70">
                        <span className="text-[10px] text-rose-200 text-center px-1">Failed</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition"
                      aria-label="Remove"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 10}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 hover:bg-white/12 disabled:opacity-40 px-4 py-2.5 text-sm text-indigo-100 transition"
            >
              <Camera size={15} />
              {photos.length === 0 ? 'Add photos or videos' : `Add more (${photos.length}/10)`}
            </button>
          </div>

          {/* Error */}
          {formError && (
            <div className="rounded-2xl bg-rose-500/10 border border-rose-400/20 px-4 py-3 text-sm text-rose-300">
              {formError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || photos.some((p) => p.uploading)}
            className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-4 text-sm transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" />Submitting…</>
            ) : (
              <>Submit request <ChevronRight size={16} /></>
            )}
          </button>

          <p className="text-center text-xs text-indigo-200/40">
            No account required. We&apos;ll contact you at the email provided.
          </p>
        </form>
      </div>
    </div>
  )
}
