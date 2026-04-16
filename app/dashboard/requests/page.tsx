'use client'

import { useEffect } from 'react'
import { useRouter } from '@/lib/router'

export default function RequestsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/homeowner/requests')
  }, [router])
  return null
}
