import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { canSubmitServiceRequest } from "@/lib/auth/roles"

const VALID_CATEGORIES = new Set([
  "tree-removal", "hvac", "electrical", "roofing",
  "concrete", "fencing", "plumbing", "general-repair",
])

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

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { category, description, budgetMin, budgetMax, address, city, state, zipCode, preferredDates, additionalNotes, photoUrls } = body as Record<string, unknown>

  // Required field checks
  if (!category || typeof category !== "string" || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid or missing category" }, { status: 400 })
  }
  if (!description || typeof description !== "string" || description.trim().length < 10) {
    return NextResponse.json({ error: "Description must be at least 10 characters" }, { status: 400 })
  }
  if (!address || typeof address !== "string" || address.trim().length === 0) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }
  if (!city || typeof city !== "string" || city.trim().length === 0) {
    return NextResponse.json({ error: "City is required" }, { status: 400 })
  }
  if (!zipCode || typeof zipCode !== "string" || !/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
    return NextResponse.json({ error: "ZIP code must be a valid 5-digit US ZIP code" }, { status: 400 })
  }

  // Optional numeric budget fields
  let budgetMinNum: number | null = null
  let budgetMaxNum: number | null = null

  if (budgetMin !== undefined && budgetMin !== "" && budgetMin !== null) {
    budgetMinNum = parseFloat(String(budgetMin))
    if (isNaN(budgetMinNum) || budgetMinNum < 0) {
      return NextResponse.json({ error: "Budget minimum must be a non-negative number" }, { status: 400 })
    }
  }
  if (budgetMax !== undefined && budgetMax !== "" && budgetMax !== null) {
    budgetMaxNum = parseFloat(String(budgetMax))
    if (isNaN(budgetMaxNum) || budgetMaxNum < 0) {
      return NextResponse.json({ error: "Budget maximum must be a non-negative number" }, { status: 400 })
    }
  }
  if (budgetMinNum !== null && budgetMaxNum !== null && budgetMinNum > budgetMaxNum) {
    return NextResponse.json({ error: "Budget minimum cannot exceed budget maximum" }, { status: 400 })
  }

  // Validate photoUrls
  if (photoUrls !== undefined && photoUrls !== null) {
    if (!Array.isArray(photoUrls) || photoUrls.length > 10 || photoUrls.some((u) => typeof u !== "string")) {
      return NextResponse.json({ error: "photoUrls must be an array of up to 10 strings" }, { status: 400 })
    }
  }

  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      owner_id: user.id,
      category,
      description: description.trim(),
      budget_min: budgetMinNum,
      budget_max: budgetMaxNum,
      address: (address as string).trim(),
      city: (city as string).trim(),
      state: typeof state === "string" && state.trim().length === 2 ? state.trim().toUpperCase() : "KS",
      zip_code: (zipCode as string).trim(),
      preferred_dates: preferredDates && typeof preferredDates === "string" ? preferredDates.trim() || null : null,
      additional_notes: additionalNotes && typeof additionalNotes === "string" ? additionalNotes.trim() || null : null,
      photo_urls: Array.isArray(photoUrls) && photoUrls.length > 0 ? photoUrls : null,
      status: "pending_review",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
