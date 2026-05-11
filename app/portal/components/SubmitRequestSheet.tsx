'use client'

import { useRef, useState } from 'react'
import {
  Camera,
  Droplet,
  Hammer,
  Leaf,
  Loader2,
  MapPin,
  Sparkles,
  Wind,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  type PortalPriority,
} from '../lib/portal-utils'
import { usePortal } from '../lib/portal-context'
import { Sheet } from './Sheet'

interface SubmitRequestSheetProps {
  open: boolean
  onClose: () => void
  onSubmitted?: (jobId: string) => void
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  plumbing: Droplet,
  electrical: Zap,
  hvac: Wind,
  landscaping: Leaf,
  cleaning: Sparkles,
  handyman: Wrench,
  other: Hammer,
}

const CATEGORIES: string[] = [
  'plumbing', 'electrical', 'hvac', 'landscaping', 'cleaning', 'handyman', 'other',
]

const PRIORITIES: PortalPriority[] = ['low', 'normal', 'high', 'urgent']

interface PhotoPreview {
  objectUrl: string
  uploadedUrl: string | null
  uploading: boolean
  error: string
}

export function SubmitRequestSheet({ open, onClose, onSubmitted }: SubmitRequestSheetProps) {
  const { submitRequest, currentUser } = usePortal()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('plumbing')
  const [priority, setPriority] = useState<PortalPriority>('normal')
  const [location, setLocation] = useState('')
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setTitle('')
    setDescription('')
    setCategory('plumbing')
    setPriority('normal')
    setLocation('')
    // Revoke object URLs to free memory
    photos.forEach((p) => URL.revokeObjectURL(p.objectUrl))
    setPhotos([])
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  /* ── Photo handling ─────────────────────────────────────────────────── */

  const uploadFile = async (file: File, index: number): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'job-photos')
    if (currentUser?.id) formData.append('user_id', currentUser.id)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
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

    // Limit total photos to 6
    const remaining = 6 - photos.length
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

    // Upload each file
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

  /* ── Submit ─────────────────────────────────────────────────────────── */

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Add a title, description, and location to submit.')
      return
    }
    const stillUploading = photos.some((p) => p.uploading)
    if (stillUploading) {
      setError('Please wait for photo uploads to finish.')
      return
    }
    const uploadErrors = photos.some((p) => p.error)
    if (uploadErrors) {
      setError('Some photos failed to upload. Remove them and try again.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const photoUrls = photos.map((p) => p.uploadedUrl).filter(Boolean) as string[]
      const job = await submitRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location: location.trim(),
        photoUrls,
      })
      if (!job) throw new Error('Submission failed')
      reset()
      onClose()
      onSubmitted?.(job.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onClose={handleClose} title="New maintenance request">
      <div className="space-y-5">
        <div>
          <label htmlFor="request-title" className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Title
          </label>
          <input
            id="request-title"
            name="title"
            className="glass-input mt-1.5"
            placeholder="e.g. Leaking kitchen faucet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Category
          </label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c]
              const active = category === c
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                    active
                      ? 'bg-gradient-to-br from-indigo-500/40 to-sky-500/30 border-indigo-300/40 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/5 border-white/10 text-indigo-100/70 hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10.5px] font-medium">{CATEGORY_LABEL[c]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Priority
          </label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const active = priority === p
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-full py-2 text-xs font-semibold border transition ${
                    active
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-indigo-100/70 hover:bg-white/10'
                  }`}
                >
                  <span className={`priority-dot priority-${p} mr-1.5 align-middle`} />
                  {PRIORITY_LABEL[p]}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="request-description" className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Description
          </label>
          <textarea
            id="request-description"
            name="description"
            className="glass-input mt-1.5"
            placeholder="Describe what's going on, when it started, and any access details…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="request-location" className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Location
          </label>
          <div className="relative mt-1.5">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/70" />
            <input
              id="request-location"
              name="location"
              className="glass-input pl-10"
              placeholder="Property address or unit"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* ── Photos ───────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="request-photos" className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Photos / Videos
          </label>
          <input
            ref={fileInputRef}
            id="request-photos"
            name="photos"
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => { void handleFilesSelected(e) }}
          />
          <div className="mt-2 space-y-2">
            {/* Thumbnails */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <div key={photo.objectUrl} className="relative aspect-square rounded-xl overflow-hidden bg-white/8 border border-white/10">
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
                      aria-label="Remove photo"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= 6}
                className="glass-soft flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-100 hover:bg-white/10 transition disabled:opacity-40"
              >
                <Camera size={15} />
                Add photo
              </button>
              <span className="text-xs text-indigo-200/60">
                {photos.length === 0
                  ? 'Up to 6 files'
                  : `${photos.length}/6 attached`}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/20 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="button" className="btn-ghost flex-1" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={() => { void handleSubmit() }}
            disabled={submitting || photos.some((p) => p.uploading)}
          >
            {submitting ? (
              <><Loader2 size={14} className="animate-spin mr-1.5" />Submitting…</>
            ) : (
              'Submit request'
            )}
          </button>
        </div>
      </div>
    </Sheet>
  )
}
