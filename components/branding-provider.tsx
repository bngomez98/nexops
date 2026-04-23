'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

export interface BrandingConfig {
  brandName?: string
  primaryColor?: string
  accentColor?: string
  logoUrl?: string
}

interface BrandingContextValue {
  branding: BrandingConfig
  setBranding: (b: BrandingConfig) => void
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: {},
  setBranding: () => undefined,
})

export function useBranding(): BrandingContextValue {
  return useContext(BrandingContext)
}

/**
 * Fetches the authenticated user's branding config from the API and injects
 * CSS custom-property overrides as inline styles on a wrapper element, so
 * descendant components (logo, buttons, sidebar highlights …) automatically
 * reflect the tenant's brand colours.
 *
 * Falls back silently to the Nexus design-system defaults when no branding is
 * saved or the request fails.
 */
export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBrandingState] = useState<BrandingConfig>({})

  useEffect(() => {
    fetch('/api/settings/branding')
      .then(r => (r.ok ? r.json() : null))
      .then((data: { branding: BrandingConfig | null } | null) => {
        if (data?.branding) setBrandingState(data.branding)
      })
      .catch(() => {
        /* network / auth errors are non-fatal – defaults apply */
      })
  }, [])

  const setBranding = useCallback((b: BrandingConfig) => {
    setBrandingState(b)
  }, [])

  // Build the inline style object that overrides CSS custom properties for
  // the subtree. We only set a property when the user has a custom value so
  // the Nexus defaults (defined in globals.css :root) remain in effect for
  // everything else.
  const style: React.CSSProperties = {}

  if (branding.primaryColor) {
    ;(style as Record<string, string>)['--primary'] = branding.primaryColor
    ;(style as Record<string, string>)['--ring'] = branding.primaryColor
    ;(style as Record<string, string>)['--sidebar-primary'] = branding.primaryColor
    ;(style as Record<string, string>)['--sidebar-ring'] = branding.primaryColor
    ;(style as Record<string, string>)['--chart-1'] = branding.primaryColor
  }

  if (branding.accentColor) {
    ;(style as Record<string, string>)['--accent'] = branding.accentColor
    ;(style as Record<string, string>)['--accent-foreground'] = branding.primaryColor ?? branding.accentColor
    ;(style as Record<string, string>)['--sidebar-accent'] = branding.accentColor
  }

  return (
    <BrandingContext.Provider value={{ branding, setBranding }}>
      <div style={style}>{children}</div>
    </BrandingContext.Provider>
  )
}
