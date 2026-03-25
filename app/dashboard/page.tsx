'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

/**
 * Dashboard root — redirects each user to their role-specific dashboard.
 * This ensures no user ever lands on a generic placeholder page.
 */
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    async function redirect() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role ?? user.user_metadata?.role ?? 'homeowner'

      switch (role) {
        case 'contractor':
          router.replace('/dashboard/contractor')
          break
        case 'property_manager':
          router.replace('/dashboard/property-manager')
          break
        case 'admin':
          router.replace('/dashboard/admin')
          break
        default:
          router.replace('/dashboard/homeowner')
      }
    }
    redirect()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
    </div>
  )
}
