"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { AuthShell } from "@/components/auth-shell"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  return (
    <AuthShell
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={
        sent
          ? "We sent a secure reset link to the email address you entered."
          : "Enter your email and we will send instructions to create a new password."
      }
    >
      {sent ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            A reset link was sent to <strong className="text-foreground">{email}</strong>. If you don&apos;t see it, check spam and promotions folders.
          </p>
          <button onClick={() => setSent(false)} className="mt-4 text-sm font-medium text-primary hover:underline">
            Send another link
          </button>
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
            <Label htmlFor="email" className="text-[13px]">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="h-10 text-[13px]" />
          </div>

          <Button type="submit" className="h-10 w-full text-[13px] font-semibold" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending link...</> : "Send Reset Link"}
          </Button>
        </form>
      )}

      <div className="mt-5 border-t border-border pt-5 text-center text-[13px] text-muted-foreground">
        Remember your password? <Link href="/auth/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </div>
    </AuthShell>
  )
}
