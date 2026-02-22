import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, createSession, toSafeUser, seedIfEmpty } from "@/lib/store"

export async function POST(req: NextRequest) {
  try {
    await seedIfEmpty()

    const body = await req.json()
    const { email, password } = body as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const sessionToken = await createSession(user.id)
    const safeUser = toSafeUser(user)

    const response = NextResponse.json({ user: safeUser })
    response.cookies.set("nexops_session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
