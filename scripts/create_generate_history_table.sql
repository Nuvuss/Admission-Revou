-- ==============================================================================
-- SCHEMA DEFINITION: admission_generate_history
-- Menyimpan hasil generate penuh per user (input, hasil AI, thread klarifikasi)
-- Run this script inside your Supabase Project -> SQL Editor
-- Akses baca HANYA lewat API server (service role) khusus Owner.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admission_generate_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    activity_id UUID REFERENCES public.admission_activity_logs(id) ON DELETE SET NULL,
    client_session_id TEXT,                    -- "hist-<ts>" dari LocalStorage
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL DEFAULT 'AC',
    mode VARCHAR(50) NOT NULL,                 -- 'pitch', 'alumni', 'comparison'
    model_used VARCHAR(50),
    topic VARCHAR(100),                        -- topik hasil klasifikasi (sama dengan Top Objections)
    input_text TEXT NOT NULL,                  -- input penuh (maks 5.000 char)
    result_json JSONB,                         -- scripts, alumni_matches, comparison_points, dst.
    chat_thread JSONB NOT NULL DEFAULT '[]'::jsonb, -- klarifikasi / follow-up
    duration_ms INT
);

CREATE INDEX IF NOT EXISTS idx_gh_user_created ON public.admission_generate_history(user_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gh_topic ON public.admission_generate_history(topic);
CREATE INDEX IF NOT EXISTS idx_gh_created_at ON public.admission_generate_history(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_gh_user_session ON public.admission_generate_history(user_name, client_session_id);

-- RLS aktif TANPA policy publik: anon/authenticated tidak bisa membaca/menulis langsung.
-- Server memakai SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
ALTER TABLE public.admission_generate_history ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';

