import { NextRequest, NextResponse } from "next/server"
import { getSession, getUserById, getLeadsForContractor, updateLeadStatus } from "@/lib/store"

function getAuthUser(req: NextRequest) {
  const sessionToken = req.cookies.get("nexops_session")?.value
  if (!sessionToken) return null
  const userId = getSession(sessionToken)
  if (!userId) return null
  return getUserById(userId)
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "contractor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const leads = getLeadsForContractor(user.id)
  return NextResponse.json({ leads })
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "contractor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { leadId, status, notes } = body as { leadId: string; status: string; notes?: string }

    if (!leadId || !status) {
      return NextResponse.json({ error: "leadId and status are required" }, { status: 400 })
    }

    const validStatuses = ["new", "contacted", "scheduled", "won", "lost"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = updateLeadStatus(
      user.id,
      leadId,
      status as "new" | "contacted" | "scheduled" | "won" | "lost",
      notes,
    )
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ lead: updated })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
