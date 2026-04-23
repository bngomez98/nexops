'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, User, Upload, CheckCircle2, AlertCircle, Save } from 'lucide-react'

export default function HomeownerProfilePage() {
  const router = useRouter()
  const [user, setUser]     = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)

  const [form, setForm] = useState({ fullName: '', phone: '', photoFile: null as File | null })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'homeowner' })

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', u.id).single()
      setForm({ fullName: profile?.full_name ?? u.user_metadata?.full_name ?? '', phone: profile?.phone ?? '', photoFile: null })
      if (profile?.photo_url) {
        setExistingPhotoUrl(profile.photo_url)
        setPhotoPreview(profile.photo_url)
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setError(null)
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
        role: 'homeowner',
        full_name: form.fullName,
        phone: form.phone || null,
        photo_url: photoUrl ?? existingPhotoUrl ?? null,
      }, { onConflict: 'id' })

      if (photoUrl) setExistingPhotoUrl(photoUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to save profile.')
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
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Manage your account information.</p>
        </div>

        {error && <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-5"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}
        {saved && <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[13px] text-emerald-700 mb-5"><CheckCircle2 className="h-4 w-4 flex-shrink-0" /><span>Profile saved.</span></div>}

        <div className="space-y-5">
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
              <input id="photoInput" type="file" accept=".jpg,.jpeg,.png" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) { setForm(p => ({ ...p, photoFile: file })); setPhotoPreview(URL.createObjectURL(file)) }
                }}
              />
              <label htmlFor="photoInput" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-[13px] font-medium cursor-pointer hover:bg-muted">
                <Upload className="w-3.5 h-3.5" /> Change photo
              </label>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-semibold">Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-[13px]">Full name</Label>
                <Input id="fullName" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[13px]">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-10 text-[13px]" />
              </div>
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
