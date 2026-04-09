import type { Metadata } from 'next'
import { PortalProvider } from './lib/portal-context'
import './portal.css'

export const metadata: Metadata = {
  title: 'Nexus Operations — Portal',
  description: 'Premium property operations platform — submit jobs, track progress live, and pay invoices in one place.',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <div className="portal-shell">{children}</div>
    </PortalProvider>
  )
}
