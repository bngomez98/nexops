"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient()

      // Exchange the auth code for a session (handles OAuth + magic link)
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        router.push("/auth/login?error=auth_callback_failed")
        return
      }

      const role = data.session.user?.user_metadata?.role as string | undefined
      const next = params.get("next")

      if (next) {
        router.push(next)
        return
      }

      // Route to appropriate onboarding or dashboard based on role
      if (role === "contractor") {
        router.push("/onboarding/contractor")
      } else if (role === "property-manager") {
        router.push("/onboarding/property-manager")
      } else {
        router.push("/onboarding/homeowner")
      }
    }

    handleCallback()
  }, [router, params])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
        <p className="text-[13px] text-muted-foreground">Completing sign in…</p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <CallbackInner />
    </Suspense>
  )
}
