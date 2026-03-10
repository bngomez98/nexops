import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = user.user_metadata?.role || "homeowner"
  if (role !== "contractor") {
    return NextResponse.json({ error: "Only contractors can claim requests" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("service_requests")
    .update({
      assigned_contractor_id: user.id,
      status: "assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("assigned_contractor_id", null)
    .in("status", ["pending_review", "in_queue"])
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Request is no longer available" },
      { status: 409 }
    )
  }

  return NextResponse.json(data)
}
