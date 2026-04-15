'use client'

import { RequestsProvider } from '@/app/lib/requests-context'

export function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return <RequestsProvider>{children}</RequestsProvider>
}
