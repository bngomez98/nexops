'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, CheckCircle, AlertCircle, Building2, HardHat, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getRoleLabel } from '@/lib/utils'
import type { Profile } from '@/lib/types'

export default function ProfileForm({ profile, userEmail }: { profile: Profile | null; userEmail: string }) {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const role = profile?.role ?? 'homeowner'
  const RoleIcon = role === 'property_manager' ? Building2 : role === 'contractor' ? HardHat : Home

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-avatar', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? 'Upload failed')

      setAvatarUrl(json.url)
      setMessage({ type: 'success', text: 'Profile photo updated.' })
      router.refresh()
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const updates: Partial<Profile> = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string || null,
      address: formData.get('address') as string || null,
      company_name: formData.get('company_name') as string || null,
      license_number: formData.get('license_number') as string || null,
      trade_specialty: formData.get('trade_specialty') as string || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile!.id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile saved successfully.' })
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f1623] mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#1e3a8a] flex items-center justify-center overflow-hidden border-4 border-[#e2e8f0]">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#93c5fd]">
                  {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#3b82f6] hover:bg-[#2563eb] rounded-full flex items-center justify-center border-2 border-white transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-white" />
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0f1623]">{profile?.full_name ?? 'Your Name'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <RoleIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span className="text-xs text-[#64748b]">{getRoleLabel(role)}</span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-2">JPG, PNG or WebP · Max 5MB</p>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-[#0f1623]">Personal Information</h2>

        {message && (
          <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f1623]">Email address</label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#94a3b8] bg-[#f8f9fb] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="full_name" className="text-sm font-medium text-[#0f1623]">Full name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={profile?.full_name ?? ''}
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-[#0f1623]">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ''}
              placeholder="(785) 000-0000"
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-sm font-medium text-[#0f1623]">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={profile?.address ?? ''}
              placeholder="123 Main St, Topeka, KS"
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
            />
          </div>
        </div>

        {/* Role-specific fields */}
        {role === 'property_manager' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company_name" className="text-sm font-medium text-[#0f1623]">Company Name</label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              defaultValue={profile?.company_name ?? ''}
              placeholder="Acme Property Management"
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
            />
          </div>
        )}

        {role === 'contractor' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="trade_specialty" className="text-sm font-medium text-[#0f1623]">Trade / Specialty</label>
                <input
                  id="trade_specialty"
                  name="trade_specialty"
                  type="text"
                  defaultValue={profile?.trade_specialty ?? ''}
                  placeholder="Plumbing, HVAC, Electrical..."
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="license_number" className="text-sm font-medium text-[#0f1623]">License Number</label>
                <input
                  id="license_number"
                  name="license_number"
                  type="text"
                  defaultValue={profile?.license_number ?? ''}
                  placeholder="KS-12345"
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company_name" className="text-sm font-medium text-[#0f1623]">Company Name</label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                defaultValue={profile?.company_name ?? ''}
                placeholder="Smith Plumbing LLC"
                className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-[#1e3a8a] hover:bg-[#1e40af] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
