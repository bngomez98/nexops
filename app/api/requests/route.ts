import { NextRequest, NextResponse } from "next/server"
import { getSession, getUserById, getRequestsForHomeowner, addRequest } from "@/lib/store"

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
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const requests = getRequestsForHomeowner(user.id)
  return NextResponse.json({ requests })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { service, description, budget, address, photos, consultationWindow } = body as {
      service: string
      description: string
      budget: string
      address: string
      photos: number
      consultationWindow?: string
    }

    if (!service || !description || !budget || !address) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const request = addRequest(user.id, {
      homeownerId: user.id,
      service,
      description,
      budget,
      address,
      photos: photos ?? 0,
      consultationWindow,
    })

    return NextResponse.json({ request }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
