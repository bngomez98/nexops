'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { JobDetailSheet } from './components/JobDetailSheet'
import { PortalHeader } from './components/PortalHeader'
import { SubmitRequestSheet } from './components/SubmitRequestSheet'
import { TabBar, type Tab } from './components/TabBar'
import { usePortal } from './lib/portal-context'
import { AdminView } from './views/AdminView'
import { DashboardView } from './views/DashboardView'
import { JobsView } from './views/JobsView'
import { ProfileView } from './views/ProfileView'
import { SearchView } from './views/SearchView'

export default function PortalPage() {
  const { currentUser } = usePortal()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [submitOpen, setSubmitOpen] = useState(false)
  const [openJobId, setOpenJobId] = useState<string | null>(null)

  useEffect(() => {
    if (tab === 'admin' && currentUser.role !== 'admin') {
      setTab('dashboard')
    }
  }, [currentUser.role, tab])

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
