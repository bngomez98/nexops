"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { AuthShell } from "@/components/auth-shell"

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

  useEffect(() => {
    if (roleParam && (ROLES as readonly string[]).includes(roleParam)) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
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
    <AuthShell
      title="Create your account"
      subtitle="Set up secure access for owner, manager, or contractor workflows on Nexus Operations."
    >
      <form onSubmit={handleSignUp} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 rounded border border-destructive/40 bg-destructive/8 p-3 text-[13px] text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-[13px]">Full name</Label>
          <Input id="fullName" type="text" placeholder="Jane Smith" value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))} required className="h-10 text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px]">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} required className="h-10 text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[13px]">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} required className="h-10 text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-[13px]">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))} required className="h-10 text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[13px]">Account type</Label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
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

        <Button type="submit" className="h-10 w-full text-[13px] font-semibold" disabled={loading}>
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

      <p className="mt-5 text-[11.5px] leading-relaxed text-muted-foreground">
        By creating an account you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </p>

      <div className="mt-5 border-t border-border pt-5 text-center text-[13px] text-muted-foreground">
        Already have an account? <Link href="/auth/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </div>
    </AuthShell>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
