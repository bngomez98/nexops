-- NexOps Core Database Schema
-- This script creates all core tables with proper relationships and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('homeowner', 'contractor', 'property_manager', 'admin')),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_connect_id TEXT,
  stripe_connect_onboarded BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_plan TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (TRUE);

-- ============================================
-- HOMEOWNER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.homeowner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.homeowner_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "homeowner_profiles_select_own" ON public.homeowner_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "homeowner_profiles_insert_own" ON public.homeowner_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "homeowner_profiles_update_own" ON public.homeowner_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "homeowner_profiles_delete_own" ON public.homeowner_profiles FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CONTRACTOR PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.contractor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  license_number TEXT,
  insurance_info TEXT,
  service_categories TEXT[] DEFAULT '{}',
  service_radius_miles INTEGER DEFAULT 25,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contractor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contractor_profiles_select_all" ON public.contractor_profiles FOR SELECT USING (TRUE);
CREATE POLICY "contractor_profiles_insert_own" ON public.contractor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contractor_profiles_update_own" ON public.contractor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contractor_profiles_delete_own" ON public.contractor_profiles FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PROPERTY MANAGER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.property_manager_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  license_number TEXT,
  properties_managed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_manager_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pm_profiles_select_own" ON public.property_manager_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pm_profiles_insert_own" ON public.property_manager_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pm_profiles_update_own" ON public.property_manager_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pm_profiles_delete_own" ON public.property_manager_profiles FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  property_type TEXT CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'commercial', 'other')),
  square_feet INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  year_built INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_select_own" ON public.properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE USING (auth.uid() = owner_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);

-- ============================================
-- SERVICE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'matching', 'matched', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  preferred_date DATE,
  preferred_time TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  photo_urls TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_requests_select_own" ON public.service_requests FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "service_requests_insert_own" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "service_requests_update_own" ON public.service_requests FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "service_requests_delete_own" ON public.service_requests FOR DELETE USING (auth.uid() = client_id);
CREATE POLICY "service_requests_select_contractors" ON public.service_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'contractor')
);

CREATE INDEX IF NOT EXISTS idx_service_requests_client ON public.service_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  service_type TEXT NOT NULL,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'matching', 'matched', 'scheduled', 'in_progress', 'completed', 'cancelled', 'disputed', 'unmatched')) DEFAULT 'pending',
  scheduled_date DATE,
  scheduled_time TEXT,
  completed_at TIMESTAMPTZ,
  amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  contractor_payout DECIMAL(10,2),
  photo_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_involved" ON public.jobs FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = contractor_id
);
CREATE POLICY "jobs_insert_client" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "jobs_update_involved" ON public.jobs FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() = contractor_id
);

CREATE INDEX IF NOT EXISTS idx_jobs_client ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_contractor ON public.jobs(contractor_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);

-- ============================================
-- JOB STATUS HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_history_select" ON public.job_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND (client_id = auth.uid() OR contractor_id = auth.uid()))
);
CREATE POLICY "job_history_insert" ON public.job_status_history FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')) DEFAULT 'pending',
  response_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, contractor_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select_involved" ON public.matches FOR SELECT USING (
  auth.uid() = contractor_id OR 
  EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND client_id = auth.uid())
);
CREATE POLICY "matches_insert" ON public.matches FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "matches_update_contractor" ON public.matches FOR UPDATE USING (auth.uid() = contractor_id);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded')) DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  line_items JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select_involved" ON public.invoices FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = contractor_id
);
CREATE POLICY "invoices_insert_contractor" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = contractor_id);
CREATE POLICY "invoices_update_involved" ON public.invoices FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() = contractor_id
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_contractor ON public.invoices(contractor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  payer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2),
  payment_type TEXT CHECK (payment_type IN ('job_payment', 'subscription', 'refund', 'payout', 'dispatch_fee')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_involved" ON public.payments FOR SELECT USING (
  auth.uid() = payer_id OR auth.uid() = payee_id
);
CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_payments_payer ON public.payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee ON public.payments(payee_id);

-- ============================================
-- BILLING SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan_id TEXT,
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')) DEFAULT 'incomplete',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.billing_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert" ON public.billing_subscriptions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "subscriptions_update" ON public.billing_subscriptions FOR UPDATE USING (TRUE);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.billing_subscriptions(user_id);
