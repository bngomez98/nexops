'use client'

import { useEffect } from 'react'
import { useRouter } from '@/lib/router'

export default function TeamPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard')
  }, [router])
  return null
}
