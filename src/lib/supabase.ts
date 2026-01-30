import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (with service role for admin operations)
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ===========================================
// Database Schema (run this in Supabase SQL Editor)
// ===========================================
/*
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'distributor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distributors table
CREATE TABLE distributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  siret TEXT NOT NULL,
  region TEXT NOT NULL,
  billing_address TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- B2B Orders table
CREATE TABLE b2b_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distributor_id UUID REFERENCES distributors(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Users: users can only read/update their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Distributors: distributors can view/update their own profile
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Distributors can view own profile" ON distributors
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Distributors can update own profile" ON distributors
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- B2B Orders: distributors can view their own orders
ALTER TABLE b2b_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Distributors can view own orders" ON b2b_orders
  FOR SELECT USING (
    distributor_id IN (
      SELECT id FROM distributors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Distributors can insert orders" ON b2b_orders
  FOR INSERT WITH CHECK (
    distributor_id IN (
      SELECT id FROM distributors WHERE user_id::text = auth.uid()::text AND approved = true
    )
  );

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_distributors_user_id ON distributors(user_id);
CREATE INDEX idx_b2b_orders_distributor_id ON b2b_orders(distributor_id);
CREATE INDEX idx_b2b_orders_status ON b2b_orders(status);
*/
