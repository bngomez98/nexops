"use client"

import { useState, useEffect, Suspense } from "react"
import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { AuthShell } from "@/components/auth-shell"

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const { data: listener } = supabase.auth.onAuthStateChange(() => undefined)
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/dashboard"), 2500)
  }

  return (
    <AuthShell
      title={success ? "Password updated" : "Set a new password"}
      subtitle={
        success
          ? "Your credentials were updated successfully. Redirecting to your dashboard now."
          : "Use a strong password with at least 8 characters and avoid reusing old credentials."
      }
    >
      {success ? (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Your password has been changed successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded border border-destructive/40 bg-destructive/8 p-3 text-[13px] text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px]">New password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" className="h-10 text-[13px]" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-[13px]">Confirm new password</Label>
            <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="h-10 text-[13px]" />
          </div>

          <Button type="submit" className="h-10 w-full text-[13px] font-semibold" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating password...</> : "Update Password"}
          </Button>
        </form>
      )}

      <div className="mt-5 border-t border-border pt-5 text-center text-[13px] text-muted-foreground">
        <Link href="/auth/login" className="font-medium text-primary hover:underline">Back to sign in</Link>
      </div>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
