'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="sheet-handle" />
            {title && (
              <div className="flex items-center justify-between px-6 pt-3 pb-4 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full p-2 text-indigo-100/70 hover:bg-white/10 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
