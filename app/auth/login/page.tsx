"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] flex-col justify-between border-r border-border bg-card px-12 py-10 flex-shrink-0">
        <Link href="/">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={150} height={50}
            style={{ height: "32px", width: "auto" }} />
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="text-[22px] font-bold leading-snug tracking-tight mb-3">
              Property service management<br />for Topeka, Kansas.
            </h2>
            <p className="text-[13px] text-muted-foreground leading-[1.85]">
              Your Nexus account gives you a complete, permanent record of every service request, consultation, estimate, and completed project at your property.
            </p>
          </div>

          <div className="space-y-5 text-[12.5px]">
            {[
              ["Coordinated assignments", "One verified contractor per request — no competing bids, no cold calls."],
              ["Full documentation",      "Photos, scope, estimates, and completion records stored per property."],
              ["Maintenance advisory",    "Evidence-based recommendations from your property's actual service history."],
              ["Portfolio reporting",     "Aggregate maintenance spend and status across all managed addresses."],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Nexus Operations, LLC — Topeka, KS 66606<br />
          (785) 428-0244 · admin@nexusoperations.org
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 bg-background">
        <div className="mb-8 lg:hidden">
          <Link href="/">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={150} height={50}
              style={{ height: "32px", width: "auto" }} />
          </Link>
        </div>

        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h1 className="text-[22px] font-bold tracking-tight">Sign in</h1>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">
              Access your Nexus Operations account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12.5px]">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email" className="text-sm h-9" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[12.5px]">Password</Label>
                <Link href="/auth/reset-password"
                  className="text-[11.5px] text-muted-foreground hover:text-primary transition">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="Your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password" className="text-sm h-9" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="h-3.5 w-3.5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <p className="text-[12.5px] text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
