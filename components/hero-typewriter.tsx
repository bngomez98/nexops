'use client'

import { useEffect, useState } from 'react'

const services = [
  'Electrical',
  'Roofing',
  'Plumbing',
  'Concrete',
  'HVAC',
  'Fencing',
  'Tree Removal',
  'Excavation',
]

export function HeroTypewriter() {
  const [serviceIndex, setServiceIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')

  useEffect(() => {
    const current = services[serviceIndex]

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pause'), 1800)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('deleting'), 400)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
        return () => clearTimeout(t)
      } else {
        setServiceIndex((i) => (i + 1) % services.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, serviceIndex])

  return (
    <span>
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-[var(--color-primary)] ml-0.5 align-middle animate-pulse" />
    </span>
  )
}
