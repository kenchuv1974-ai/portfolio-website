-- ==============================================================================
-- ANTIGRAVITY PORTFOLIO CMS - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Portfolio Structured Data Table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id TEXT PRIMARY KEY DEFAULT 'default',
  content JSONB NOT NULL,
  version INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Media Metadata Table
CREATE TABLE IF NOT EXISTS public.portfolio_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  public_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  admin_user TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow ANY public visitor to read published portfolio content
CREATE POLICY "Allow public read access to published portfolio data"
  ON public.portfolio_data
  FOR SELECT
  TO public
  USING (true);

-- Allow public read access to uploaded media
CREATE POLICY "Allow public read access to portfolio media"
  ON public.portfolio_media
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated administrators can insert, update, or delete portfolio content
CREATE POLICY "Allow admin write access to portfolio data"
  ON public.portfolio_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin write access to media metadata"
  ON public.portfolio_media
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin write access to audit logs"
  ON public.admin_audit_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET POLICIES (Supabase Storage: 'portfolio_media')
-- ==============================================================================

-- Storage bucket creation (run via Supabase dashboard or SQL if supported):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio_media', 'portfolio_media', true);

-- Storage Read Policy:
-- CREATE POLICY "Public read for portfolio_media"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (bucket_id = 'portfolio_media');

-- Storage Admin Write Policy:
-- CREATE POLICY "Admin upload for portfolio_media"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'portfolio_media');
