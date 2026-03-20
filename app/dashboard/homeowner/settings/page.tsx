'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormError } from '@/components/form-error'
import { DashboardNav } from '@/components/dashboard-nav'
import { Save } from 'lucide-react'

export default function HomeownerSettings() {
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
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [notifications, setNotifications] = useState({
    bidNotifications: true,
    messageNotifications: true,
    projectUpdates: true,
    newsletter: true,
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
        if (userData.user.role !== 'homeowner') {
          router.push('/dashboard/contractor')
          return
        }
        setUser(userData.user)
        setFormData({
          email: userData.user.email,
          phone: userData.user.phone,
          address: userData.user.address,
          city: userData.user.city,
          state: userData.user.state,
          zipCode: userData.user.zipCode,
        })
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleNotificationChange(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.email || !formData.address) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/settings/homeowner', {
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
      const response = await fetch('/api/settings/homeowner', { method: 'DELETE' })
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
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your profile and preferences</p>
        </div>
        <div className="max-w-2xl">
          {error && <FormError message={error} className="mb-6" />}
          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Contact Information */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Contact Information</h2>

              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Address</h2>

              <div className="space-y-4">
                {/* Street Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Topeka"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="KS"
                      value={formData.state}
                      onChange={handleInputChange}
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Zip Code */}
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="66603"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={notifications.bidNotifications}
                    onChange={() => handleNotificationChange('bidNotifications')}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Bid Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when contractors submit bids on your projects</p>
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
                    <p className="text-sm text-muted-foreground">Get notified when contractors message you</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={notifications.projectUpdates}
                    onChange={() => handleNotificationChange('projectUpdates')}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Project Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified about updates on your ongoing projects</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={notifications.newsletter}
                    onChange={() => handleNotificationChange('newsletter')}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Receive tips and updates about home improvement trends</p>
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
