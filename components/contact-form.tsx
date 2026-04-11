'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      type: formData.get('type'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Failed to send message. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-foreground">Message sent</h3>
        <p className="mt-2 max-w-md text-[14px] text-muted-foreground">
          Thanks for reaching out. A member of the Nexus team will get back to you within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-[13px] font-semibold text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">
            First name <span className="text-primary">*</span>
          </Label>
          <Input id="firstName" name="firstName" placeholder="John" required autoComplete="given-name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">
            Last name <span className="text-primary">*</span>
          </Label>
          <Input id="lastName" name="lastName" placeholder="Smith" required autoComplete="family-name" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">
          Email <span className="text-primary">*</span>
        </Label>
        <Input id="email" name="email" type="email" placeholder="john@example.com" required autoComplete="email" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="(785) 000-0000" autoComplete="tel" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">
          I am a... <span className="text-primary">*</span>
        </Label>
        <select
          id="type"
          name="type"
          required
          defaultValue=""
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-[14px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="homeowner">Homeowner with a project</option>
          <option value="commercial">Property manager / commercial owner</option>
          <option value="contractor">Contractor interested in joining</option>
          <option value="partner">Potential partner</option>
          <option value="other">Other inquiry</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">
          Message <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project, property, or business."
          rows={5}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-[13px] text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-[11.5px] text-muted-foreground">
        By submitting this form, you agree to receive communications from Nexus Operations. We
        respect your privacy and never share contact details with third parties.
      </p>
    </form>
  )
}
