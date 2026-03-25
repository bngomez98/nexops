'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EarningsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/contractor/payments')
  }, [router])
  return null
}
