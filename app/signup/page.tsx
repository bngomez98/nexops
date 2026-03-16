"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "contractor" ? "contractor" : "homeowner";

  const [role, setRole] = useState<"homeowner" | "contractor">(defaultRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Signup failed");
        return;
      }

      router.push(role === "contractor" ? "/dashboard/contractor" : "/dashboard/homeowner");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <Zap className="h-6 w-6 text-blue-600" />
            NexOps
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Join NexOps — free for homeowners</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role toggle */}
            <div className="mb-6 flex rounded-lg border overflow-hidden">
              {(["homeowner", "contractor"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                    role === r
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="785-555-0100" value={form.phone} onChange={handleChange} />
              </div>

              {role === "contractor" && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="company">Company name</Label>
                    <Input id="company" name="company" placeholder="Acme Home Services" value={form.company} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="licenseNumber">License number</Label>
                    <Input id="licenseNumber" name="licenseNumber" placeholder="KS-12345" value={form.licenseNumber} onChange={handleChange} />
                  </div>
                </>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Mail, Lock, User, ArrowRight, Home, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function SignupForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") === "contractor" ? "contractor" : "homeowner"
  
  const [role, setRole] = useState<"homeowner" | "contractor">(defaultRole)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup - would connect to auth system
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Link href="/" className="inline-flex items-center gap-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">N</span>
        </div>
        <span className="text-lg font-semibold">Nexus</span>
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-muted-foreground">
        Get started with Nexus in just a few steps.
      </p>

      {/* Role selector */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("homeowner")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
            role === "homeowner"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <Home className={cn("h-6 w-6", role === "homeowner" ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("text-sm font-medium", role === "homeowner" ? "text-foreground" : "text-muted-foreground")}>
            Homeowner
          </span>
        </button>
        <button
          type="button"
          onClick={() => setRole("contractor")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
            role === "contractor"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <Hammer className={cn("h-6 w-6", role === "contractor" ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("text-sm font-medium", role === "contractor" ? "text-foreground" : "text-muted-foreground")}>
            Contractor
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {role === "contractor" ? "Business or full name" : "Full name"}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder={role === "contractor" ? "Acme Plumbing LLC" : "John Smith"}
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Create a password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          {role === "contractor" ? "Apply to join" : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
    <div className="flex min-h-screen">
      {/* Left panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <Suspense fallback={<div className="mx-auto w-full max-w-sm animate-pulse h-96 bg-card rounded-lg" />}>
          <SignupForm />
        </Suspense>
      </div>

      {/* Right panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-card lg:p-12">
        <div className="mx-auto max-w-md space-y-8">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-semibold">Create your profile</h3>
            <p className="text-muted-foreground">Tell us about yourself and what you need.</p>
          </div>
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-lg font-semibold">Get matched</h3>
            <p className="text-muted-foreground">We connect you with the right people fast.</p>
          </div>
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-lg font-semibold">Get it done</h3>
            <p className="text-muted-foreground">Manage everything from start to finish.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
