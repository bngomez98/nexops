/**
 * Database schema types for Nexus Operations
 *
 * These types match the database schema defined in scripts/setup.sql
 * and provide type safety for database queries throughout the application.
 */

// ============================================================
// ENUM TYPES
// ============================================================

export type ProfileRole = 'homeowner' | 'property_manager' | 'contractor' | 'admin'

export type StripeConnectStatus = 'pending' | 'active' | 'restricted'

export type SubscriptionPlanType = 'contractor' | 'owner'

export type SubscriptionStatus =
  | 'inactive'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'

export type ServiceRequestStatus =
  | 'pending_review'
  | 'in_queue'
  | 'assigned'
  | 'consultation_scheduled'
  | 'in_progress'
  | 'completed'
  | 'declined'
  | 'cancelled'

export type DocumentStatus = 'pending' | 'approved' | 'rejected'

export type JobUrgency = 'routine' | 'urgent' | 'emergency'

export type JobStatus =
  | 'open'
  | 'unmatched'
  | 'matched'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// ============================================================
// TABLE TYPES
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: ProfileRole
  photo_url: string | null
  stripe_customer_id: string | null
  stripe_connect_account_id: string | null
  stripe_connect_onboarding_complete: boolean
  stripe_connect_status: StripeConnectStatus | null
  created_at: string
  updated_at: string
}

export interface ContractorProfile {
  id: string
  user_id: string
  trade_categories: string[]
  bio: string | null
  service_radius_miles: number
  hourly_rate_cents: number | null
  years_experience: number | null
  license_number: string | null
  insurance_provider: string | null
  insurance_policy_number: string | null
  insurance_expiry: string | null
  is_available: boolean
  rating_avg: number | null
  rating_count: number
  max_active_jobs: number
  created_at: string
  updated_at: string
}

export interface HomeownerProfile {
  id: string
  user_id: string
  properties_count: number
  created_at: string
  updated_at: string
}

export interface PropertyManagerProfile {
  id: string
  user_id: string
  company_name: string | null
  properties_managed: number
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  owner_id: string
  address: string
  city: string
  state: string
  zip_code: string
  zip: string | null  // legacy alias
  lat: number | null
  lng: number | null
  nickname: string | null
  created_at: string
}

export interface Document {
  id: string
  user_id: string
  document_type: string
  file_url: string
  file_name: string
  status: DocumentStatus
  uploaded_at: string
  expiry_date: string | null
  verified_at: string | null
  verified_by: string | null
  notes: string | null
}

export interface ServiceRequest {
  id: string
  owner_id: string | null  // nullable for anonymous submissions
  assigned_contractor_id: string | null
  property_id: string | null
  title: string
  description: string
  category: string
  custom_category: string | null
  status: ServiceRequestStatus
  urgency: JobUrgency
  budget_range_min: number | null
  budget_range_max: number | null
  preferred_date: string | null
  location: string
  photo_urls: string[]
  submission_token: string | null  // for anonymous tracking
  pipeline_mode: 'standard' | 'automated' | 'community'
  community_visible: boolean
  access_requirements: string | null
  sla_breached: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  job_id: string
  sender_id: string
  recipient_id: string
  content: string
  read_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link: string | null
  read_at: string | null
  created_at: string
}

export interface Payment {
  id: string
  job_id: string
  invoice_id: string | null
  payer_id: string
  contractor_id: string
  amount_cents: number
  status: PaymentStatus
  stripe_payment_intent_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  request_id: string | null
  client_id: string
  contractor_id: string | null
  title: string
  description: string
  category: string
  status: JobStatus
  urgency: JobUrgency
  budget_cents: number | null
  completion_date: string | null
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  job_id: string
  contractor_id: string
  score: number
  distance_miles: number | null
  matched_at: string
  accepted_at: string | null
  declined_at: string | null
  reason: string | null
}

export interface JobStatusHistory {
  id: string
  job_id: string
  from_status: string | null
  to_status: string
  changed_by: string | null
  notes: string | null
  changed_at: string
}

export interface Invoice {
  id: string
  job_id: string
  contractor_id: string
  client_id: string
  line_items: Array<{
    description: string
    quantity: number
    unit_price_cents: number
    amount: number
  }>
  subtotal: number
  nexus_fee: number
  total: number
  status: InvoiceStatus
  due_date: string
  paid_at: string | null
  stripe_invoice_id: string | null
  created_at: string
  updated_at: string
}

export interface BillingSubscription {
  id: string
  user_id: string
  plan_type: SubscriptionPlanType
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at: string | null
  canceled_at: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  job_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface ContractorAvailability {
  id: string
  contractor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface StripeEvent {
  id: string
  event_id: string
  event_type: string
  processed_at: string
  payload: Record<string, unknown>
}

export interface ServiceCategory {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

// ============================================================
// DATABASE VIEWS & FUNCTIONS RETURN TYPES
// ============================================================

export interface ContractorWithDistance {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  trade_categories: string[]
  service_radius_miles: number
  rating_avg: number | null
  rating_count: number
  distance_miles: number
  score: number
}

// ============================================================
// UTILITY TYPES
// ============================================================

export type InsertProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type UpdateProfile = Partial<InsertProfile>

export type InsertServiceRequest = Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>
export type UpdateServiceRequest = Partial<InsertServiceRequest>

export type InsertInvoice = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>
export type UpdateInvoice = Partial<InsertInvoice>

export type InsertJob = Omit<Job, 'id' | 'created_at' | 'updated_at'>
export type UpdateJob = Partial<InsertJob>

export type InsertProperty = Omit<Property, 'id' | 'created_at'>
export type UpdateProperty = Partial<InsertProperty>
