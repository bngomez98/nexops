'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2, User, Upload, CheckCircle2, AlertCircle, Save,
} from 'lucide-react'

const TRADE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal',  icon: '🌳' },
  { value: 'concrete-work', label: 'Concrete Work',  icon: '🏗️' },
  { value: 'roofing',       label: 'Roofing',        icon: '🏠' },
  { value: 'hvac',          label: 'HVAC',           icon: '❄️' },
  { value: 'fencing',       label: 'Fencing',        icon: '🏡' },
  { value: 'electrical',    label: 'Electrical',     icon: '⚡' },
  { value: 'plumbing',      label: 'Plumbing',       icon: '🔧' },
  { value: 'excavation',    label: 'Excavation',     icon: '🚜' },
]

export default function ContractorProfilePage() {
  const router = useRouter()
  const [user, setUser]     = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    bio: '',
    serviceRadius: '25',
    tradeCategories: [] as string[],
    photoFile: null as File | null,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }

      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      // Load contractor profile
      const { data: cp } = await supabase
        .from('contractor_profiles')
        .select('*')
        .eq('user_id', u.id)
        .single()

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single()

      setForm({
        fullName: profile?.full_name ?? u.user_metadata?.full_name ?? '',
        phone: profile?.phone ?? u.user_metadata?.phone ?? '',
        bio: cp?.bio ?? '',
        serviceRadius: String(cp?.service_radius_miles ?? 25),
        tradeCategories: cp?.trade_categories ?? [],
        photoFile: null,
      })
      if (profile?.photo_url) {
        setExistingPhotoUrl(profile.photo_url)
        setPhotoPreview(profile.photo_url)
      }
      setLoading(false)
    }
    load()
  }, [router])

  function toggleCategory(cat: string) {
    setForm(prev => ({
      ...prev,
      tradeCategories: prev.tradeCategories.includes(cat)
        ? prev.tradeCategories.filter(c => c !== cat)
        : [...prev.tradeCategories, cat],
    }))
  }

  async function handleSave() {
    if (!user) return
    setError(null)
    setSaving(true)
    try {
      const supabase = createClient()
      let photoUrl: string | undefined

      if (form.photoFile) {
        const ext  = form.photoFile.name.split('.').pop()
        const path = `${user.id}/profile.${ext}`
        const buf  = await form.photoFile.arrayBuffer()
        const { data } = await supabase.storage.from('profile-photos').upload(path, buf, { contentType: form.photoFile.type, upsert: true })
        if (data) {
          const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(data.path)
          photoUrl = urlData.publicUrl
        }
      }

      await supabase.from('profiles').upsert({
        id: user.id,
        role: 'contractor',
        full_name: form.fullName,
        phone: form.phone || null,
        photo_url: photoUrl ?? existingPhotoUrl ?? null,
      }, { onConflict: 'id' })

      await supabase.from('contractor_profiles').upsert({
        user_id: user.id,
        bio: form.bio || null,
        service_radius_miles: parseInt(form.serviceRadius) || 25,
        trade_categories: form.tradeCategories,
      }, { onConflict: 'user_id' })

      if (photoUrl) setExistingPhotoUrl(photoUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Update your public contractor profile.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[13px] text-emerald-700 mb-6">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" /><span>Profile saved successfully.</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Photo */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-semibold">Profile Photo</p>
            <div className="flex items-center gap-5">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <input id="photoInput" type="file" accept=".jpg,.jpeg,.png" className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) { setForm(prev => ({ ...prev, photoFile: file })); setPhotoPreview(URL.createObjectURL(file)) }
                  }}
                />
                <label htmlFor="photoInput" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Change photo
                </label>
                <p className="text-[11px] text-muted-foreground mt-1.5">JPG or PNG · max 10MB</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-semibold">Basic Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-[13px]">Full name</Label>
                <Input id="fullName" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[13px]">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="bio" className="text-[13px]">Bio</Label>
                <textarea id="bio" rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-[13px] placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
            </div>
          </div>

          {/* Trade Categories */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-semibold">Trade Categories</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRADE_CATEGORIES.map(cat => {
                const sel = form.tradeCategories.includes(cat.value)
                return (
                  <button key={cat.value} type="button" onClick={() => toggleCategory(cat.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${sel ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[11px] font-semibold leading-tight">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Service Radius */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-semibold">Service Radius</p>
            <div className="space-y-2">
              <p className="text-[13px] text-muted-foreground">Current: <span className="font-bold text-foreground">{form.serviceRadius} miles</span></p>
              <input type="range" min="5" max="100" step="5" value={form.serviceRadius} onChange={e => setForm(p => ({ ...p, serviceRadius: e.target.value }))} className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between text-[11px] text-muted-foreground"><span>5 mi</span><span>100 mi</span></div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="h-10 px-6 text-[13.5px] font-semibold rounded-lg">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Profile</>}
          </Button>
        </div>
      </main>
    </div>
  )
}
