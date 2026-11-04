-- ==============================================================================
-- SCHEMA DEFINITION: admission_users TABLE FOR MANUAL USER MANAGEMENT
-- Run this script inside your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Create table admission_users
CREATE TABLE IF NOT EXISTS public.admission_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'AC' CHECK (role IN ('Owner', 'AC', 'BM')),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 2. Index on email for fast login lookup
CREATE INDEX IF NOT EXISTS idx_admission_users_email ON public.admission_users(email);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.admission_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read for authentication" ON public.admission_users;
CREATE POLICY "Allow read for authentication" 
ON public.admission_users 
FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow modify users" ON public.admission_users;
CREATE POLICY "Allow modify users" 
ON public.admission_users 
FOR ALL 
TO authenticated 
USING (true);

-- 4. Sample Users (Anda bisa edit atau tambah langsung via Supabase Table Editor)
INSERT INTO public.admission_users (email, password, name, role) 
VALUES 
    ('owner@revou.co', 'revou-owner-2026', 'Lead Admission', 'Owner'),
    ('budi@revou.co', 'budi123', 'Budi Santoso', 'AC'),
    ('anita@revou.co', 'anita123', 'Anita Wijaya', 'BM')
ON CONFLICT (email) DO NOTHING;

-- 5. Force Supabase PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
