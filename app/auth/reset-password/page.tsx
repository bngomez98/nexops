"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "@/lib/router"
import Link from "@/components/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"

function ResetPasswordInner() {
  const router      = useRouter()
  const params      = useSearchParams()
  const [password, setPassword]         = useState("")
  const [confirmPassword, setConfirm]   = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [sessionValid, setSessionValid] = useState(false)

  useEffect(() => {
    // Supabase sends the token as a hash fragment; the SSR library handles it
    // but we verify session here before allowing the form
    async function checkSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setSessionValid(!!session)
      setVerifying(false)
    }
    checkSession()
  }, [params])

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
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/auth/login"), 2500)
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!sessionValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Invalid or expired link</h1>
          <p className="text-muted-foreground text-[14px] leading-relaxed mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-primary text-primary-foreground text-[13.5px] font-semibold hover:opacity-90 transition-opacity"
          >
            Request New Link
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Password updated</h1>
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            Your password has been successfully updated. Redirecting to sign in…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={140}
              height={47}
              style={{ height: "28px", width: "auto" }}
              priority
            />
          </Link>
          <h1 className="text-[24px] font-bold tracking-tight">Set new password</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] font-medium">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="h-10 text-[13.5px] rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-[13px] font-medium">Confirm new password</Label>
            <Input
              id="confirm"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="h-10 text-[13.5px] rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 text-[13.5px] font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <ResetPasswordInner />
    </Suspense>
  )
}
