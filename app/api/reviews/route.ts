import { NextRequest, NextResponse } from "next/server"
import {
  getSession,
  getUserById,
  getReviewsForHomeowner,
  getReviewByRequestId,
  createReview,
  seedIfEmpty,
} from "@/lib/store"

async function getAuthUser(req: NextRequest) {
  const sessionToken = req.cookies.get("nexops_session")?.value
  if (!sessionToken) return null
  const userId = await getSession(sessionToken)
  if (!userId) return null
  return getUserById(userId)
}

// GET /api/reviews — returns all reviews for the authenticated homeowner,
// or checks if a specific request already has a review (?requestId=...)
export async function GET(req: NextRequest) {
  await seedIfEmpty()

  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const requestId = searchParams.get("requestId")

  if (requestId) {
    const review = await getReviewByRequestId(requestId)
    return NextResponse.json({ review: review ?? null })
  }

  const reviews = await getReviewsForHomeowner(user.id)
  return NextResponse.json({ reviews })
}

// POST /api/reviews — submit a Post Implementation Review for a completed request
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const {
      requestId,
      contractorId,
      contractorName,
      service,
      overallRating,
      qualityRating,
      timelinessRating,
      communicationRating,
      whatWentWell,
      improvements,
      wouldRecommend,
      nextMaintenanceNeeds,
    } = body as {
      requestId: string
      contractorId?: string
      contractorName?: string
      service: string
      overallRating: number
      qualityRating: number
      timelinessRating: number
      communicationRating: number
      whatWentWell?: string
      improvements?: string
      wouldRecommend: boolean
      nextMaintenanceNeeds?: string
    }

    if (!requestId || !service) {
      return NextResponse.json({ error: "requestId and service are required" }, { status: 400 })
    }

    const ratingFields = [overallRating, qualityRating, timelinessRating, communicationRating]
    for (const r of ratingFields) {
      if (typeof r !== "number" || r < 1 || r > 5) {
        return NextResponse.json({ error: "Ratings must be integers between 1 and 5" }, { status: 400 })
      }
    }

    // Prevent duplicate reviews
    const existing = await getReviewByRequestId(requestId)
    if (existing) {
      return NextResponse.json({ error: "A review already exists for this request" }, { status: 409 })
    }

    const review = await createReview(user.id, {
      requestId,
      contractorId,
      contractorName,
      service,
      overallRating,
      qualityRating,
      timelinessRating,
      communicationRating,
      whatWentWell,
      improvements,
      wouldRecommend: wouldRecommend ?? true,
      nextMaintenanceNeeds,
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
