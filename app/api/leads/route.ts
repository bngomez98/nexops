import { NextRequest, NextResponse } from "next/server"
import { getSession, getUserById, getLeadsForContractor } from "@/lib/store"

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
