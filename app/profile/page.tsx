import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/sidebar'
import ProfileForm from '@/components/profile-form'
import type { Profile } from '@/lib/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fb]">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-[#0f1623] mb-1">My Profile</h1>
          <p className="text-sm text-[#64748b] mb-8">Update your personal information and upload a profile photo.</p>
          <ProfileForm profile={profile as Profile} userEmail={user.email ?? ''} />
        </div>
      </main>
    </div>
  )
}
