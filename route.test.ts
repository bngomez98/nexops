import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function getAccess(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, role: string, requestId: string) {
  const { data: req } = await supabase
    .from("service_requests")
    .select("owner_id, assigned_contractor_id")
    .eq("id", requestId)
    .single()

  if (!req) return { req: null, allowed: false }

  const isOwner      = req.owner_id === userId
  const isContractor = role === "contractor" && req.assigned_contractor_id === userId
  return { req, allowed: isOwner || isContractor }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const url       = new URL(request.url)
  const requestId = url.searchParams.get("requestId")
  if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 })

  const role = (user.user_metadata?.role as string) || "homeowner"
  const { allowed } = await getAccess(supabase, user.id, role, requestId)
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at, profiles!sender_id(full_name, avatar_url)")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true })

  if (error) {
    // Table may not exist in this environment — return empty gracefully
    return NextResponse.json({ messages: [], unavailable: true })
  }

  return NextResponse.json({ messages: messages ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { requestId, body } = await request.json() as { requestId?: string; body?: string }
  if (!requestId || !body?.trim()) {
    return NextResponse.json({ error: "requestId and body are required" }, { status: 400 })
  }

  const role = (user.user_metadata?.role as string) || "homeowner"
  const { allowed } = await getAccess(supabase, user.id, role, requestId)
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: message, error } = await supabase
    .from("messages")
    .insert({ request_id: requestId, sender_id: user.id, body: body.trim() })
    .select("id, sender_id, body, created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message }, { status: 201 })
}
