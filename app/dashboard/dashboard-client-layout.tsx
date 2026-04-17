'use client'

import { RequestsProvider } from '@/app/lib/requests-context'
import { BrandingProvider } from '@/components/branding-provider'

export function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandingProvider>
      <RequestsProvider>{children}</RequestsProvider>
    </BrandingProvider>
  )
}
