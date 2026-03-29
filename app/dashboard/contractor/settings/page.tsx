'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  Save, Loader2, ArrowLeft, User, Bell, AlertTriangle,
  CreditCard, Check, Building2, Wrench, Lock, QrCode, KeyRound, CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal',  icon: '🌳' },
  { value: 'concrete-work', label: 'Concrete Work', icon: '🏗️' },
  { value: 'roofing',       label: 'Roofing',       icon: '🏠' },
  { value: 'hvac',          label: 'HVAC',          icon: '❄️' },
  { value: 'fencing',       label: 'Fencing',       icon: '🏡' },
  { value: 'electrical',    label: 'Electrical',    icon: '⚡' },
  { value: 'plumbing',      label: 'Plumbing',      icon: '🔧' },
  { value: 'excavation',    label: 'Excavation',    icon: '🚜' },
]

type Tab = 'profile' | 'notifications' | 'security' | 'danger'
type SettingsUser = { name: string }
type MfaFactor = {
  id: string
  factor_type: string
  status: string
  friendly_name?: string | null
}

function ContractorSettingsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<SettingsUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tab, setTab] = useState<Tab>('profile')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    companyName: '',
    bio: '',
    licenseNumber: '',
    yearsInBusiness: '',
    serviceCategories: [] as string[],
  })
  const [notifications, setNotifications] = useState({
    projectNotifications: true,
    messageNotifications: true,
    weeklyDigest: true,
  })

  // 2FA state
  const [mfaFactors, setMfaFactors]   = useState<MfaFactor[]>([])
  const [enrollData, setEnrollData]   = useState<{ qr: string; secret: string; factorId: string } | null>(null)
  const [verifyCode, setVerifyCode]   = useState('')
  const [mfaLoading, setMfaLoading]   = useState(false)
  const [mfaError, setMfaError]       = useState('')
  const [mfaSuccess, setMfaSuccess]   = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const data = await res.json()
        if (data.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
        setUser(data.user)
        const p = data.contractorProfile
        if (p) {
          setFormData({
            companyName: p.companyName ?? '',
            bio: p.bio ?? '',
            licenseNumber: p.licenseNumber ?? '',
            yearsInBusiness: p.yearsInBusiness != null ? String(p.yearsInBusiness) : '',
            serviceCategories: p.serviceCategories ?? [],
          })
        }
        if (searchParams.get('billing') === 'success') {
          toast.success('Billing updated successfully!')
        }
        // Load MFA factors
        const supabase = createClient()
        const { data: mfaData } = await supabase.auth.mfa.listFactors()
        setMfaFactors(mfaData?.all ?? [])
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router, searchParams])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  function toggleCategory(v: string) {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(v)
        ? prev.serviceCategories.filter(c => c !== v)
        : [...prev.serviceCategories, v],
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    if (!formData.companyName.trim() || !formData.bio.trim()) {
      toast.error('Please fill in your company name and bio.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/settings/contractor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const d = await res.json()
        if (d.details) {
          setFieldErrors(Object.fromEntries(
            Object.entries(d.details).map(([key, messages]) => [key, Array.isArray(messages) ? messages[0] : String(messages)])
          ))
        }
        toast.error(d.error || 'Failed to save settings')
        return
      }
      setFieldErrors({})
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const res = await fetch('/api/settings/contractor', { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || 'Failed to delete account')
        setShowDeleteConfirm(false)
        return
      }
      router.push('/auth/login')
    } catch {
      toast.error('Failed to delete account. Please try again.')
      setShowDeleteConfirm(false)
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
      setEnrollData({ qr: data.totp.qr_code, secret: data.totp.secret, factorId: data.id })
    } catch {
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
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollData.factorId, code: verifyCode.trim() })
      if (error) { setMfaError(error.message); return }
      const { data: mfaData } = await supabase.auth.mfa.listFactors()
      setMfaFactors(mfaData?.all ?? [])
      setEnrollData(null)
      setVerifyCode('')
      setMfaSuccess('Two-factor authentication enabled successfully!')
      setTimeout(() => setMfaSuccess(''), 5000)
    } catch {
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
    } catch {
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

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile',       label: 'Profile',       icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security',      label: 'Security',      icon: Lock },
    { id: 'danger',        label: 'Danger Zone',   icon: AlertTriangle },
  ]

  const totpFactors = mfaFactors.filter(f => f.factor_type === 'totp' && f.status === 'verified')
  const has2FA = totpFactors.length > 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="md:ml-[220px] p-5 md:p-8 max-w-4xl space-y-7">

        {/* Header */}
        <div>
          <Link href="/dashboard/contractor" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your contractor profile and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar nav */}
          <nav className="flex md:flex-col gap-1 md:w-44 flex-shrink-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  tab === id
                    ? id === 'danger'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}

            <div className="hidden md:block border-t border-border mt-3 pt-3">
              <Link
                href="/dashboard/contractor/billing"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                Billing
              </Link>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Business info */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h2 className="font-bold text-foreground text-[15px]">Business Information</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-foreground">Company Name *</label>
                      <input
                        type="text"
                        placeholder="Your company name"
                        value={formData.companyName}
                        onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                        required
                        className={`w-full h-10 px-3 rounded-xl border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          fieldErrors.companyName ? 'border-destructive' : 'border-input'
                        }`}
                      />
                      {fieldErrors.companyName && <p className="text-[11px] text-destructive">{fieldErrors.companyName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-foreground">License Number</label>
                      <input
                        type="text"
                        placeholder="e.g., LICENSE123"
                        value={formData.licenseNumber}
                        onChange={e => setFormData(p => ({ ...p, licenseNumber: e.target.value }))}
                        className={`w-full h-10 px-3 rounded-xl border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          fieldErrors.licenseNumber ? 'border-destructive' : 'border-input'
                        }`}
                      />
                      {fieldErrors.licenseNumber && <p className="text-[11px] text-destructive">{fieldErrors.licenseNumber}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-foreground">Years in Business</label>
                      <input
                        type="number"
                        placeholder="5"
                        min="0"
                        max="100"
                        value={formData.yearsInBusiness}
                        onChange={e => setFormData(p => ({ ...p, yearsInBusiness: e.target.value }))}
                        className={`w-full h-10 px-3 rounded-xl border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          fieldErrors.yearsInBusiness ? 'border-destructive' : 'border-input'
                        }`}
                      />
                      {fieldErrors.yearsInBusiness && <p className="text-[11px] text-destructive">{fieldErrors.yearsInBusiness}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-foreground">Bio / Description *</label>
                    <textarea
                      placeholder="Tell homeowners about your expertise and experience..."
                      value={formData.bio}
                      onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                      rows={4}
                      required
                      className={`w-full px-3 py-2.5 rounded-xl border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
                        fieldErrors.bio ? 'border-destructive' : 'border-input'
                      }`}
                    />
                    {fieldErrors.bio && <p className="text-[11px] text-destructive">{fieldErrors.bio}</p>}
                  </div>
                </div>

                {/* Service categories */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 mb-1">
                    <Wrench className="w-4 h-4 text-primary" />
                    <h2 className="font-bold text-foreground text-[15px]">Service Categories</h2>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground">
                    Select any specialties you want highlighted. Open requests are no longer capped by these categories, so your pipeline still includes custom community requests.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SERVICE_CATEGORIES.map(cat => {
                      const selected = formData.serviceCategories.includes(cat.value)
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => toggleCategory(cat.value)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                            selected
                              ? 'border-primary/50 bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-[11px] font-medium leading-tight">{cat.label}</span>
                          {selected && <Check className="w-3 h-3" />}
                        </button>
                      )
                    })}
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-[12px] font-semibold text-foreground">Access & pipeline coverage</p>
                    <p className="text-[11.5px] text-muted-foreground mt-1.5">
                      Categories now improve matching, analytics, and notifications, but they do not block access. You can still review scheduling, documentation, billing, and specialty requests across the shared service pipeline.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link href="/dashboard/contractor" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5">
                    Cancel
                  </Link>
                </div>
              </form>
            )}

            {tab === 'notifications' && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2.5 mb-4">
                  <Bell className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-foreground text-[15px]">Notification Preferences</h2>
                </div>

                {[
                  {
                    key: 'projectNotifications' as const,
                    title: 'New Project Alerts',
                    sub: 'Get notified when new projects matching your categories are posted.',
                  },
                  {
                    key: 'messageNotifications' as const,
                    title: 'Message Notifications',
                    sub: 'Get notified when homeowners send you messages.',
                  },
                  {
                    key: 'weeklyDigest' as const,
                    title: 'Weekly Digest',
                    sub: 'Receive a weekly summary of your activity and new opportunities.',
                  },
                ].map(({ key, title, sub }) => (
                  <label
                    key={key}
                    className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-[13px]">{title}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{sub}</p>
                    </div>
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                        className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${
                          notifications[key] ? 'bg-primary' : 'bg-muted'
                        }`}
                        role="switch"
                        aria-checked={notifications[key]}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-0.5 mx-0.5 ${
                          notifications[key] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  </label>
                ))}

                <div className="pt-2">
                  <button
                    onClick={() => toast.success('Notification preferences saved!')}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground text-[15px]">Two-Factor Authentication (2FA)</h2>
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
                            <p className="text-[11px] text-muted-foreground">Added {new Date(f.created_at).toLocaleDateString()}</p>
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
            )}

            {tab === 'danger' && (
              <div className="bg-card border border-destructive/30 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h2 className="font-bold text-destructive text-[15px]">Danger Zone</h2>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  These actions are permanent and cannot be undone. Please proceed with caution.
                </p>

                <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-5">
                  <h3 className="font-semibold text-foreground text-[13.5px] mb-1">Delete Account</h3>
                  <p className="text-[12.5px] text-muted-foreground mb-4">
                    Permanently delete your contractor account and all associated data. Active projects will be cancelled.
                  </p>

                  {showDeleteConfirm ? (
                    <div className="space-y-3">
                      <p className="text-[12.5px] font-semibold text-destructive">
                        Are you sure? This cannot be undone.
                      </p>
                      <div className="flex gap-2.5">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                          className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground font-semibold text-[12.5px] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                          {deleting ? 'Deleting...' : 'Yes, Delete Account'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 border border-border rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-[12.5px] font-semibold text-destructive border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors px-4 py-2.5 rounded-xl"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ContractorSettings() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <ContractorSettingsInner />
    </Suspense>
  )
}
