import { cookies } from "next/headers";
import { store, type User } from "./store";

const SESSION_COOKIE = "nexops_session";

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = store.getUserIdBySession(token);
  if (!userId) return null;

  return store.findUserById(userId) ?? null;
}

export async function requireAuth(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: "homeowner" | "contractor"): Promise<User> {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}

export function setSessionCookie(token: string): { name: string; value: string; options: object } {
  return {
    name: SESSION_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  };
}

export function clearSessionCookie(): { name: string; value: string; options: object } {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    },
  };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
