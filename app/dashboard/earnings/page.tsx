'use client'

import { useEffect } from 'react'
import { useRouter } from '@/lib/router'

export default function EarningsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/contractor/payments')
  }, [router])
  return null
}
