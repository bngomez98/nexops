"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"

const ROLES = ["homeowner", "property_manager", "contractor"] as const
type Role = (typeof ROLES)[number]

const roleLabels: Record<Role, string> = {
  homeowner: "Property Owner",
  property_manager: "Property Manager",
  contractor: "Contractor",
}

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const roleParam = searchParams.get("role") as Role | null
  const initialRole: Role = roleParam && (ROLES as readonly string[]).includes(roleParam) ? roleParam : "homeowner"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: initialRole,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Sync role if the URL role param changes (e.g., user navigates back/forward)
  useEffect(() => {
    if (roleParam && (ROLES as readonly string[]).includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam }))
    }
  }, [roleParam])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          full_name: formData.fullName,
          role: formData.role,
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
              Documentation maintained through job completion.
            </p>
            <p>
              Contractors join at no cost. Service requests receive a dedicated
              contractor from our vetted network within the submission day.
            </p>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 gap-0 divide-y divide-border [&>*]:py-4 [&>*:nth-child(odd)]:pr-6 [&>*:nth-child(even)]:pl-6 [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:border-border">
            {[
              { n: "8",    label: "Trade categories" },
              { n: "1",    label: "Contractor per request" },
              { n: "$0",   label: "Contractor cost" },
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
            <h1 className="text-[22px] font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">
              Property service management in Topeka, Kansas.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 rounded border border-destructive/40 bg-destructive/8 p-3 text-[13px] text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-[13px]">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
                className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px]">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[13px]">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px]">Account type</Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                    className={`rounded border px-2 py-2.5 text-[11.5px] font-medium transition ${
                      formData.role === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-[13px] font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-5 text-[11.5px] text-muted-foreground leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <div className="mt-5 border-t border-border pt-5 text-[13px] text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
