/**
 * Canonical Nexus Operations service categories.
 *
 * Used by:
 *  - /request form – category dropdown
 *  - Contractor onboarding – trade-category selection
 *  - /api/match – category scoring
 *  - /api/automation/categorize-request – normalising AI output
 *
 * Keep this in sync with the `service_categories` reference table in
 * scripts/017_nexus_business_model.sql.
 *
 * Serving region: Topeka, KS metro. Categories reflect the trades we
 * actively license, vet, and dispatch in that service area.
 */

export type ServiceCategorySlug =
  | 'plumbing'
  | 'hvac'
  | 'electrical'
  | 'roofing'
  | 'general-contracting'
  | 'carpentry'
  | 'painting'
  | 'flooring'
  | 'drywall'
  | 'concrete-masonry'
  | 'landscaping'
  | 'tree-service'
  | 'snow-removal'
  | 'gutter'
  | 'appliance-repair'
  | 'garage-door'
  | 'locksmith'
  | 'pest-control'
  | 'cleaning'
  | 'window-door'
  | 'insulation'
  | 'foundation'
  | 'water-damage'
  | 'mold-remediation'
  | 'handyman'
  | 'open-request'

export interface ServiceCategory {
  slug: ServiceCategorySlug
  label: string
  /** Trade group — drives contractor onboarding screens and admin analytics. */
  group:
    | 'mechanical'
    | 'exterior'
    | 'interior'
    | 'grounds'
    | 'restoration'
    | 'specialty'
    | 'general'
  /** Emergency-eligible: qualifies for the 30-min SLA tier. */
  emergencyEligible: boolean
  /** Requires proof of state license on file before dispatch. */
  requiresLicense: boolean
  /** Requires general liability insurance ≥ $1M on file. */
  requiresInsurance: boolean
  /** Default Nexus fee percentage override, if different from urgency-based default. */
  feeOverride?: number
  /** Short description shown in the request wizard. */
  description?: string
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // ── Mechanical trades ────────────────────────────────────────────
  { slug: 'plumbing',   label: 'Plumbing',   group: 'mechanical', emergencyEligible: true,  requiresLicense: true,  requiresInsurance: true,
    description: 'Leaks, burst pipes, water heaters, fixtures, drain cleaning.' },
  { slug: 'hvac',       label: 'HVAC',       group: 'mechanical', emergencyEligible: true,  requiresLicense: true,  requiresInsurance: true,
    description: 'Heating, cooling, furnace, AC, thermostats, ductwork.' },
  { slug: 'electrical', label: 'Electrical', group: 'mechanical', emergencyEligible: true,  requiresLicense: true,  requiresInsurance: true,
    description: 'Wiring, outlets, panels, lighting, code violations.' },

  // ── Exterior ─────────────────────────────────────────────────────
  { slug: 'roofing',              label: 'Roofing',               group: 'exterior', emergencyEligible: true,  requiresLicense: true,  requiresInsurance: true,
    description: 'Repairs, replacements, storm damage, leaks.' },
  { slug: 'gutter',               label: 'Gutters',               group: 'exterior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'window-door',          label: 'Windows & Doors',       group: 'exterior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'concrete-masonry',     label: 'Concrete & Masonry',    group: 'exterior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'foundation',           label: 'Foundation',            group: 'exterior', emergencyEligible: false, requiresLicense: true,  requiresInsurance: true },

  // ── Interior ─────────────────────────────────────────────────────
  { slug: 'general-contracting', label: 'General Contracting',   group: 'general',  emergencyEligible: false, requiresLicense: true,  requiresInsurance: true },
  { slug: 'carpentry',           label: 'Carpentry',             group: 'interior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'painting',            label: 'Painting',              group: 'interior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'flooring',            label: 'Flooring',              group: 'interior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'drywall',             label: 'Drywall',               group: 'interior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'insulation',          label: 'Insulation',            group: 'interior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'appliance-repair',    label: 'Appliance Repair',      group: 'interior', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'garage-door',         label: 'Garage Door',           group: 'interior', emergencyEligible: true,  requiresLicense: false, requiresInsurance: true },
  { slug: 'locksmith',           label: 'Locksmith',             group: 'specialty',emergencyEligible: true,  requiresLicense: true,  requiresInsurance: true },

  // ── Grounds ──────────────────────────────────────────────────────
  { slug: 'landscaping',   label: 'Landscaping',    group: 'grounds', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },
  { slug: 'tree-service',  label: 'Tree Service',   group: 'grounds', emergencyEligible: true,  requiresLicense: false, requiresInsurance: true,
    description: 'Fallen-tree removal qualifies for emergency SLA.' },
  { slug: 'snow-removal',  label: 'Snow Removal',   group: 'grounds', emergencyEligible: true,  requiresLicense: false, requiresInsurance: true },

  // ── Restoration ──────────────────────────────────────────────────
  { slug: 'water-damage',     label: 'Water Damage Restoration', group: 'restoration', emergencyEligible: true, requiresLicense: true,  requiresInsurance: true, feeOverride: 0.30 },
  { slug: 'mold-remediation', label: 'Mold Remediation',         group: 'restoration', emergencyEligible: false, requiresLicense: true,  requiresInsurance: true, feeOverride: 0.30 },

  // ── Specialty ────────────────────────────────────────────────────
  { slug: 'pest-control', label: 'Pest Control',  group: 'specialty', emergencyEligible: false, requiresLicense: true,  requiresInsurance: true },
  { slug: 'cleaning',     label: 'Cleaning',      group: 'specialty', emergencyEligible: false, requiresLicense: false, requiresInsurance: false },
  { slug: 'handyman',     label: 'Handyman',      group: 'specialty', emergencyEligible: false, requiresLicense: false, requiresInsurance: true },

  // ── Open / Other ────────────────────────────────────────────────
  { slug: 'open-request', label: 'Not Sure — Let Us Decide', group: 'general', emergencyEligible: false, requiresLicense: false, requiresInsurance: false,
    description: 'Describe the problem; our dispatcher will route to the right trade.' },
]

const BY_SLUG = new Map(SERVICE_CATEGORIES.map(c => [c.slug, c]))

export function getServiceCategory(slug: string): ServiceCategory | undefined {
  return BY_SLUG.get(slug as ServiceCategorySlug)
}

export function isValidCategorySlug(slug: string): slug is ServiceCategorySlug {
  return BY_SLUG.has(slug as ServiceCategorySlug)
}

/** Categories shown in the public request wizard (excludes 'open-request' marker). */
export function getSelectableCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter(c => c.slug !== 'open-request')
}

/** Categories eligible for the 30-minute emergency SLA. */
export function getEmergencyEligibleCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter(c => c.emergencyEligible)
}
