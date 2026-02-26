import { NextResponse } from "next/server"
import { getSession, getUserById, getRequestsForHomeowner, addRequest, updateRequestStatus, seedIfEmpty } from "@/lib/store"
import { isFullSentences } from "@/lib/utils"

async function getAuthUser(req) {
  const sessionToken = req.cookies.get("nexops_session")?.value
  if (!sessionToken) return null
  const userId = await getSession(sessionToken)
  if (!userId) return null
  return getUserById(userId)
}

export async function GET(req) {
  await seedIfEmpty()

  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const requests = await getRequestsForHomeowner(user.id)
  return NextResponse.json({ requests })
}

export async function POST(req) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { service, description, budget, address, photos, consultationWindow } = body

    if (!service || !description || !budget || !address) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    if (!isFullSentences(description)) {
      return NextResponse.json(
        { error: "Project description must be written in full sentences. Start each sentence with a capital letter and end it with a period, exclamation mark, or question mark." },
        { status: 422 }
      )
    }

    const request = await addRequest(user.id, {
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

export async function PATCH(req) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { requestId, status } = body

    if (!requestId || !status) {
      return NextResponse.json({ error: "requestId and status are required" }, { status: 400 })
    }

    const validStatuses = ["pending", "matched", "in_progress", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await updateRequestStatus(user.id, requestId, status)
    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ request: updated })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
