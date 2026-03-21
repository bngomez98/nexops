'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  Save, Loader2, ArrowLeft, User, Bell, AlertTriangle,
  CreditCard, Check, Building2, Wrench, Shield,
} from 'lucide-react'
import { toast } from 'sonner'

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

type Tab = 'profile' | 'notifications' | 'danger'

export default function ContractorSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tab, setTab] = useState<Tab>('profile')
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
    if (!formData.companyName.trim() || !formData.bio.trim() || formData.serviceCategories.length === 0) {
      toast.error('Please fill in company name, bio, and at least one service category.')
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
        toast.error(d.error || 'Failed to save settings')
        return
      }
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
    { id: 'danger',        label: 'Danger Zone',   icon: AlertTriangle },
  ]

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
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-foreground">License Number</label>
                      <input
                        type="text"
                        placeholder="e.g., LICENSE123"
                        value={formData.licenseNumber}
                        onChange={e => setFormData(p => ({ ...p, licenseNumber: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
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
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
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
                      className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>

                {/* Service categories */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 mb-1">
                    <Wrench className="w-4 h-4 text-primary" />
                    <h2 className="font-bold text-foreground text-[15px]">Service Categories</h2>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground">
                    Select all trades you specialize in. You'll receive project notifications matching these categories.
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
