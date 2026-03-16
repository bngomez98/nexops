import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role === "homeowner") {
    const requests = store.getRequestsByHomeowner(user.id);
    return NextResponse.json({ requests });
  }

  if (user.role === "contractor") {
    const claimed = store.getClaimedByContractor(user.id);
    return NextResponse.json({ requests: claimed });
  }

  return NextResponse.json({ requests: [] });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "homeowner") {
    return NextResponse.json({ error: "Only homeowners can submit requests" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, category, maxBudget, address, city, state, zip } = body;

  if (!title || !description || !category || !maxBudget || !address || !city || !state || !zip) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const newRequest = store.createRequest({
    homeownerId: user.id,
    homeownerName: user.name,
    title,
    description,
    category,
    maxBudget: Number(maxBudget),
    address,
    city,
    state,
    zip,
    photos: [],
    status: "open",
  });

  return NextResponse.json({ request: newRequest }, { status: 201 });
}
