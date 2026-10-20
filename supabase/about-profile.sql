-- Run after works-images-and-storage.sql; this only creates the About table and RLS policies.
-- Safe to re-run: existing About content is preserved.
CREATE TABLE IF NOT EXISTS public.site_profile (
 id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
 photo_url text NOT NULL DEFAULT '',
 intro_en text NOT NULL DEFAULT '', intro_ja text NOT NULL DEFAULT '', intro_zh text NOT NULL DEFAULT '',
 experience_en text NOT NULL DEFAULT '', experience_ja text NOT NULL DEFAULT '', experience_zh text NOT NULL DEFAULT '',
 education_en text NOT NULL DEFAULT '', education_ja text NOT NULL DEFAULT '', education_zh text NOT NULL DEFAULT '',
 skills_en text NOT NULL DEFAULT '', skills_ja text NOT NULL DEFAULT '', skills_zh text NOT NULL DEFAULT '',
 email text NOT NULL DEFAULT '', website text NOT NULL DEFAULT '', instagram text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read About" ON public.site_profile;
CREATE POLICY "Public can read About" ON public.site_profile FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can add About" ON public.site_profile;
CREATE POLICY "Admins can add About" ON public.site_profile FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Admins can update About" ON public.site_profile;
CREATE POLICY "Admins can update About" ON public.site_profile FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid())));
