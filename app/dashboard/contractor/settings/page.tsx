'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormError } from '@/components/form-error'
import { DashboardNav } from '@/components/dashboard-nav'
import { Save } from 'lucide-react'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal', label: 'Tree Removal' },
  { value: 'concrete-work', label: 'Concrete Work' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'fencing', label: 'Fencing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'excavation', label: 'Excavation' },
]

export default function ContractorSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        if (userData.user.role !== 'contractor') {
          router.push('/dashboard/homeowner')
          return
        }
        setUser(userData.user)
        const profile = userData.contractorProfile
        if (profile) {
          setFormData({
            companyName: profile.companyName ?? '',
            bio: profile.bio ?? '',
            licenseNumber: profile.licenseNumber ?? '',
            yearsInBusiness: profile.yearsInBusiness != null ? String(profile.yearsInBusiness) : '',
            serviceCategories: profile.serviceCategories ?? [],
          })
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Handle billing success query param
  useEffect(() => {
    if (searchParams.get('billing') === 'success') {
      setSuccess('Billing updated successfully!')
      setTimeout(() => setSuccess(''), 5000)
    }
  }, [searchParams])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function toggleServiceCategory(category: string) {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...prev.serviceCategories, category]
    }))
  }

  function handleNotificationChange(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.companyName || !formData.bio || formData.serviceCategories.length === 0) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/settings/contractor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save settings. Please try again.')
        return
      }

      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setError('')
    try {
      const response = await fetch('/api/settings/contractor', { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to delete account. Please try again.')
        setShowDeleteConfirm(false)
        return
      }
      router.push('/login')
    } catch (err) {
      setError('Failed to delete account. Please try again.')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your contractor profile and preferences</p>
        </div>
        <div className="max-w-2xl">
          {error && <FormError message={error} className="mb-6" />}
          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Profile Section */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>

              <div className="space-y-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* License Number */}
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="e.g., LICENSE123"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Years in Business */}
                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business</Label>
                  <Input
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    type="number"
                    placeholder="5"
                    value={formData.yearsInBusiness}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/Description *</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell customers about your expertise and experience..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Service Categories Section */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Service Categories *</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select all service categories you specialize in
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {SERVICE_CATEGORIES.map(category => (
                  <label key={category.value} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                    <input
                      type="checkbox"
                      checked={formData.serviceCategories.includes(category.value)}
                      onChange={() => toggleServiceCategory(category.value)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-foreground">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={notifications.projectNotifications}
                    onChange={() => handleNotificationChange('projectNotifications')}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Project Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when new projects in your categories are available</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={notifications.messageNotifications}
                    onChange={() => handleNotificationChange('messageNotifications')}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Message Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when homeowners message you</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={() => handleNotificationChange('weeklyDigest')}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your activity and opportunities</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">
                These actions cannot be undone. Please be careful.
              </p>
              {showDeleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-red-700">
                    Are you sure you want to delete your account? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={deleting}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
