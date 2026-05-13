"use client"
import { useState } from "react"
import Link from "@/components/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, ArrowRight, Building2, Shield, Zap, BarChart3 } from "lucide-react"
import { CONTACT_INFO } from "@/lib/contact-info"

export default function LoginPage() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    const role = data.user?.user_metadata?.role
    if (role === "contractor") {
      window.location.href = "/dashboard/contractor"
    } else if (role === "property-manager") {
      window.location.href = "/dashboard/property-manager"
    } else if (role === "admin") {
      window.location.href = "/dashboard/admin"
    } else {
      window.location.href = "/dashboard/homeowner"
    }
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel: dark branded ── */}
      <div
        className="hidden lg:flex lg:w-[460px] xl:w-[520px] flex-col justify-between relative overflow-hidden flex-shrink-0"
        style={{ background: "linear-gradient(145deg, #060d09 0%, #0c1a12 45%, #122b1c 100%)" }}
      >
        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, rgba(34,197,94,0.18) 1.5px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow blobs */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
        />

        {/* Top: logo */}
        <div className="relative px-10 pt-11">
          <Link href="/" className="inline-flex items-center gap-3 mb-14">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <svg width="19" height="19" viewBox="0 0 120 120" fill="none">
                <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="#22c55e" strokeWidth="6" strokeLinecap="round"/>
                <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="#22c55e" strokeWidth="6" strokeLinecap="round"/>
                <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
                <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
                <line x1="60" y1="47" x2="60" y2="73" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
                <line x1="47" y1="60" x2="73" y2="60" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-[14px] tracking-tight leading-none">NEXUS</div>
              <div className="text-emerald-400 text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5">OPERATIONS</div>
            </div>
          </Link>

          {/* Headline */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">Topeka &amp; Shawnee County</span>
          </div>

          <h2 className="text-white text-[28px] sm:text-[30px] font-bold leading-[1.2] tracking-tight mb-5 text-balance">
            Property service management, end to end.
          </h2>
          <p className="text-white/50 text-[13.5px] leading-relaxed mb-10">
            Dispatch requests, track jobs, manage contractors, and document every project — all from one workspace.
          </p>

          {/* Feature rows */}
          <div className="space-y-3.5 mb-10">
            {[
              { icon: Shield,    text: "Verified contractors only — manually reviewed before activation." },
              { icon: Zap,       text: "Same-day contractor assignment on every request." },
              { icon: BarChart3, text: "Permanent project records you keep forever." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-white/65 text-[13px] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: stats + contact */}
        <div className="relative px-10 pb-11">
          <div className="border-t border-white/10 pt-8 grid grid-cols-2 gap-3 mb-7">
            {[
              { n: "8",    label: "Trade categories" },
              { n: "1",    label: "Contractor per request" },
              { n: "$0",   label: "Platform fee" },
              { n: "100%", label: "Manually reviewed" },
            ].map(({ n, label }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-white text-[20px] font-bold tracking-tight">{n}</p>
                <p className="text-white/40 text-[11px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/25 text-[11px]">
            {CONTACT_INFO.cityStateZip} · {CONTACT_INFO.phoneDisplay} · {CONTACT_INFO.email}
          </p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 bg-background">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-10 lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 120 120" fill="none">
                <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-primary"/>
                <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-primary"/>
                <line x1="60" y1="47" x2="60" y2="73" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-primary"/>
                <line x1="47" y1="60" x2="73" y2="60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-primary"/>
              </svg>
            </div>
            <span className="font-bold text-foreground text-[15px]">Nexus Operations</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Sign in to access your workspace.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl px-7 py-7 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-[13px] text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-10 text-[13.5px] rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[13px] font-medium">Password</Label>
                  <Link href="/auth/forgot-password" className="text-[12px] text-muted-foreground hover:text-primary transition font-medium">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 text-[13.5px] rounded-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-[13.5px] font-semibold rounded-lg gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Sign-up link */}
          <div className="mt-5 text-center">
            <p className="text-[13.5px] text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold underline-offset-4">
                Create one
              </Link>
            </p>
          </div>

          {/* Footer badge */}
          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center gap-2 text-[11.5px] text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <span>Serving Topeka &amp; Shawnee County</span>
            <span className="opacity-40">·</span>
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Verified platform</span>
          </div>
        </div>
      </div>
    </div>
  )
}
