"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message
      )
      setLoading(false)
      return
    }

    const role = data.user?.user_metadata?.role
    window.location.href = role === "contractor" ? "/dashboard/contractor" : "/dashboard"
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* Left panel — brand */}
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
              Every project documented through completion.
            </p>
            <p>
              Contractors access requests through a flat monthly membership — no per-project fees, no referral cuts.
            </p>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 gap-0 divide-y divide-border [&>*]:py-4 [&>*:nth-child(odd)]:pr-6 [&>*:nth-child(even)]:pl-6 [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:border-border">
            {[
              { n: "8",    label: "Trade categories" },
              { n: "1",    label: "Contractor per request" },
              { n: "$0",   label: "Platform fee to owners" },
              { n: "100%", label: "Manually reviewed" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="text-lg font-bold text-foreground">{n}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Topeka, KS · (785) 428-0244 · admin@nexusoperations.org
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
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
          <div className="mb-8">
            <h1 className="text-[22px] font-bold tracking-tight">Sign in to your account</h1>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">
              Nexus Operations · Topeka, Kansas
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px]">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[12px] text-muted-foreground hover:text-primary transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 text-[13px] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-[13px] font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-5 text-[13px] text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
