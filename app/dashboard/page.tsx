"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getStoredUser } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.replace("/login")
    } else {
      router.replace(`/dashboard/${user.role}`)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}
