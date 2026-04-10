'use client'

import { useState } from 'react'
import {
  Camera,
  Droplet,
  Hammer,
  Leaf,
  MapPin,
  Sparkles,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react'
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  type Category,
  type Priority,
} from '../lib/mock-data'
import { usePortal } from '../lib/portal-context'
import { Sheet } from './Sheet'

interface SubmitRequestSheetProps {
  open: boolean
  onClose: () => void
  onSubmitted?: (jobId: string) => void
}

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ size?: number }>> = {
  plumbing: Droplet,
  electrical: Zap,
  hvac: Wind,
  landscaping: Leaf,
  cleaning: Sparkles,
  handyman: Wrench,
  other: Hammer,
}

const CATEGORIES: Category[] = [
  'plumbing',
  'electrical',
  'hvac',
  'landscaping',
  'cleaning',
  'handyman',
  'other',
]

const PRIORITIES: Priority[] = ['low', 'normal', 'high', 'urgent']

export function SubmitRequestSheet({ open, onClose, onSubmitted }: SubmitRequestSheetProps) {
  const { submitRequest } = usePortal()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('plumbing')
  const [priority, setPriority] = useState<Priority>('normal')
  const [location, setLocation] = useState('')
  const [photoCount, setPhotoCount] = useState(0)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setTitle('')
    setDescription('')
    setCategory('plumbing')
    setPriority('normal')
    setLocation('')
    setPhotoCount(0)
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Add a title, description, and location to submit.')
      return
    }
    setSubmitting(true)
    try {
      const job = await submitRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location: location.trim(),
        photoCount,
      })
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
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Title
          </label>
          <input
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
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Description
          </label>
          <textarea
            className="glass-input mt-1.5"
            placeholder="Describe what's going on, when it started, and any access details…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Location
          </label>
          <div className="relative mt-1.5">
            <MapPin
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/70"
            />
            <input
              className="glass-input pl-10"
              placeholder="Property address or unit"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Photos
          </label>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPhotoCount((c) => Math.min(c + 1, 6))}
              className="glass-soft flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-100 hover:bg-white/10 transition"
            >
              <Camera size={15} />
              Add photo
            </button>
            <span className="text-xs text-indigo-200/60">
              {photoCount === 0 ? 'No photos attached' : `${photoCount} photo${photoCount === 1 ? '' : 's'} attached`}
            </span>
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
          <button type="button" className="btn-primary flex-1" onClick={() => { void handleSubmit() }} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      </div>
    </Sheet>
  )
}
