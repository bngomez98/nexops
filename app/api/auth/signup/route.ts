import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail, createUser, createSession, toSafeUser, hashNewPassword } from "@/lib/store"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      password,
      name,
      role,
      phone,
      businessName,
      licenseNumber,
      serviceCategories,
      subscription,
      address,
    } = body as {
      email: string
      password: string
      name: string
      role: "homeowner" | "contractor"
      phone?: string
      businessName?: string
      licenseNumber?: string
      serviceCategories?: string[]
      subscription?: "basic" | "premium" | "elite"
      address?: string
    }

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const user = createUser({
      email: email.toLowerCase(),
      passwordHash: hashNewPassword(password),
      name,
      role,
      phone,
      businessName,
      licenseNumber,
      serviceCategories,
      subscription,
      address,
    })

    const sessionToken = createSession(user.id)
    const safeUser = toSafeUser(user)

    const response = NextResponse.json({ user: safeUser }, { status: 201 })
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
