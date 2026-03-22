"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Shield, Zap, BarChart3 } from "lucide-react"
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
    window.location.href = role === "contractor" ? "/dashboard/contractor" : "/dashboard"
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] flex-col justify-between border-r border-border bg-card px-12 py-16 flex-shrink-0">
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

        <div className="space-y-10">
          <div>
            <p className="font-mono-label text-primary mb-5">Nexus Operations</p>
            <h2 className="text-[26px] font-bold leading-[1.25] tracking-tight text-balance">
              Property service management for Topeka and Shawnee County.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield,   title: "Verified contractors only",   desc: "Every contractor in our network is manually reviewed before activation." },
              { icon: Zap,      title: "Assigned the same day",       desc: "Requests receive a dedicated contractor within the submission day." },
              { icon: BarChart3, title: "Permanent project records",  desc: "Every completed project generates a documented record you keep forever." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3.5">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 mt-0.5">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-7 grid grid-cols-2 gap-5">
            {[
              { n: "8",    label: "Trade categories" },
              { n: "1",    label: "Contractor per request" },
              { n: "$0",   label: "Contractor cost" },
              { n: "100%", label: "Manually reviewed" },
            ].map(({ n, label }) => (
              <div key={label} className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-[22px] font-bold text-foreground tracking-tight">{n}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          {CONTACT_INFO.cityStateZip.replace(/ 66604$/, "")} · {CONTACT_INFO.phoneDisplay} · {CONTACT_INFO.email}
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 lg:hidden">
          <Link href="/">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={140}
              height={47}
              style={{ height: "30px", width: "auto" }}
              priority
            />
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-[24px] font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Sign in to your Nexus Operations account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive">
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
                <Link
                  href="/auth/forgot-password"
                  className="text-[12px] text-muted-foreground hover:text-primary transition"
                >
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
              className="w-full h-10 text-[13.5px] font-semibold rounded-lg"
              disabled={loading}
            >
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

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-[13.5px] text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
