-- Run ONCE after previous About and Storage migrations. Existing rows are preserved.
BEGIN;
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS career_items jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS education_items jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS footer_links jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE TABLE IF NOT EXISTS public.home_settings (
 id text PRIMARY KEY CHECK (id='main'),
 headline_en text NOT NULL DEFAULT '', headline_ja text NOT NULL DEFAULT '', headline_zh text NOT NULL DEFAULT '',
 description_en text NOT NULL DEFAULT '', description_ja text NOT NULL DEFAULT '', description_zh text NOT NULL DEFAULT '',
 featured_ids jsonb NOT NULL DEFAULT '[]'::jsonb
);
ALTER TABLE public.home_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public home read" ON public.home_settings;
CREATE POLICY "Public home read" ON public.home_settings FOR SELECT TO anon,authenticated USING (true);
DROP POLICY IF EXISTS "Admin home insert" ON public.home_settings;
CREATE POLICY "Admin home insert" ON public.home_settings FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id=(SELECT auth.uid())));
DROP POLICY IF EXISTS "Admin home update" ON public.home_settings;
CREATE POLICY "Admin home update" ON public.home_settings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id=(SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id=(SELECT auth.uid())));
COMMIT;
