import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { clearSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    store.deleteSession(token);
  }

  const cookie = clearSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);
  return response;
}
