-- ==============================================================================
-- SCHEMA DEFINITION: admission_activity_logs & ANALYTICS VIEWS
-- Run this script inside your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Create table admission_activity_logs
CREATE TABLE IF NOT EXISTS public.admission_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL DEFAULT 'AC', -- 'Owner', 'AC', 'BM'
    user_email VARCHAR(150),
    action_type VARCHAR(50) NOT NULL, -- 'generate', 'copy_script', 'clarify', 'view_comparison', 'view_alumni', 'toggle_favorite', 'login'
    mode VARCHAR(50) NOT NULL,        -- 'pitch', 'alumni', 'comparison'
    model_used VARCHAR(50),           -- 'gemini-3.5-flash', etc.
    topic VARCHAR(100),               -- Auto-detected topic or category
    input_snippet TEXT,               -- Truncated input for context (max 200 chars)
    metadata JSONB DEFAULT '{}'::jsonb-- latency_ms, char_count, badge_type, etc.
);

-- 2. Indexes for fast aggregation in the Analytics Dashboard
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.admission_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_user_role ON public.admission_activity_logs(user_role);
CREATE INDEX IF NOT EXISTS idx_activity_user_name ON public.admission_activity_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_activity_action_type ON public.admission_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_mode ON public.admission_activity_logs(mode);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.admission_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert for all users" ON public.admission_activity_logs;
CREATE POLICY "Allow insert for all users" 
ON public.admission_activity_logs 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read access for analytics" ON public.admission_activity_logs;
CREATE POLICY "Allow read access for analytics" 
ON public.admission_activity_logs 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 4. View for Leaderboard Summary (AC & BM usage ranking)
CREATE OR REPLACE VIEW public.v_agent_leaderboard AS
SELECT 
    user_name,
    user_role,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE action_type = 'generate') as total_generates,
    COUNT(*) FILTER (WHERE action_type = 'copy_script') as total_copies,
    COUNT(*) FILTER (WHERE action_type = 'clarify') as total_clarifications,
    ROUND(
      (COUNT(*) FILTER (WHERE action_type = 'copy_script')::numeric / 
       NULLIF(COUNT(*) FILTER (WHERE action_type = 'generate'), 0)::numeric) * 100, 
      1
    ) as copy_conversion_rate,
    MAX(created_at) as last_active_at
FROM public.admission_activity_logs
WHERE user_role IN ('AC', 'BM') AND created_at >= (now() - interval '30 days')
GROUP BY user_name, user_role
ORDER BY total_generates DESC;

-- 5. Force Supabase PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';
