import { describe, expect, it } from "vitest"
import { isMissingServiceRequestsTableError } from "./errors"

describe("isMissingServiceRequestsTableError", () => {
  it("matches schema-cache errors for public.service_requests", () => {
    expect(
      isMissingServiceRequestsTableError({
        code: "PGRST205",
        message: "Could not find the table 'public.service_requests' in the schema cache",
      }),
    ).toBe(true)
  })

  it("does not match unrelated errors", () => {
    expect(
      isMissingServiceRequestsTableError({
        code: "42501",
        message: "permission denied",
      }),
    ).toBe(false)
  })
})
