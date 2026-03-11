"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, ArrowRight, Home, Hammer, Building2 } from "lucide-react"

type Role = "homeowner" | "property_manager" | "contractor"

const roleOptions: { value: Role; label: string; sub: string; icon: React.ElementType }[] = [
  { value: "homeowner",        label: "Property Owner",    sub: "Manage requests for my home",          icon: Home       },
  { value: "property_manager", label: "Property Manager",  sub: "Manage multiple properties / units",   icon: Building2  },
  { value: "contractor",       label: "Contractor",        sub: "Receive and work service requests",    icon: Hammer     },
]

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
    role:            "homeowner" as Role,
  })
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/dashboard`,
        data: {
          full_name: form.fullName,
          role:      form.role,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/auth/sign-up-success")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between border-r border-border bg-card px-12 py-10 flex-shrink-0">
        <Link href="/">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={150}
            height={50}
            style={{ height: "36px", width: "auto" }}
          />
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold mb-2">What you get access to</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              A Nexus Operations account gives you a persistent, organized record of every service request, consultation, estimate, and completed job at your property or portfolio.
            </p>
          </div>

          <div className="space-y-5 text-[13px]">
            {[
              ["Request portal",       "Submit service requests with photos and scope. Track status in real time."],
              ["Service history",      "Every project, estimate, and cost — organized by property and trade category."],
              ["Maintenance reports",  "Periodic summaries of completed work, spend breakdown, and deferred items."],
              ["Advisory dashboard",   "Recommendations based on what has and has not been serviced at your property."],
              ["Messaging",            "Communicate directly with your assigned contractor through the platform."],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-muted-foreground mt-0.5">{desc}</p>
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

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12">
        <div className="mb-8 lg:hidden">
          <Link href="/">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={150} height={50}
              style={{ height: "36px", width: "auto" }} />
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Free for property owners and managers.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-[13px]">Account type</Label>
              <div className="grid gap-2">
                {roleOptions.map(({ value, label, sub, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    className={`flex items-center gap-3 rounded border px-3 py-2.5 text-left transition text-[13px] ${
                      form.role === value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${form.role === value ? "text-primary" : ""}`} />
                    <div>
                      <p className="font-medium leading-none">{label}</p>
                      <p className={`text-[11px] mt-0.5 ${form.role === value ? "text-primary/80" : "text-muted-foreground"}`}>{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-[13px]">Full name</Label>
              <Input id="fullName" placeholder="Jane Smith" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required autoComplete="name" className="text-sm" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px]">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required autoComplete="email" className="text-sm" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px]">Password</Label>
                <Input id="password" type="password" placeholder="Min. 8 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required autoComplete="new-password" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[13px]">Confirm</Label>
                <Input id="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required autoComplete="new-password" className="text-sm" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 mt-1"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</>
              ) : (
                <>Create Account <ArrowRight className="h-3.5 w-3.5" /></>
              )}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-muted-foreground text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <div className="mt-5 border-t border-border pt-4 text-center">
            <p className="text-[13px] text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
