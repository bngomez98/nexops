"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Mail, Lock, User, ArrowRight, Home, Hammer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole =
    searchParams.get("role") === "contractor" ? "contractor" : "homeowner";

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

      router.push(role === "contractor" ? "/contractor" : "/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Link href="/" className="inline-flex items-center gap-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">NexOps</span>
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-muted-foreground">
        Get started with NexOps in just a few steps.
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
          <Home
            className={cn(
              "h-6 w-6",
              role === "homeowner" ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              role === "homeowner" ? "text-foreground" : "text-muted-foreground"
            )}
          >
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
          <Hammer
            className={cn(
              "h-6 w-6",
              role === "contractor" ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              role === "contractor" ? "text-foreground" : "text-muted-foreground"
            )}
          >
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
              name="name"
              type="text"
              placeholder={role === "contractor" ? "Acme Plumbing LLC" : "Jane Smith"}
              className="pl-10"
              value={form.name}
              onChange={handleChange}
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
              name="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
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
              name="password"
              type="password"
              placeholder="At least 6 characters"
              className="pl-10"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="555-555-0100"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {role === "contractor" && (
          <>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company name
              </label>
              <Input
                id="company"
                name="company"
                placeholder="Acme Home Services"
                value={form.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="licenseNumber" className="text-sm font-medium">
                License number
              </label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                placeholder="KS-12345"
                value={form.licenseNumber}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading
            ? "Creating account…"
            : role === "contractor"
            ? "Apply to join"
            : "Create account"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-sm animate-pulse h-96 bg-card rounded-lg" />
          }
        >
          <SignupForm />
        </Suspense>
      </div>

      {/* Right panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-card lg:p-12">
        <div className="mx-auto max-w-md space-y-8">
          {[
            {
              step: "1",
              title: "Create your profile",
              desc: "Tell us about yourself and what you need.",
            },
            {
              step: "2",
              title: "Get matched",
              desc: "We connect you with the right people fast.",
            },
            {
              step: "3",
              title: "Get it done",
              desc: "Manage everything from start to finish.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-base font-bold text-primary">{step}</span>
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
