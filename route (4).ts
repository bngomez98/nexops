import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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
    .from("profiles")
    .select("business_name, license_number, insurance_carrier, bio, service_radius, service_categories")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? {})
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { businessName, licenseNumber, insuranceCarrier, bio, serviceRadius, selectedCategories } = body

  // Validate serviceRadius if provided
  let serviceRadiusNum: number | null = null
  if (serviceRadius !== undefined && serviceRadius !== null && serviceRadius !== "") {
    serviceRadiusNum = parseInt(String(serviceRadius), 10)
    if (isNaN(serviceRadiusNum) || serviceRadiusNum < 1 || serviceRadiusNum > 200) {
      return NextResponse.json({ error: "Service radius must be between 1 and 200 miles" }, { status: 400 })
    }
  }

  // Validate selectedCategories if provided
  if (selectedCategories !== undefined && selectedCategories !== null) {
    if (!Array.isArray(selectedCategories) || selectedCategories.some((c) => !VALID_CATEGORIES.has(c))) {
      return NextResponse.json({ error: "Invalid service categories" }, { status: 400 })
    }
  }

  // Validate string field lengths
  if (businessName && typeof businessName === "string" && businessName.length > 200) {
    return NextResponse.json({ error: "Business name must be 200 characters or fewer" }, { status: 400 })
  }
  if (bio && typeof bio === "string" && bio.length > 2000) {
    return NextResponse.json({ error: "Bio must be 2000 characters or fewer" }, { status: 400 })
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      business_name: businessName && typeof businessName === "string" ? businessName.trim() || null : null,
      license_number: licenseNumber && typeof licenseNumber === "string" ? licenseNumber.trim() || null : null,
      insurance_carrier: insuranceCarrier && typeof insuranceCarrier === "string" ? insuranceCarrier.trim() || null : null,
      bio: bio && typeof bio === "string" ? bio.trim() || null : null,
      service_radius: serviceRadiusNum,
      service_categories: Array.isArray(selectedCategories) ? selectedCategories : [],
      updated_at: new Date().toISOString(),
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
