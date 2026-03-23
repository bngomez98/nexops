type SupabaseLikeError = {
  code?: string | null
  message?: string | null
}

// These messages are specific to Supabase/PostgreSQL error formats and may need
// updating if Supabase changes its error message wording in future versions.
const MISSING_SERVICE_REQUESTS_MESSAGES = [
  "Could not find the table 'public.service_requests' in the schema cache",
  'relation "public.service_requests" does not exist',
  'relation "service_requests" does not exist',
]

export function isMissingServiceRequestsTableError(error: SupabaseLikeError | null | undefined) {
  if (!error) return false

  if (error.code === "PGRST205" || error.code === "42P01") {
    return true
  }

  return MISSING_SERVICE_REQUESTS_MESSAGES.some((message) => error.message?.includes(message))
}
