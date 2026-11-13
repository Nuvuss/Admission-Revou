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

-- Catatan: Server Next.js menggunakan SUPABASE_SERVICE_ROLE_KEY yang mem-bypass RLS secara aman.
NOTIFY pgrst, 'reload schema';

