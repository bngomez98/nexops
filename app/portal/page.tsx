'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { JobDetailSheet } from './components/JobDetailSheet'
import { PortalHeader } from './components/PortalHeader'
import { SubmitRequestSheet } from './components/SubmitRequestSheet'
import { TabBar, type Tab } from './components/TabBar'
import { usePortal } from './lib/portal-context'
import { Loader2 } from 'lucide-react'
import { AdminView } from './views/AdminView'
import { DashboardView } from './views/DashboardView'
import { JobsView } from './views/JobsView'
import { ProfileView } from './views/ProfileView'
import { SearchView } from './views/SearchView'

export default function PortalPage() {
  const { currentUser, loading, error, refresh } = usePortal()
  const { currentUser, loading, error } = usePortal()
  const { currentUser, loading } = usePortal()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [submitOpen, setSubmitOpen] = useState(false)
  const [openJobId, setOpenJobId] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser && tab === 'admin' && currentUser.role !== 'admin') {
    if (!loading && currentUser.role === 'contractor' && tab === 'admin') {
      setTab('dashboard')
    }
  }, [currentUser.role, loading, tab])

  useEffect(() => {
    if (tab === 'admin' && currentUser.role !== 'admin') {
      setTab('dashboard')
    }
  }, [currentUser, tab])

  if (loading) {
    return (
      <div className="portal-content flex items-center justify-center min-h-[60vh]">
        <div className="glass-soft px-6 py-5 text-indigo-100 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading portal…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="portal-content flex items-center justify-center min-h-[60vh]">
        <div className="glass-soft px-6 py-5 text-rose-200">
          {error}
        </div>
      </div>
    )
  }

  if (!currentUser) return null


  if (loading) {
    return (
      <div className="portal-content">
        <PortalHeader />
        <div className="glass p-6 text-sm text-indigo-200/70">Loading portal data…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="portal-content">
        <PortalHeader />
        <div className="glass p-6 space-y-3">
          <div className="text-sm text-rose-300">{error}</div>
          <button type="button" className="btn-primary" onClick={() => { void refresh() }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="portal-content">
      <PortalHeader />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === 'dashboard' && (
            <DashboardView
              onSubmitRequest={() => setSubmitOpen(true)}
              onOpenJob={(id) => setOpenJobId(id)}
              onSeeAllJobs={() => setTab('jobs')}
            />
          )}
          {tab === 'jobs' && (
            <JobsView
              onSubmitRequest={() => setSubmitOpen(true)}
              onOpenJob={(id) => setOpenJobId(id)}
            />
          )}
          {tab === 'search' && <SearchView onOpenJob={(id) => setOpenJobId(id)} />}
          {tab === 'profile' && <ProfileView />}
          {tab === 'admin' && currentUser.role === 'admin' && (
            <AdminView onOpenJob={(id) => setOpenJobId(id)} />
          )}
        </motion.div>
      </AnimatePresence>

      <TabBar active={tab} onChange={setTab} role={currentUser.role} />

      <SubmitRequestSheet
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmitted={(id) => setOpenJobId(id)}
      />
      <JobDetailSheet jobId={openJobId} onClose={() => setOpenJobId(null)} />
    </div>
  )
}
