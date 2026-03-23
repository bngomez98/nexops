export type RequestLike = {
  description?: string | null
  additional_notes?: string | null
}

const TEMPLATE_MARKERS = [
  /\[(template|sample|demo|mock)\]/i,
  /\b(template|sample|demo|mock)\s+(request|job)\b/i,
  /\b(seed(ed)?|placeholder)\b/i,
]

export function isTemplatedRequest(request: RequestLike) {
  const haystack = `${request.description ?? ""} ${request.additional_notes ?? ""}`.trim()
  if (!haystack) return false

  return TEMPLATE_MARKERS.some((pattern) => pattern.test(haystack))
}
