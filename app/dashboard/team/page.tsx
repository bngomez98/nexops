'use client'

import { useAuth } from '@/app/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { redirect } from 'next/navigation'
import { Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react'

const teamMembers = [
  {
    id: '1',
    name: 'Brianna Gomez',
    role: 'Founder & Operations Lead',
    email: 'brianna@nexusoperations.org',
    phone: '(785) 727-1106',
    status: 'active',
  },
  {
    id: '2',
    name: 'John Garcia',
    role: 'Lead Contractor',
    email: 'john@nexusoperations.org',
    phone: '(785) 727-1106',
    status: 'active',
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    role: 'Contractor',
    email: 'maria@nexusoperations.org',
    phone: '(913) 555-0102',
    status: 'active',
  },
  {
    id: '4',
    name: 'Tech Services LLC',
    role: 'HVAC Partner',
    email: 'contact@techservices.com',
    phone: '(913) 555-0103',
    status: 'active',
  },
]

export default function TeamPage() {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn || user?.role !== 'admin') {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Network Contractors</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage verified contractors and team members</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Add contractor
          </button>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Total</p>
                <p className="text-2xl font-semibold text-foreground mt-2">{teamMembers.length}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Active</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {teamMembers.filter((m) => m.status === 'active').length}
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Verified</p>
                <p className="text-2xl font-semibold text-foreground mt-2">{teamMembers.length}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-start justify-between py-4 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    {member.status === 'active' && (
                      <span className="h-2 w-2 rounded-full bg-green-500" title="Active" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <a href={`mailto:${member.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </a>
                    <a href={`tel:${member.phone}`} className="flex items-center gap-1 hover:text-primary">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground rounded border border-border">
                    Edit
                  </button>
                  <button className="text-xs px-2 py-1 text-muted-foreground hover:text-red-600 rounded border border-border">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
