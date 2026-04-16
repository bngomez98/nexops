type ApiErrorOptions = {
  code?: string
  details?: unknown
  requestId?: string
}

export function createRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Returns a JSON error response with a consistent `{ error }` shape. */
export function apiError(message: string, status: number, options?: ApiErrorOptions): Response {
  const body = JSON.stringify({
    error: message,
    ...(options?.code ? { code: options.code } : {}),
    ...(options?.details !== undefined ? { details: options.details } : {}),
    ...(options?.requestId ? { requestId: options.requestId } : {}),
  })
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (options?.requestId) headers['x-request-id'] = options.requestId
  return new Response(body, { status, headers })
}

/** 400 Bad Request */
export const badRequest = (msg: string, options?: ApiErrorOptions) => apiError(msg, 400, options)
/** 401 Unauthorized */
export const unauthorized = (msg = 'Unauthorized', options?: ApiErrorOptions) => apiError(msg, 401, options)
/** 403 Forbidden */
export const forbidden = (msg = 'Forbidden', options?: ApiErrorOptions) => apiError(msg, 403, options)
/** 404 Not Found */
export const notFound = (msg = 'Not found', options?: ApiErrorOptions) => apiError(msg, 404, options)
/** 500 Internal Server Error */
export const internalError = (msg = 'Internal server error', options?: ApiErrorOptions) => apiError(msg, 500, options)
