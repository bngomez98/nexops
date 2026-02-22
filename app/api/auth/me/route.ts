import { NextRequest, NextResponse } from "next/server"
import { getSession, getUserById, toSafeUser } from "@/lib/store"

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get("nexops_session")?.value

  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const userId = await getSession(sessionToken)
  if (!userId) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 })
  }

  const user = await getUserById(userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user: toSafeUser(user) })
}
