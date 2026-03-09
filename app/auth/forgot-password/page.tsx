"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"

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
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between border-r border-border bg-card px-12 py-16 flex-shrink-0">
        <Link href="/">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={150}
            height={50}
            style={{ height: "28px", width: "auto" }}
            priority
          />
        </Link>

        <div className="space-y-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-4">
              Nexus Operations
            </p>
            <h2 className="text-2xl font-bold leading-snug tracking-tight">
              Property service management for Topeka and Shawnee County.
            </h2>
          </div>
          <div className="space-y-5 text-[13.5px] text-muted-foreground leading-[1.7]">
            <p>
              One verified contractor per request. No competing bids. No cold calls.
              Documentation maintained through job completion.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Topeka, KS · (785) 428-0244 · admin@nexusoperations.org
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 lg:hidden">
          <Link href="/">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={140}
              height={47}
              style={{ height: "32px", width: "auto" }}
              priority
            />
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-[22px] font-bold tracking-tight">Check your email</h1>
              <p className="mt-2 text-[13.5px] text-muted-foreground">
                A password reset link has been sent to <strong>{email}</strong>. Check your inbox and follow the link.
              </p>
              <p className="mt-3 text-[12px] text-muted-foreground">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
                .
              </p>
              <div className="mt-6 border-t border-border pt-5">
                <Link href="/auth/login" className="text-[13px] text-primary hover:underline font-medium">
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-[22px] font-bold tracking-tight">Reset your password</h1>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                  Enter your email address and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-2.5 rounded border border-destructive/40 bg-destructive/8 p-3 text-[13px] text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[13px]">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-10 text-[13px]"
                  />
                </div>

                <Button type="submit" className="w-full h-10 text-[13px] font-semibold" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <div className="mt-5 border-t border-border pt-5 text-[13px] text-muted-foreground text-center">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
