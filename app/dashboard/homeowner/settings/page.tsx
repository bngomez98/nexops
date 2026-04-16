'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, User, Bell, Shield, AlertTriangle, CheckCircle2, Lock, QrCode, KeyRound, Camera, Upload } from 'lucide-react'

const NOTIF_PREFS_KEY = 'nexus.homeowner.notif-prefs'

type HomeownerUser = {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  avatarUrl?: string | null
}

type MfaFactor = {
  id: string
  factor_type: string
  status: string
  friendly_name?: string | null
}

function HomeownerSettingsInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser]   = useState<HomeownerUser | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({ email: '', phone: '' })
  const [notifications, setNotifications] = useState({
    bidNotifications: true, messageNotifications: true, projectUpdates: true, newsletter: false,
  })
  const [notifDirty, setNotifDirty] = useState(false)
  const [notifSaving, setNotifSaving] = useState(false)

  // Profile photo
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoFile, setPhotoFile]       = useState<File | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  // 2FA state
  const [mfaFactors, setMfaFactors]   = useState<MfaFactor[]>([])
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
        if (data.user.role !== 'homeowner') { router.push('/dashboard/contractor'); return }
        setUser(data.user)
        setFormData({ email: data.user.email, phone: data.user.phone ?? '' })
        if (data.user.avatarUrl) setPhotoPreview(data.user.avatarUrl)

        // Restore saved notification preferences.
        try {
          const saved = localStorage.getItem(NOTIF_PREFS_KEY)
          if (saved) setNotifications(prev => ({ ...prev, ...JSON.parse(saved) }))
        } catch (_err) { /* localStorage parse error — safe to ignore */ }

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

  useEffect(() => {
    if (searchParams.get('billing') === 'success') {
      setSuccess('Billing updated successfully!')
      setTimeout(() => setSuccess(''), 5000)
    }
  }, [searchParams])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFieldErrors({})
    if (!formData.email) { setError('Email is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/settings/homeowner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.details) {
          setFieldErrors(Object.fromEntries(
            Object.entries(data.details).map(([key, messages]) => [key, Array.isArray(messages) ? messages[0] : String(messages)])
          ))
        }
        setError(data.error || 'Failed to save. Please try again.')
        return
      }
      setFieldErrors({})
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      console.error(err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleNotifChange(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    setNotifDirty(true)
  }

  async function handleSaveNotifs() {
    setNotifSaving(true)
    try {
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(notifications))
      setNotifDirty(false)
      setSuccess('Notification preferences saved.')
      setTimeout(() => setSuccess(''), 4000)
    } finally {
      setNotifSaving(false)
    }
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Photo must be smaller than 10 MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }
    setError('')
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handlePhotoSave() {
    if (!photoFile || !user) return
    setPhotoUploading(true)
    setError('')
    try {
      const supabase = createClient()
      const ext  = photoFile.name.split('.').pop() || 'jpg'
      const path = `${user.id}/profile.${ext}`
      const buf  = await photoFile.arrayBuffer()
      const { data, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(path, buf, { contentType: photoFile.type, upsert: true })
      if (uploadError) throw uploadError
      if (!data) throw new Error('No upload result')

      const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(data.path)
      const publicUrl = urlData.publicUrl

      // Try both profile schemas — update whichever row actually exists.
      await supabase.from('profiles').upsert({
        id: user.id,
        user_id: user.id,
        role: 'homeowner',
        full_name: user.name,
        photo_url: publicUrl,
        avatar_url: publicUrl,
      } as Record<string, unknown>, { onConflict: 'id' })

      setPhotoFile(null)
      setUser(prev => prev ? { ...prev, avatarUrl: publicUrl } : prev)
      setSuccess('Profile photo updated.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      console.error(err)
      setError('Failed to upload photo. Please try again.')
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch('/api/settings/homeowner', { method: 'DELETE' })
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
      <DashboardNav userName={user.name} role="homeowner" avatarUrl={user.avatarUrl} onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/auth/login')
      }} />

      <main className="md:ml-[220px] p-6 animate-fade-up">
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
            <div className="flex items-center gap-5 px-6 py-6 border-b border-border bg-gradient-to-br from-primary/8 via-primary/3 to-transparent">
              <div className="relative group">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/15 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-2xl font-bold ring-4 ring-primary/15 shadow-md">
                    {initials}
                  </div>
                )}
                <label
                  htmlFor="settingsPhotoInput"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary/40 text-primary flex items-center justify-center cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
                  title="Change profile photo"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="settingsPhotoInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground text-[15px]">{user.name}</p>
                <p className="text-[12.5px] text-muted-foreground truncate">{user.email}</p>
                <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block capitalize">
                  {user.role}
                </span>
              </div>
              {photoFile && (
                <button
                  onClick={handlePhotoSave}
                  disabled={photoUploading}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[12px] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex-shrink-0"
                >
                  {photoUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {photoUploading ? 'Uploading…' : 'Save photo'}
                </button>
              )}
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
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                    fieldErrors.email ? 'border-destructive' : 'border-input'
                  }`}
                />
                {fieldErrors.email && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-foreground mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (785) 555-0100"
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                    fieldErrors.phone ? 'border-destructive' : 'border-input'
                  }`}
                />
                {fieldErrors.phone && <p className="text-[11.5px] text-destructive mt-1">{fieldErrors.phone}</p>}
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
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground text-[14px]">Notification Preferences</h2>
              </div>
              {notifDirty && (
                <span className="text-[10.5px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="space-y-2">
              {[
                { key: 'bidNotifications',     label: 'Bid Notifications',    desc: 'When contractors submit bids on your requests' },
                { key: 'messageNotifications', label: 'Messages',              desc: 'When contractors send you a message' },
                { key: 'projectUpdates',       label: 'Project Updates',       desc: 'Status changes on your ongoing requests' },
                { key: 'newsletter',           label: 'Newsletter',            desc: 'Tips and home improvement trends' },
              ].map(n => {
                const enabled = notifications[n.key as keyof typeof notifications]
                return (
                  <button
                    type="button"
                    key={n.key}
                    onClick={() => handleNotifChange(n.key as keyof typeof notifications)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      enabled
                        ? 'border-primary/30 bg-primary/5 hover:bg-primary/8'
                        : 'border-border bg-background hover:bg-secondary/30'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{n.label}</p>
                      <p className="text-[12px] text-muted-foreground">{n.desc}</p>
                    </div>
                    <div className={`relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0 ${
                      enabled ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${
                        enabled ? 'translate-x-[18px]' : ''
                      }`} />
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="pt-1">
              <button
                onClick={handleSaveNotifs}
                disabled={!notifDirty || notifSaving}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[12.5px] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {notifSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save preferences
              </button>
            </div>
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
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{f.friendly_name || 'Authenticator App'}</p>
                        <p className="text-[11px] text-muted-foreground">Added {new Date((f as any).created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisable2FA(f.id)}
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
              Deleting your account is permanent and cannot be undone. All your requests and data will be removed.
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

export default function HomeownerSettings() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <HomeownerSettingsInner />
    </Suspense>
  )
}
