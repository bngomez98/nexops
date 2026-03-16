import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "contractor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const leads = store.getOpenRequests();
  return NextResponse.json({ leads });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "contractor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { requestId } = body;

  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const updated = store.claimRequest(requestId, user.id);
  if (!updated) {
    return NextResponse.json({ error: "Request not found or already claimed" }, { status: 409 });
  }

  return NextResponse.json({ request: updated });
}
