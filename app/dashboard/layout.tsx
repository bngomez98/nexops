'use client'

import { RequestsProvider } from '@/app/lib/requests-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RequestsProvider>{children}</RequestsProvider>
}
