"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"

const STORAGE_KEY = "nexops-cookie-consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // Small delay so it doesn't flash during initial paint
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined")
    setVisible(false)
  }

  if (!mounted || !visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{
        animation: "slide-up 0.4s ease-out",
      }}
    >
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/40 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <Cookie className="h-5 w-5 text-primary" />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-0.5">
            This website uses cookies
          </p>
          <p className="text-sm text-muted-foreground leading-snug">
            By clicking <span className="font-medium text-foreground">Accept</span>, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline font-medium">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
            . We use cookies to improve your experience and analyze site performance.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/70 rounded-lg transition-all duration-200"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-primary/20"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all duration-200 sm:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
