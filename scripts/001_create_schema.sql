-- Nexus Operations Database Schema
-- This script creates all tables needed for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE (main user profile, linked to auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'homeowner' CHECK (role IN ('homeowner', 'contractor', 'admin', 'property_manager', 'manager')),
  company TEXT,
  bio TEXT,
  license_number TEXT,
  years_in_business INTEGER DEFAULT 0,
  service_categories TEXT[] DEFAULT '{}',
  photo_url TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_connect_account_id TEXT,
  stripe_connect_status TEXT DEFAULT 'pending' CHECK (stripe_connect_status IN ('pending', 'active', 'restricted')),
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HOMEOWNER PROFILES (extended profile for homeowners)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.homeowner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_contact_method TEXT DEFAULT 'email',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTRACTOR PROFILES (extended profile for contractors)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contractor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  service_area TEXT[],
  hourly_rate NUMERIC(10,2),
  availability JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROPERTY MANAGER PROFILES (extended profile for property managers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.property_manager_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  license_number TEXT,
  portfolio_size INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'KS',
  zip TEXT,
  property_type TEXT DEFAULT 'residential' CHECK (property_type IN ('residential', 'commercial', 'mixed')),
  unit_count INTEGER DEFAULT 1,
  square_footage INTEGER,
  year_built INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SERVICE REQUESTS TABLE (main requests from homeowners/property managers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  assigned_contractor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT,
  category TEXT NOT NULL,
  description TEXT,
  additional_notes TEXT,
  address TEXT,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  urgency TEXT DEFAULT 'standard' CHECK (urgency IN ('emergency', 'urgent', 'standard', 'low')),
  status TEXT DEFAULT 'pending_review' CHECK (status IN (
    'pending_review', 'in_queue', 'assigned', 'consultation_scheduled', 
    'in_progress', 'completed', 'declined', 'cancelled'
  )),
  photo_urls TEXT[] DEFAULT '{}',
  consultation_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  invoice_amount NUMERIC(10,2),
  invoice_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JOBS TABLE (alternative job tracking, linked to properties)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  urgency TEXT DEFAULT 'standard' CHECK (urgency IN ('emergency', 'urgent', 'standard', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
  )),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  estimated_cost NUMERIC(10,2),
  final_cost NUMERIC(10,2),
  notes TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JOB STATUS HISTORY (audit trail for job status changes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by TEXT
);

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  contractor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtotal NUMERIC(10,2) NOT NULL,
  nexus_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'sent', 'paid', 'overdue', 'cancelled')),
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  due_date DATE,
  paid_date TIMESTAMPTZ,
  notes TEXT,
  line_items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  payment_type TEXT CHECK (payment_type IN ('dispatch_fee', 'invoice', 'subscription', 'deposit')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_checkout_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BILLING SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('license', 'insurance', 'certificate', 'photo', 'invoice', 'contract', 'other')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  expires_at DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT,
  message TEXT,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error', 'job_update', 'message', 'payment')),
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_connect_account_id ON public.profiles(stripe_connect_account_id);

CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_owner_id ON public.service_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_contractor_id ON public.service_requests(assigned_contractor_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);

CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_contractor_id ON public.jobs(contractor_id);
CREATE INDEX IF NOT EXISTS idx_jobs_property_id ON public.jobs(property_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);

CREATE INDEX IF NOT EXISTS idx_invoices_contractor_id ON public.invoices(contractor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job_id ON public.invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_request_id ON public.payments(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON public.payments(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_job_id ON public.messages(job_id);
CREATE INDEX IF NOT EXISTS idx_messages_service_request_id ON public.messages(service_request_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homeowner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_manager_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id OR auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id OR auth.uid() = user_id);

-- Homeowner profiles policies
CREATE POLICY "homeowner_profiles_select_own" ON public.homeowner_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "homeowner_profiles_insert_own" ON public.homeowner_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "homeowner_profiles_update_own" ON public.homeowner_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Contractor profiles policies
CREATE POLICY "contractor_profiles_select_own" ON public.contractor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contractor_profiles_insert_own" ON public.contractor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contractor_profiles_update_own" ON public.contractor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Property manager profiles policies
CREATE POLICY "pm_profiles_select_own" ON public.property_manager_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pm_profiles_insert_own" ON public.property_manager_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pm_profiles_update_own" ON public.property_manager_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "properties_select_own" ON public.properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE USING (auth.uid() = owner_id);

-- Service requests policies (owner can see their own, contractor can see assigned + open)
CREATE POLICY "requests_select_owner" ON public.service_requests FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "requests_select_contractor" ON public.service_requests FOR SELECT USING (auth.uid() = assigned_contractor_id);
CREATE POLICY "requests_select_open" ON public.service_requests FOR SELECT USING (status IN ('pending_review', 'in_queue') AND assigned_contractor_id IS NULL);
CREATE POLICY "requests_insert_owner" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "requests_update_owner" ON public.service_requests FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = assigned_contractor_id);

-- Jobs policies
CREATE POLICY "jobs_select_client" ON public.jobs FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "jobs_select_contractor" ON public.jobs FOR SELECT USING (auth.uid() = contractor_id);
CREATE POLICY "jobs_insert_client" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "jobs_update_participant" ON public.jobs FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = contractor_id);

-- Job status history policies
CREATE POLICY "job_history_select" ON public.job_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_status_history.job_id AND (jobs.client_id = auth.uid() OR jobs.contractor_id = auth.uid()))
);

-- Invoices policies
CREATE POLICY "invoices_select_own" ON public.invoices FOR SELECT USING (auth.uid() = contractor_id OR auth.uid() = client_id);
CREATE POLICY "invoices_insert_contractor" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = contractor_id);
CREATE POLICY "invoices_update_own" ON public.invoices FOR UPDATE USING (auth.uid() = contractor_id OR auth.uid() = client_id);

-- Payments policies
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_update_own" ON public.payments FOR UPDATE USING (auth.uid() = user_id);

-- Billing subscriptions policies
CREATE POLICY "subscriptions_select_own" ON public.billing_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.billing_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.billing_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "documents_select_own" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_delete_own" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Messages policies (participants can see messages)
CREATE POLICY "messages_select_participant" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_insert_sender" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'homeowner')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- TRIGGER: Update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['profiles', 'homeowner_profiles', 'contractor_profiles', 'property_manager_profiles', 'properties', 'service_requests', 'jobs', 'invoices', 'payments', 'billing_subscriptions', 'documents'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I', tbl, tbl);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()', tbl, tbl);
  END LOOP;
END;
$$;
