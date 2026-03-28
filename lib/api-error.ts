import { NextResponse } from 'next/server'

/** Returns a JSON error response with a consistent `{ error }` shape. */
export function apiError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

/** 400 Bad Request */
export const badRequest = (msg: string) => apiError(msg, 400)
/** 401 Unauthorized */
export const unauthorized = (msg = 'Unauthorized') => apiError(msg, 401)
/** 403 Forbidden */
export const forbidden = (msg = 'Forbidden') => apiError(msg, 403)
/** 404 Not Found */
export const notFound = (msg = 'Not found') => apiError(msg, 404)
/** 500 Internal Server Error */
export const internalError = (msg = 'Internal server error') => apiError(msg, 500)
