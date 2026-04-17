'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, User, Bell, Shield, AlertTriangle, CheckCircle2, Lock, QrCode, KeyRound, Palette, Upload, RotateCcw } from 'lucide-react'
import { useBranding } from '@/components/branding-provider'

// ── Accessibility contrast helper ──────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return null
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  return [r, g, b].reduce((acc, c, i) => {
    const s = c / 255
    const lin = s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    return acc + lin * [0.2126, 0.7152, 0.0722][i]
  }, 0)
}

function contrastRatio(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  if (!c1 || !c2) return 0
  const l1 = relativeLuminance(c1)
  const l2 = relativeLuminance(c2)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

function ColorContrastBadge({ color, against = '#ffffff' }: { color: string; against?: string }) {
  if (!color || !/^#[0-9a-fA-F]{6}$/.test(color)) return null
  const ratio = contrastRatio(color, against)
  const passes = ratio >= 4.5
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${passes ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {passes ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {ratio.toFixed(1)}:1 {passes ? 'WCAG AA' : 'low contrast'}
    </span>
  )
}

function PropertyManagerSettingsInner() {
  const router = useRouter()
  const { setBranding } = useBranding()
  const [user, setUser]   = useState<{ id: string; name: string; role: string; email?: string } | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({ email: '', phone: '' })
  const [notifications, setNotifications] = useState({
    requestNotifications: true, messageNotifications: true, projectUpdates: true, newsletter: false,
  })

  // Branding state
  const [brandingForm, setBrandingForm] = useState({ brandName: '', primaryColor: '', accentColor: '', logoUrl: '' })
  const [brandingSaving, setBrandingSaving] = useState(false)
  const [brandingError, setBrandingError]   = useState('')
  const [brandingSuccess, setBrandingSuccess] = useState('')
  const [logoUploading, setLogoUploading]   = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // 2FA state
  const [mfaFactors, setMfaFactors]   = useState<Record<string, unknown>[]>([])
  const [enrollData, setEnrollData]   = useState<{ qr: string; secret: string; factorId: string } | null>(null)
  const [verifyCode, setVerifyCode]   = useState('')
  const [mfaLoading, setMfaLoading]   = useState(false)
  const [mfaError, setMfaError]       = useState('')
  const [mfaSuccess, setMfaSuccess]   = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const data = await res.json()
        if (data.user.role !== 'property-manager') { router.push('/auth/login'); return }
        setUser(data.user)
        setFormData({ email: data.user.email, phone: data.user.phone ?? '' })

        // Load branding settings
        const brandingRes = await fetch('/api/settings/branding')
        if (brandingRes.ok) {
          const brandingData = await brandingRes.json()
          if (brandingData?.branding) {
            setBrandingForm({
              brandName: brandingData.branding.brandName ?? '',
              primaryColor: brandingData.branding.primaryColor ?? '',
              accentColor: brandingData.branding.accentColor ?? '',
              logoUrl: brandingData.branding.logoUrl ?? '',
            })
          }
        }

        // Load MFA factors
        const supabase = createClient()
        const { data: mfaData } = await supabase.auth.mfa.listFactors()
        setMfaFactors(mfaData?.all ?? [])
      } catch (err) {
        console.error(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formData.email) { setError('Email is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/settings/property-manager', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save. Please try again.')
        return
      }
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      console.error(err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch('/api/settings/property-manager', { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to delete account.')
        setShowDelete(false)
        return
      }
      router.push('/auth/login')
    } catch (err) {
      console.error(err)
      setError('Failed to delete account.')
      setShowDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  // ── Branding handlers ────────────────────────────────────────────────────

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setBrandingError('Logo must be a JPEG, PNG, WebP, or SVG image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setBrandingError('Logo file must be 2 MB or smaller.')
      return
    }
    setLogoUploading(true)
    setBrandingError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'profile-photos')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json()
        setBrandingError(data.error ?? 'Upload failed.')
        return
      }
      const { url } = await res.json()
      setBrandingForm(prev => ({ ...prev, logoUrl: url }))
    } catch (err) {
      console.error(err)
      setBrandingError('Upload failed. Please try again.')
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  async function handleBrandingSave(e: React.FormEvent) {
    e.preventDefault()
    setBrandingError('')
    setBrandingSuccess('')
    setBrandingSaving(true)
    try {
      const res = await fetch('/api/settings/branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandingForm),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.details) {
          const msgs = Object.values(data.details).flat().join(', ')
          setBrandingError(msgs || 'Validation failed.')
        } else {
          setBrandingError(data.error ?? 'Failed to save. Please try again.')
        }
        return
      }
      const data = await res.json()
      setBrandingSuccess('Branding saved!')
      setTimeout(() => setBrandingSuccess(''), 4000)
      // Push updated branding into context so sidebar updates immediately
      setBranding({
        brandName: data.branding?.brandName ?? '',
        primaryColor: data.branding?.primaryColor ?? '',
        accentColor: data.branding?.accentColor ?? '',
        logoUrl: data.branding?.logoUrl ?? '',
      })
    } catch (err) {
      console.error(err)
      setBrandingError('Failed to save. Please try again.')
    } finally {
      setBrandingSaving(false)
    }
  }

  function handleBrandingReset() {
    setBrandingForm({ brandName: '', primaryColor: '', accentColor: '', logoUrl: '' })
    setBrandingError('')
    setBrandingSuccess('')
    setBranding({})
  }

  async function handleEnroll2FA() {
    setMfaLoading(true)
    setMfaError('')
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Nexus Operations Authenticator' })
      if (error) { setMfaError(error.message); return }
      const qr = data.totp.qr_code
      const secret = data.totp.secret
      setEnrollData({ qr, secret, factorId: data.id })
    } catch (err) {
      console.error(err)
      setMfaError('Failed to start 2FA setup. Please try again.')
    } finally {
      setMfaLoading(false)
    }
  }

  async function handleVerify2FA() {
    if (!enrollData || !verifyCode.trim()) return
    setMfaLoading(true)
    setMfaError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollData.factorId,
        code: verifyCode.trim(),
      })
      if (error) { setMfaError(error.message); return }
      const { data: mfaData } = await supabase.auth.mfa.listFactors()
      setMfaFactors(mfaData?.all ?? [])
      setEnrollData(null)
      setVerifyCode('')
      setMfaSuccess('Two-factor authentication enabled successfully!')
      setTimeout(() => setMfaSuccess(''), 5000)
    } catch (err) {
      console.error(err)
      setMfaError('Invalid code. Please try again.')
    } finally {
      setMfaLoading(false)
    }
  }

  async function handleDisable2FA(factorId: string) {
    setMfaLoading(true)
    setMfaError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.mfa.unenroll({ factorId })
      if (error) { setMfaError(error.message); return }
      const { data: mfaData } = await supabase.auth.mfa.listFactors()
      setMfaFactors(mfaData?.all ?? [])
      setMfaSuccess('Two-factor authentication disabled.')
      setTimeout(() => setMfaSuccess(''), 5000)
    } catch (err) {
      console.error(err)
      setMfaError('Failed to disable 2FA. Please try again.')
    } finally {
      setMfaLoading(false)
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

  const initials = user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
  const totpFactors = mfaFactors.filter(f => f.factor_type === 'totp' && f.status === 'verified')
  const has2FA = totpFactors.length > 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/auth/login')
      }} />

      <main className="md:ml-[240px] p-6 animate-fade-up">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your profile and preferences</p>
          </div>

          {/* Status banners */}
          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* Profile card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-primary/5">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-[12.5px] text-muted-foreground">{user.email}</p>
                <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground text-[14px]">Contact Information</h2>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (785) 555-0100"
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-[14px]">Notification Preferences</h2>
            </div>
            {[
              { key: 'requestNotifications',  label: 'Request Notifications', desc: 'When service requests are submitted or updated' },
              { key: 'messageNotifications',  label: 'Messages',              desc: 'When contractors or homeowners send you a message' },
              { key: 'projectUpdates',        label: 'Project Updates',       desc: 'Status changes on ongoing requests' },
              { key: 'newsletter',            label: 'Newsletter',            desc: 'Property management tips and platform news' },
            ].map(n => (
              <label
                key={n.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={notifications[n.key as keyof typeof notifications]}
                  onChange={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifications] }))}
                  className="w-4 h-4 rounded mt-0.5 accent-primary"
                />
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{n.label}</p>
                  <p className="text-[12px] text-muted-foreground">{n.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Branding */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-primary/5">
              <Palette className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-[14px]">Personalized Branding</h2>
              <span className="ml-auto text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">Beta</span>
            </div>

            <form onSubmit={handleBrandingSave} className="p-6 space-y-5">
              <p className="text-[12.5px] text-muted-foreground">
                Customize how your property management brand appears in your dashboard sidebar and portals. Changes apply to your account only.
              </p>

              {brandingError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive text-[12.5px]">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {brandingError}
                </div>
              )}
              {brandingSuccess && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 text-[12.5px]">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {brandingSuccess}
                </div>
              )}

              {/* Logo upload */}
              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-2">
                  Logo <span className="font-normal text-muted-foreground">(JPEG, PNG, WebP, SVG · max 2 MB)</span>
                </label>
                <div className="flex items-center gap-4">
                  {brandingForm.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brandingForm.logoUrl}
                      alt="Custom logo preview"
                      className="h-12 w-auto max-w-[160px] rounded-lg border border-border object-contain bg-muted/30 p-1"
                    />
                  ) : (
                    <div className="h-12 w-20 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <Palette className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={logoUploading}
                      className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-foreground border border-border px-3 py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-60"
                    >
                      {logoUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {logoUploading ? 'Uploading…' : 'Upload logo'}
                    </button>
                    {brandingForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, logoUrl: '' }))}
                        className="text-[11.5px] text-destructive hover:underline text-left"
                      >
                        Remove logo
                      </button>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>

              {/* Brand name */}
              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Brand Name</label>
                <input
                  type="text"
                  maxLength={100}
                  value={brandingForm.brandName}
                  onChange={e => setBrandingForm(prev => ({ ...prev, brandName: e.target.value }))}
                  placeholder="e.g. Acme Property Group"
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
                <p className="text-[11.5px] text-muted-foreground mt-1">Replaces &quot;NEXUS&quot; in the sidebar logo area.</p>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingForm.primaryColor || '#1a5d2e'}
                      onChange={e => setBrandingForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="h-9 w-10 rounded-md border border-input cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      maxLength={7}
                      value={brandingForm.primaryColor}
                      onChange={e => setBrandingForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#1a5d2e"
                      pattern="^#[0-9a-fA-F]{6}$"
                      className="flex-1 px-3 py-2 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition font-mono"
                    />
                  </div>
                  <div className="mt-1.5">
                    <ColorContrastBadge color={brandingForm.primaryColor} against="#ffffff" />
                  </div>
                  <p className="text-[11.5px] text-muted-foreground mt-1">Used for buttons, highlights, and links.</p>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingForm.accentColor || '#e8f5ec'}
                      onChange={e => setBrandingForm(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="h-9 w-10 rounded-md border border-input cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      maxLength={7}
                      value={brandingForm.accentColor}
                      onChange={e => setBrandingForm(prev => ({ ...prev, accentColor: e.target.value }))}
                      placeholder="#e8f5ec"
                      pattern="^#[0-9a-fA-F]{6}$"
                      className="flex-1 px-3 py-2 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition font-mono"
                    />
                  </div>
                  <p className="text-[11.5px] text-muted-foreground mt-1">Subtle background tint for accent surfaces.</p>
                </div>
              </div>

              {/* Live preview */}
              {(brandingForm.primaryColor || brandingForm.brandName || brandingForm.logoUrl) && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2 border-b border-border bg-muted/30">
                    Live Preview
                  </p>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: '#0f1512' }}>
                    {brandingForm.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={brandingForm.logoUrl} alt="Preview" className="h-7 w-auto max-w-[120px] object-contain" />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke={brandingForm.primaryColor || '#22c55e'} strokeWidth="5.5" strokeLinecap="round"/>
                        <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke={brandingForm.primaryColor || '#22c55e'} strokeWidth="5.5" strokeLinecap="round"/>
                        <line x1="60" y1="47" x2="60" y2="73" stroke={brandingForm.primaryColor || '#22c55e'} strokeWidth="5" strokeLinecap="round"/>
                        <line x1="47" y1="60" x2="73" y2="60" stroke={brandingForm.primaryColor || '#22c55e'} strokeWidth="5" strokeLinecap="round"/>
                      </svg>
                    )}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                        {brandingForm.brandName || 'NEXUS'}
                      </div>
                      {!brandingForm.brandName && (
                        <div style={{ fontSize: 7.5, fontWeight: 700, color: brandingForm.primaryColor || '#22c55e', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                          OPERATIONS
                        </div>
                      )}
                    </div>
                    <div
                      className="ml-6 px-3 py-1.5 rounded-md text-[12px] font-semibold text-white"
                      style={{ backgroundColor: brandingForm.primaryColor || '#1a5d2e' }}
                    >
                      Sample button
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={brandingSaving}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {brandingSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {brandingSaving ? 'Saving…' : 'Save Branding'}
                </button>
                <button
                  type="button"
                  onClick={handleBrandingReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to defaults
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-[14px]">Two-Factor Authentication (2FA)</h2>
            </div>
            {mfaError && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/8 text-destructive text-[12.5px]">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {mfaError}
              </div>
            )}
            {mfaSuccess && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 text-[12.5px]">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {mfaSuccess}
              </div>
            )}

            {has2FA ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <p className="text-[12.5px] font-semibold">Two-factor authentication is enabled on your account.</p>
                </div>
                {totpFactors.map(f => (
                  <div key={f.id as string} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{(f.friendly_name as string) || 'Authenticator App'}</p>
                        <p className="text-[11px] text-muted-foreground">Added {new Date(f.created_at as string).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisable2FA(f.id as string)}
                      disabled={mfaLoading}
                      className="text-[12px] text-destructive border border-destructive/30 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors font-medium"
                    >
                      {mfaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Disable'}
                    </button>
                  </div>
                ))}
              </div>
            ) : enrollData ? (
              <div className="space-y-4">
                <p className="text-[13px] text-muted-foreground">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code below.
                </p>
                <div className="flex flex-col items-center gap-4 p-5 rounded-xl bg-secondary/30 border border-border">
                  <img src={enrollData.qr} alt="2FA QR Code" className="w-44 h-44 rounded-lg" />
                  <div className="text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">Or enter this code manually:</p>
                    <code className="text-[12px] font-mono bg-background border border-border px-3 py-1.5 rounded-lg select-all break-all">
                      {enrollData.secret}
                    </code>
                  </div>
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={verifyCode}
                      onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="flex-1 px-3 py-2.5 rounded-lg border border-input text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition font-mono tracking-widest text-center"
                    />
                    <button
                      onClick={handleVerify2FA}
                      disabled={mfaLoading || verifyCode.length < 6}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {mfaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Verify
                    </button>
                    <button
                      onClick={() => { setEnrollData(null); setVerifyCode(''); setMfaError('') }}
                      className="px-4 py-2.5 rounded-xl border border-border text-[13px] font-semibold hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[13px] text-muted-foreground">
                  Add an extra layer of security to your account by requiring a one-time code from your phone on login.
                </p>
                <button
                  onClick={handleEnroll2FA}
                  disabled={mfaLoading}
                  className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-primary/15 transition-colors"
                >
                  {mfaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                  Enable Two-Factor Authentication
                </button>
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-destructive" />
              <h2 className="font-semibold text-destructive text-[14px]">Danger Zone</h2>
            </div>
            <p className="text-[12.5px] text-muted-foreground mb-4">
              Deleting your account is permanent and cannot be undone. All your properties and data will be removed.
            </p>
            {showDelete ? (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 space-y-3">
                <p className="text-[13px] font-semibold text-red-700 dark:text-red-400">
                  Are you absolutely sure? This action cannot be reversed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground font-semibold text-[12.5px] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    {deleting ? 'Deleting…' : 'Yes, delete my account'}
                  </button>
                  <button
                    onClick={() => setShowDelete(false)}
                    className="px-4 py-2 rounded-lg border border-border text-[12.5px] font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDelete(true)}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-[12.5px] font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PropertyManagerSettings() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <PropertyManagerSettingsInner />
    </Suspense>
  )
}
