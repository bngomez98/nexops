import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav user={user} />
      {/* pt-14 on mobile to clear the fixed top bar; removed on md+ where sidebar is inline */}
      <main className="flex-1 overflow-auto bg-background pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
