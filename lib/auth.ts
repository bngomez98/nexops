import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { getUserById, getSessionById, createSession, deleteSession } from './db'

const SESSION_COOKIE_NAME = 'nexus-session'
const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  })
}

export async function getSessionFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null
}

export async function getCurrentUser() {
  try {
    const sessionId = await getSessionFromCookie()
    if (!sessionId) {
      return null
    }

    const session = await getSessionById(sessionId)
    if (!session) {
      return null
    }

    const user = await getUserById(session.userId)
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function logout(): Promise<void> {
  const sessionId = await getSessionFromCookie()
  if (sessionId) {
    await deleteSession(sessionId)
  }
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
