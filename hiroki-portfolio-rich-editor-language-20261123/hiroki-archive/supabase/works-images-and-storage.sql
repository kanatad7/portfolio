-- Execute ONCE in Supabase SQL Editor, after archive-migration.sql.
-- Keep the existing entries data and RLS policies.
BEGIN;
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS works_images jsonb NOT NULL DEFAULT '[]'::jsonb;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-images','portfolio-images',true,10485760,ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;
COMMIT;

-- Storage policies: public read, uploads/changes only for authorized portfolio admins.
-- INSERT, UPDATE and DELETE are separate on purpose.
CREATE POLICY "Portfolio image public read" ON storage.objects
 FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-images');
CREATE POLICY "Portfolio admin image upload" ON storage.objects
 FOR INSERT TO authenticated WITH CHECK (
 bucket_id = 'portfolio-images' AND
 EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid()))
);
CREATE POLICY "Portfolio admin image update" ON storage.objects
 FOR UPDATE TO authenticated USING (
 bucket_id = 'portfolio-images' AND
 EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid()))
) WITH CHECK (
 bucket_id = 'portfolio-images' AND
 EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid()))
);
CREATE POLICY "Portfolio admin image delete" ON storage.objects
 FOR DELETE TO authenticated USING (
 bucket_id = 'portfolio-images' AND
 EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid()))
);
