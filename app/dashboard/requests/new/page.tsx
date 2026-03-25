'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RequestsNewPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/homeowner/new-request')
  }, [router])
  return null
}
