import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/store"

export async function POST(req) {
  const sessionToken = req.cookies.get("nexops_session")?.value

  if (sessionToken) {
    await deleteSession(sessionToken)
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set("nexops_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
