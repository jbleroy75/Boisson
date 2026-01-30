-- ==========================================
-- TAMARQUE Security Database Schema
-- Run this migration in Supabase SQL Editor
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- AUDIT LOGS TABLE
-- Tracks security-relevant events
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  resource TEXT,
  resource_id TEXT,
  details JSONB,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ==========================================
-- PASSWORD RESET TOKENS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- ==========================================
-- LOGIN ATTEMPTS TABLE
-- Tracks failed login attempts for rate limiting
-- ==========================================

CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at DESC);

-- Clean up old login attempts (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- USER SESSIONS TABLE
-- For session invalidation support
-- ==========================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  invalidated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ==========================================
-- GDPR DATA REQUESTS TABLE
-- Tracks data export and deletion requests
-- ==========================================

CREATE TABLE IF NOT EXISTS gdpr_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'delete')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gdpr_requests_user_id ON gdpr_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_status ON gdpr_requests(status);

-- ==========================================
-- COOKIE CONSENTS TABLE
-- GDPR cookie consent tracking
-- ==========================================

CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  anonymous_id TEXT, -- For non-logged-in users
  necessary BOOLEAN NOT NULL DEFAULT true,
  analytics BOOLEAN NOT NULL DEFAULT false,
  marketing BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cookie_consents_user_id ON cookie_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_anonymous_id ON cookie_consents(anonymous_id);

-- ==========================================
-- SUBSCRIPTIONS TABLE (if not exists)
-- ==========================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  tier_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'canceling', 'trialing')),
  flavor_mix JSONB,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ==========================================
-- PENDING SUBSCRIPTIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS pending_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  tier_id TEXT NOT NULL,
  flavor_mix JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pending_subscriptions_session ON pending_subscriptions(stripe_session_id);

-- ==========================================
-- SUBSCRIPTION PAYMENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_subscription_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  invoice_url TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_payments_sub_id ON subscription_payments(stripe_subscription_id);

-- ==========================================
-- B2B CONTACT REQUESTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS b2b_contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  siret TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  region TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_contact_email ON b2b_contact_requests(email);
CREATE INDEX IF NOT EXISTS idx_b2b_contact_status ON b2b_contact_requests(status);

-- ==========================================
-- LOYALTY POINTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);

-- ==========================================
-- LOYALTY TRANSACTIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'expire', 'bonus')),
  description TEXT,
  order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_type ON loyalty_transactions(type);

-- ==========================================
-- UPDATE USERS TABLE
-- Add security-related columns
-- ==========================================

DO $$
BEGIN
  -- Add last_login column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
    ALTER TABLE users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add email_verified column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
    ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;

  -- Add two_factor_enabled column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'two_factor_enabled') THEN
    ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false;
  END IF;

  -- Add two_factor_secret column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'two_factor_secret') THEN
    ALTER TABLE users ADD COLUMN two_factor_secret TEXT;
  END IF;
END $$;

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role has full access to users" ON users;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Service role has full access to users" ON users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Distributors policies
DROP POLICY IF EXISTS "Distributors can view own profile" ON distributors;
DROP POLICY IF EXISTS "Distributors can update own profile" ON distributors;
DROP POLICY IF EXISTS "Service role has full access to distributors" ON distributors;

CREATE POLICY "Distributors can view own profile" ON distributors
  FOR SELECT
  USING (user_id::text = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Distributors can update own profile" ON distributors
  FOR UPDATE
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Service role has full access to distributors" ON distributors
  FOR ALL
  USING (auth.role() = 'service_role');

-- B2B Orders policies
DROP POLICY IF EXISTS "Distributors can view own orders" ON b2b_orders;
DROP POLICY IF EXISTS "Distributors can insert orders" ON b2b_orders;
DROP POLICY IF EXISTS "Service role has full access to b2b_orders" ON b2b_orders;

CREATE POLICY "Distributors can view own orders" ON b2b_orders
  FOR SELECT
  USING (
    distributor_id IN (
      SELECT id FROM distributors WHERE user_id::text = auth.uid()::text
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY "Distributors can insert orders" ON b2b_orders
  FOR INSERT
  WITH CHECK (
    distributor_id IN (
      SELECT id FROM distributors WHERE user_id::text = auth.uid()::text AND approved = true
    )
  );

CREATE POLICY "Service role has full access to b2b_orders" ON b2b_orders
  FOR ALL
  USING (auth.role() = 'service_role');

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT
  USING (user_id::text = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Service role has full access to subscriptions" ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Loyalty policies
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "Service role has full access to loyalty_points" ON loyalty_points;

CREATE POLICY "Users can view own loyalty points" ON loyalty_points
  FOR SELECT
  USING (user_id::text = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Service role has full access to loyalty_points" ON loyalty_points
  FOR ALL
  USING (auth.role() = 'service_role');

-- Audit logs - admin only (via service role)
CREATE POLICY "Service role has full access to audit_logs" ON audit_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- GDPR requests - users can view own requests
CREATE POLICY "Users can view own gdpr requests" ON gdpr_requests
  FOR SELECT
  USING (user_id::text = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Service role has full access to gdpr_requests" ON gdpr_requests
  FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = user_id AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to update user last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- CLEANUP FUNCTION FOR OLD DATA
-- Run periodically via Supabase scheduled jobs
-- ==========================================

CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete expired password reset tokens
  DELETE FROM password_reset_tokens WHERE expires_at < NOW();

  -- Delete old login attempts (keep 30 days)
  DELETE FROM login_attempts WHERE created_at < NOW() - INTERVAL '30 days';

  -- Delete expired/invalidated sessions (keep 7 days after expiry)
  DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '7 days';

  -- Delete old audit logs (keep 1 year)
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

  -- Delete completed GDPR requests older than 90 days
  DELETE FROM gdpr_requests
  WHERE status = 'completed' AND completed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE audit_logs IS 'Security audit trail for compliance and debugging';
COMMENT ON TABLE password_reset_tokens IS 'Secure password reset tokens with expiry';
COMMENT ON TABLE login_attempts IS 'Track login attempts for rate limiting and security';
COMMENT ON TABLE user_sessions IS 'Track active sessions for invalidation support';
COMMENT ON TABLE gdpr_requests IS 'GDPR data export and deletion requests';
COMMENT ON TABLE cookie_consents IS 'GDPR cookie consent tracking';
