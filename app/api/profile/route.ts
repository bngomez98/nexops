import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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

  const body = await req.json()
  const { businessName, licenseNumber, insuranceCarrier, bio, serviceRadius, selectedCategories } = body

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      business_name: businessName ?? null,
      license_number: licenseNumber ?? null,
      insurance_carrier: insuranceCarrier ?? null,
      bio: bio ?? null,
      service_radius: serviceRadius ? parseInt(serviceRadius, 10) : null,
      service_categories: selectedCategories ?? [],
      updated_at: new Date().toISOString(),
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
