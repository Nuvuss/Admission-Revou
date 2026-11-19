-- ==============================================================================
-- P0.1 SECURITY HARDENING: LOCK DOWN RLS ON admission_users
-- Jalankan di Supabase Project -> SQL Editor
-- ==============================================================================

ALTER TABLE public.admission_users ENABLE ROW LEVEL SECURITY;

-- Hapus policy terbuka yang mengizinkan anon/authenticated membaca & mengubah tabel user
DROP POLICY IF EXISTS "Allow read for authentication" ON public.admission_users;
DROP POLICY IF EXISTS "Allow modify users" ON public.admission_users;

-- Pastikan hak akses langsung untuk role anon & authenticated dicabut dari tabel sensitif
REVOKE ALL ON TABLE public.admission_users FROM anon, authenticated;

-- ==============================================================================
-- LOCK DOWN RLS ON admission_activity_logs & admission_generate_history
-- Mencegah akses baca/tulis langsung lewat NEXT_PUBLIC_SUPABASE_ANON_KEY.
-- ==============================================================================

ALTER TABLE public.admission_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert for all users" ON public.admission_activity_logs;
DROP POLICY IF EXISTS "Allow read access for analytics" ON public.admission_activity_logs;

REVOKE ALL ON TABLE public.admission_activity_logs FROM anon, authenticated;

ALTER TABLE public.admission_generate_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.admission_generate_history FROM anon, authenticated;

-- Catatan: Server Next.js menggunakan SUPABASE_SERVICE_ROLE_KEY yang mem-bypass RLS secara aman.
NOTIFY pgrst, 'reload schema';

