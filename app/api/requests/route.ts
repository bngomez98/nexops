import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { canSubmitServiceRequest } from "@/lib/auth/roles"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = user.user_metadata?.role
  if (!canSubmitServiceRequest(role)) {
    return NextResponse.json(
      { error: "Only homeowners can submit service requests." },
      { status: 403 },
    )
  }

  const body = await req.json()
  const { category, description, budgetMin, budgetMax, address, city, state, zipCode, preferredDates, additionalNotes, photoUrls } = body

  if (!category || !description || !address || !city || !zipCode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      owner_id: user.id,
      category,
      description,
      budget_min: budgetMin ? parseFloat(budgetMin) : null,
      budget_max: budgetMax ? parseFloat(budgetMax) : null,
      address,
      city,
      state: state || "KS",
      zip_code: zipCode,
      preferred_dates: preferredDates || null,
      additional_notes: additionalNotes || null,
      photo_urls: Array.isArray(photoUrls) && photoUrls.length > 0 ? photoUrls : null,
      status: "in_queue",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
