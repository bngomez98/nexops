"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight, Phone } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { CONTACT_INFO } from "@/lib/contact-info"

// Header is only used on inner pages (not the home page which has its own header)

function NexusIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="5.5" strokeLinecap="round"/>
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="5.5" strokeLinecap="round"/>
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
      <line x1="60" y1="47" x2="60" y2="73" stroke="oklch(0.618 0.228 264)" strokeWidth="5" strokeLinecap="round"/>
      <line x1="47" y1="60" x2="73" y2="60" stroke="oklch(0.618 0.228 264)" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

const nav = [
  { label: "Homeowners", href: "/#homeowners" },
  { label: "Contractors", href: "/#contractors" },
  { label: "How It Works", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/contact" },
]

const BORDER = "rgba(255,255,255,0.08)"
const GREEN = "oklch(0.618 0.228 264)"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(10,10,10,0.96)" : "#0a0a0a",
        backdropFilter: scrolled ? "blur(20px) saturate(1.3)" : undefined,
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.3)" : undefined,
        borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
        transition: "border-color 0.35s, background 0.35s, box-shadow 0.35s",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.2)" : "none",
      }}
    >
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 36, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          <p className="hidden sm:block">Property maintenance coordination for homeowners and contractors in Topeka, KS.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
            <a href={CONTACT_INFO.phoneHref} style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              <Phone style={{ width: 11, height: 11 }} />
              {CONTACT_INFO.phoneDisplay}
            </a>
            <Link href="/contractors" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: GREEN, fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Contractor network <ArrowRight style={{ width: 10, height: 10 }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <Link href="/" aria-label="Nexus Operations home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <NexusIcon size={28} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>NEXUS</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: GREEN, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 1 }}>OPERATIONS</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex" style={{ alignItems: "center", gap: 2 }} aria-label="Main navigation">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: isActive(l.href) ? 600 : 500,
                  color: isActive(l.href) ? "#fff" : "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  transition: "color 0.2s, background 0.2s",
                  background: isActive(l.href) ? "rgba(255,255,255,0.08)" : "transparent",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = isActive(l.href) ? "#fff" : "rgba(255,255,255,0.6)"
                  e.currentTarget.style.background = isActive(l.href) ? "rgba(255,255,255,0.08)" : "transparent"
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 12 }}>
            <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              Sign In
            </Link>
            <Link href="/auth/sign-up" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "9px 20px", borderRadius: 9999,
              background: GREEN, color: "#fff",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 20px rgba(58,173,88,0.3)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(58,173,88,0.45)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(58,173,88,0.3)" }}
            >
              Get Started <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            style={{ display: "none", padding: 6, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="lg:hidden animate-fade-in" style={{ borderTop: `1px solid ${BORDER}`, paddingBottom: 20 }} aria-label="Mobile navigation">
            <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 12 }}>
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: 13.5,
                    fontWeight: isActive(l.href) ? 600 : 500,
                    color: isActive(l.href) ? "#fff" : "rgba(255,255,255,0.7)",
                    padding: "10px 12px",
                    borderRadius: 8,
                    textDecoration: "none",
                    transition: "background 0.2s, color 0.2s",
                    background: isActive(l.href) ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isActive(l.href) ? "rgba(255,255,255,0.06)" : "transparent"
                    e.currentTarget.style.color = isActive(l.href) ? "#fff" : "rgba(255,255,255,0.7)"
                  }}
                  onClick={closeMobile}
                >
                  {l.label}
                </Link>
              ))}
              <div style={{ marginTop: 8, borderRadius: 12, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.03)", padding: 12, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                <p style={{ fontWeight: 600, color: "#fff", marginBottom: 6 }}>Need help now?</p>
                <a href={CONTACT_INFO.phoneHref} style={{ display: "inline-flex", alignItems: "center", gap: 4, color: GREEN, textDecoration: "none" }}>
                  <Phone style={{ width: 13, height: 13 }} /> {CONTACT_INFO.phoneDisplay}
                </a>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <Link href="/auth/login" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", borderRadius: 8, border: `1px solid ${BORDER}`, textDecoration: "none" }} onClick={closeMobile}>
                  Sign In
                </Link>
                <Link href="/auth/sign-up" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", fontSize: 13, fontWeight: 700, color: "#fff", borderRadius: 8, background: GREEN, textDecoration: "none" }} onClick={closeMobile}>
                  Get Started
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
