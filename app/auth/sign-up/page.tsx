"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, ChevronRight } from "lucide-react"

const SERVICE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal' },
  { value: 'concrete-work', label: 'Concrete Work' },
  { value: 'roofing',       label: 'Roofing' },
  { value: 'hvac',          label: 'HVAC' },
  { value: 'fencing',       label: 'Fencing' },
  { value: 'electrical',    label: 'Electrical' },
  { value: 'plumbing',      label: 'Plumbing' },
  { value: 'excavation',    label: 'Excavation' },
]

function SignUpInner() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role") ?? "homeowner"

  const [role, setRole] = useState<string>(roleParam)
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    company: "", phone: "",
    serviceCategories: [] as string[],
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isContractor = role === "contractor"

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function toggleCategory(cat: string) {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(cat)
        ? prev.serviceCategories.filter(c => c !== cat)
        : [...prev.serviceCategories, cat],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (isContractor && !formData.company.trim()) {
      setError("Company name is required for contractor accounts.")
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role,
            company_name: formData.company || null,
            phone: formData.phone || null,
            service_categories: isContractor ? formData.serviceCategories : [],
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // If user is confirmed immediately, redirect; else show success message
      if (data.user && !data.user.email_confirmed_at) {
        setSuccess(true)
        return
      }

      window.location.href = isContractor ? "/dashboard/contractor" : "/dashboard/homeowner"
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground text-[14px] leading-relaxed mb-6">
            We sent a confirmation link to <strong>{formData.email}</strong>.
            Click the link to activate your account and get started.
          </p>
          <Link href="/auth/login" className="text-primary hover:underline text-[13.5px] font-medium">
            Return to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[440px] flex-col justify-between border-r border-border bg-card px-10 py-14 flex-shrink-0">
        <Link href="/">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={150}
            height={50}
            style={{ height: "26px", width: "auto" }}
            priority
          />
        </Link>

        <div className="space-y-7">
          <div>
            <p className="font-mono-label text-primary mb-3">
              Join Nexus Operations
            </p>
            <h2 className="text-2xl font-bold leading-snug tracking-tight">
              {isContractor
                ? "Join our verified contractor network."
                : "Start building your permanent property record."}
            </h2>
          </div>

          <div className="space-y-4 text-[13px] text-muted-foreground leading-[1.75]">
            {isContractor ? (
              <>
                <p>Receive pre-documented project notifications in your trade. No fees. No competing bids.</p>
                <p>Every project you claim comes with photos, scope, and the owner's budget ceiling already in hand.</p>
              </>
            ) : (
              <>
                <p>Submit your first request and get matched with one verified contractor in your area.</p>
                <p>Every project is documented and stored permanently — for insurance, resale, and refinancing.</p>
              </>
            )}
          </div>

          <div className="border-t border-border pt-6 space-y-3">
            {(isContractor
              ? ["Free to join and participate", "Pre-documented project leads", "Direct payment from owners", "License & insurance verified"]
              : ["One contractor per request", "No competing bids", "Permanent service record", "Licensed & insured contractors"]
            ).map(item => (
              <div key={item} className="flex items-center gap-2.5 text-[13px] text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Topeka, KS · (785) 727-1106 · admin@nexusoperations.org
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="mb-6 lg:hidden">
          <Link href="/">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={140} height={47} style={{ height: "28px", width: "auto" }} priority />
          </Link>
        </div>

        <div className="w-full max-w-[440px]">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">
              Join as a{" "}
              <button onClick={() => setRole("homeowner")} className={`font-semibold transition hover:text-foreground ${role === "homeowner" ? "text-primary" : "text-muted-foreground"}`}>
                homeowner
              </button>
              {" "}or{" "}
              <button onClick={() => setRole("contractor")} className={`font-semibold transition hover:text-foreground ${role === "contractor" ? "text-primary" : "text-muted-foreground"}`}>
                contractor
              </button>
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden mb-6 bg-muted/30 p-1 gap-1">
            {[
              { key: "homeowner", label: "Homeowner" },
              { key: "contractor", label: "Contractor" },
            ].map(r => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex-1 py-2 text-[13px] font-semibold transition-all rounded-lg ${
                  role === r.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[13px]">Full name</Label>
              <Input
                id="name" name="name" type="text"
                placeholder="Jane Smith"
                value={formData.name} onChange={handleChange}
                required autoComplete="name" className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px]">Email address</Label>
              <Input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                required autoComplete="email" className="h-10 text-[13px]"
              />
            </div>

            {isContractor && (
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-[13px]">Company name <span className="text-destructive">*</span></Label>
                <Input
                  id="company" name="company" type="text"
                  placeholder="Smith Roofing LLC"
                  value={formData.company} onChange={handleChange}
                  required={isContractor} className="h-10 text-[13px]"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[13px]">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                id="phone" name="phone" type="tel"
                placeholder="(785) 555-0100"
                value={formData.phone} onChange={handleChange}
                autoComplete="tel" className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px]">Password</Label>
              <Input
                id="password" name="password" type="password"
                placeholder="At least 8 characters"
                value={formData.password} onChange={handleChange}
                required autoComplete="new-password" className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[13px]">Confirm password</Label>
              <Input
                id="confirmPassword" name="confirmPassword" type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword} onChange={handleChange}
                required autoComplete="new-password" className="h-10 text-[13px]"
              />
            </div>

            {/* Service categories for contractors */}
            {isContractor && (
              <div className="space-y-2.5">
                <Label className="text-[13px]">Service categories <span className="text-muted-foreground font-normal">(select all that apply)</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium transition-all text-left ${
                        formData.serviceCategories.includes(cat.value)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground'
                      }`}
                    >
                      {formData.serviceCategories.includes(cat.value) && (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-10 text-[13.5px] font-semibold mt-2 rounded-lg" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
              ) : (
                <span className="flex items-center gap-1.5">
                  Create {isContractor ? "Contractor" : "Homeowner"} Account
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-5 text-center space-y-1.5">
            <p className="text-[13px] text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <SignUpInner />
    </Suspense>
  )
}
