import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, company, licenseNumber } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    if (!["homeowner", "contractor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = store.findUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = store.createUser({
      email: email.toLowerCase().trim(),
      passwordHash: password, // plain for dev
      name,
      role,
      phone,
      company: role === "contractor" ? company : undefined,
      licenseNumber: role === "contractor" ? licenseNumber : undefined,
      membershipTier: role === "contractor" ? "standard" : undefined,
      membershipActive: role === "contractor" ? false : undefined,
    });

    const token = store.createSession(user.id);
    const cookie = setSessionCookie(token);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
