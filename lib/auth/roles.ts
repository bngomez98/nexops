export const OWNER_REQUEST_ROLES = ["homeowner", "property_manager"] as const

export function canSubmitServiceRequest(role: string | null | undefined): boolean {
  return OWNER_REQUEST_ROLES.includes((role ?? "homeowner") as (typeof OWNER_REQUEST_ROLES)[number])
}
